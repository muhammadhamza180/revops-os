import { EmdTimerRecord } from './types';

export interface EmdEvaluationResult {
  status: 'EMD_CLEARED' | 'COUNTDOWN_ACTIVE' | 'EMD_TIMEOUT_BREACH';
  record: EmdTimerRecord;
  penaltyPointsApplied?: number;
  reblastPayload?: {
    dealId: string;
    targetTier: 'TIER_2_HOT';
    headline: string;
    broadcastTimestamp: string;
  };
  auditLog: string;
}

export class EmdTimerWorker {
  /**
   * Evaluates a buyer's 90-minute EMD countdown state
   */
  public evaluateEmdTimer(record: EmdTimerRecord, now: Date = new Date()): EmdEvaluationResult {
    // 1. Escrow Wire already confirmed by Title Company
    if (record.wireConfirmedAt) {
      return {
        status: 'EMD_CLEARED',
        record,
        auditLog: `✅ EMD Verified: Buyer ${record.buyerName} confirmed wire for deal ${record.dealId} at ${record.wireConfirmedAt.toISOString()}.`,
      };
    }

    // 2. Check if 90-minute deadline has passed
    const isPastDeadline = now.getTime() > record.deadlineAt.getTime();

    if (isPastDeadline) {
      const updatedRecord: EmdTimerRecord = {
        ...record,
        isExpired: true,
        reblastDispatched: true,
      };

      return {
        status: 'EMD_TIMEOUT_BREACH',
        record: updatedRecord,
        penaltyPointsApplied: 50,
        reblastPayload: {
          dealId: record.dealId,
          targetTier: 'TIER_2_HOT',
          headline: `🚨 BACK ON MARKET: Buyer failed 90-min wire deadline on Deal ${record.dealId}. Released to Tier 2 Investors.`,
          broadcastTimestamp: now.toISOString(),
        },
        auditLog: `🚨 90-Min EMD Breach: Buyer ${record.buyerName} failed wire deadline for Deal ${record.dealId}. Applied -50 pts penalty and triggered automated Tier 2 reblast.`,
      };
    }

    // 3. Countdown is still active
    const minutesRemaining = Math.max(0, Math.round((record.deadlineAt.getTime() - now.getTime()) / (1000 * 60)));
    return {
      status: 'COUNTDOWN_ACTIVE',
      record,
      auditLog: `⏳ EMD Countdown Active: ${minutesRemaining} minutes remaining for Buyer ${record.buyerName} on Deal ${record.dealId}.`,
    };
  }
}
