import { SlaEscalationCron } from '../webhooks/handlers/sla-escalation-cron';
import { LeadSlaRecord } from '../webhooks/handlers/types';

describe('SLA Escalation & Lead Revocation Engine', () => {
  let cron: SlaEscalationCron;

  beforeEach(() => {
    cron = new SlaEscalationCron(['rep_alex', 'rep_sarah', 'rep_marcus']);
  });

  test('should take NO_ACTION if lead is within standard <24h window', () => {
    const now = new Date('2026-09-02T12:00:00Z');
    const lead: LeadSlaRecord = {
      leadId: 'lead_101',
      assignedRepId: 'rep_alex',
      createdAt: new Date('2026-09-02T04:00:00Z'), // 8 hours old
      isBreached: false,
      isReassigned: false,
      tags: ['lead_new'],
    };

    const result = cron.evaluateLeadSla(lead, now);
    expect(result.actionTaken).toBe('NO_ACTION');
    expect(result.record.isBreached).toBe(false);
    expect(result.record.assignedRepId).toBe('rep_alex');
  });

  test('should issue WARNING_ISSUED when lead is between 24h and 48h uncontacted', () => {
    const now = new Date('2026-09-02T12:00:00Z');
    const lead: LeadSlaRecord = {
      leadId: 'lead_102',
      assignedRepId: 'rep_alex',
      createdAt: new Date('2026-09-01T08:00:00Z'), // 28 hours old
      isBreached: false,
      isReassigned: false,
      tags: ['lead_new'],
    };

    const result = cron.evaluateLeadSla(lead, now);
    expect(result.actionTaken).toBe('WARNING_ISSUED');
    expect(result.warningDispatched).toBe(true);
    expect(result.record.tags).toContain('sla_warning_24h');
    expect(result.record.assignedRepId).toBe('rep_alex');
  });

  test('should execute 48h LEAD_REVOKED_REASSIGNED and rotate rep via round-robin', () => {
    const now = new Date('2026-09-02T12:00:00Z');
    const lead: LeadSlaRecord = {
      leadId: 'lead_103',
      assignedRepId: 'rep_alex',
      createdAt: new Date('2026-08-30T10:00:00Z'), // 74 hours old
      isBreached: false,
      isReassigned: false,
      tags: ['lead_new', 'sla_warning_24h'],
    };

    const result = cron.evaluateLeadSla(lead, now);
    expect(result.actionTaken).toBe('LEAD_REVOKED_REASSIGNED');
    expect(result.record.isBreached).toBe(true);
    expect(result.record.isReassigned).toBe(true);
    expect(result.record.assignedRepId).not.toBe('rep_alex');
    expect(result.record.tags).toContain('sla_breach_reassigned');
    expect(result.record.tags).not.toContain('lead_new');
  });

  test('should satisfy SLA with NO_ACTION if lead was already contacted', () => {
    const now = new Date('2026-09-02T12:00:00Z');
    const lead: LeadSlaRecord = {
      leadId: 'lead_104',
      assignedRepId: 'rep_alex',
      createdAt: new Date('2026-08-28T10:00:00Z'),
      contactedAt: new Date('2026-08-28T11:00:00Z'),
      isBreached: false,
      isReassigned: false,
      tags: ['contacted'],
    };

    const result = cron.evaluateLeadSla(lead, now);
    expect(result.actionTaken).toBe('NO_ACTION');
    expect(result.auditMessage).toContain('SLA Satisfied');
  });
});
