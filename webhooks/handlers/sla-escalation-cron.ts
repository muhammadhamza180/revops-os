import { LeadSlaRecord } from './types';

export interface SlaCheckResult {
  actionTaken: 'NO_ACTION' | 'WARNING_ISSUED' | 'LEAD_REVOKED_REASSIGNED';
  record: LeadSlaRecord;
  warningDispatched?: boolean;
  reassignedTo?: string;
  auditMessage: string;
}

export class SlaEscalationCron {
  private activeRepRoundRobin: string[];
  private currentRepIndex: number = 0;

  constructor(activeRepPool: string[] = ['rep_closer_alex', 'rep_closer_sarah', 'rep_closer_marcus']) {
    this.activeRepRoundRobin = activeRepPool;
  }

  public getNextRep(excludeRepId?: string): string {
    if (this.activeRepRoundRobin.length === 0) return 'unassigned_pool';
    
    for (let i = 0; i < this.activeRepRoundRobin.length; i++) {
      const rep = this.activeRepRoundRobin[this.currentRepIndex];
      this.currentRepIndex = (this.currentRepIndex + 1) % this.activeRepRoundRobin.length;
      if (rep !== excludeRepId) {
        return rep;
      }
    }
    return this.activeRepRoundRobin[0];
  }

  /**
   * Evaluate a single lead for 24h / 48h SLA compliance
   */
  public evaluateLeadSla(record: LeadSlaRecord, now: Date = new Date()): SlaCheckResult {
    // If already contacted, SLA is satisfied
    if (record.contactedAt) {
      return {
        actionTaken: 'NO_ACTION',
        record,
        auditMessage: `SLA Satisfied: Lead ${record.leadId} contacted at ${record.contactedAt.toISOString()}`,
      };
    }

    const elapsedMs = now.getTime() - record.createdAt.getTime();
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    // Rule 1: 48h+ Inactivity Breach -> Revoke and Reassign
    if (elapsedHours >= 48) {
      const previousRep = record.assignedRepId;
      const nextRep = this.getNextRep(previousRep);

      const updatedRecord: LeadSlaRecord = {
        ...record,
        assignedRepId: nextRep,
        isBreached: true,
        isReassigned: true,
        tags: [...record.tags.filter((t) => t !== 'lead_new'), 'sla_breach_reassigned'],
      };

      return {
        actionTaken: 'LEAD_REVOKED_REASSIGNED',
        record: updatedRecord,
        reassignedTo: nextRep,
        auditMessage: `🚨 48h SLA Breach: Lead ${record.leadId} revoked from ${previousRep} and reassigned to ${nextRep} after ${elapsedHours.toFixed(1)}h uncontacted.`,
      };
    }

    // Rule 2: 24h - 48h Inactivity Warning
    if (elapsedHours >= 24) {
      const updatedRecord: LeadSlaRecord = {
        ...record,
        tags: Array.from(new Set([...record.tags, 'sla_warning_24h'])),
      };

      return {
        actionTaken: 'WARNING_ISSUED',
        record: updatedRecord,
        warningDispatched: true,
        auditMessage: `⚠️ 24h SLA Warning: Lead ${record.leadId} uncontacted after ${elapsedHours.toFixed(1)}h. Alert sent to ${record.assignedRepId}.`,
      };
    }

    // Rule 3: Within standard <24h window
    return {
      actionTaken: 'NO_ACTION',
      record,
      auditMessage: `SLA Active: Lead ${record.leadId} is within standard window (${elapsedHours.toFixed(1)}h elapsed).`,
    };
  }

  /**
   * Process a batch of leads (Simulated Cron run)
   */
  public processBatch(records: LeadSlaRecord[], now: Date = new Date()): SlaCheckResult[] {
    return records.map((rec) => this.evaluateLeadSla(rec, now));
  }
}
