import { EmdTimerWorker } from '../webhooks/handlers/emd-timer-worker';
import { EmdTimerRecord } from '../webhooks/handlers/types';

describe('90-Minute Buyer EMD Countdown Worker', () => {
  let worker: EmdTimerWorker;

  beforeEach(() => {
    worker = new EmdTimerWorker();
  });

  test('should report COUNTDOWN_ACTIVE while within 90-minute window', () => {
    const start = new Date('2026-09-02T10:00:00Z');
    const deadline = new Date(start.getTime() + 90 * 60 * 1000); // 11:30:00Z
    const current = new Date('2026-09-02T10:30:00Z'); // 30 minutes in

    const record: EmdTimerRecord = {
      dealId: 'deal_8831',
      buyerId: 'buyer_apex_capital',
      buyerName: 'Apex Capital Partners',
      verbalAcceptAt: start,
      deadlineAt: deadline,
      isExpired: false,
      reblastDispatched: false,
    };

    const res = worker.evaluateEmdTimer(record, current);
    expect(res.status).toBe('COUNTDOWN_ACTIVE');
    expect(res.auditLog).toContain('60 minutes remaining');
  });

  test('should report EMD_CLEARED when wire is confirmed before deadline', () => {
    const start = new Date('2026-09-02T10:00:00Z');
    const deadline = new Date(start.getTime() + 90 * 60 * 1000);
    const confirmed = new Date('2026-09-02T10:45:00Z');

    const record: EmdTimerRecord = {
      dealId: 'deal_8831',
      buyerId: 'buyer_apex_capital',
      buyerName: 'Apex Capital Partners',
      verbalAcceptAt: start,
      deadlineAt: deadline,
      wireConfirmedAt: confirmed,
      isExpired: false,
      reblastDispatched: false,
    };

    const res = worker.evaluateEmdTimer(record, new Date('2026-09-02T11:00:00Z'));
    expect(res.status).toBe('EMD_CLEARED');
    expect(res.auditLog).toContain('EMD Verified');
  });

  test('should trigger EMD_TIMEOUT_BREACH, apply -50 penalty, and dispatch Tier 2 reblast at T+91m', () => {
    const start = new Date('2026-09-02T10:00:00Z');
    const deadline = new Date(start.getTime() + 90 * 60 * 1000); // 11:30:00Z
    const expiredCheck = new Date('2026-09-02T11:31:00Z'); // 1 minute past deadline

    const record: EmdTimerRecord = {
      dealId: 'deal_8831',
      buyerId: 'buyer_apex_capital',
      buyerName: 'Apex Capital Partners',
      verbalAcceptAt: start,
      deadlineAt: deadline,
      isExpired: false,
      reblastDispatched: false,
    };

    const res = worker.evaluateEmdTimer(record, expiredCheck);
    expect(res.status).toBe('EMD_TIMEOUT_BREACH');
    expect(res.record.isExpired).toBe(true);
    expect(res.record.reblastDispatched).toBe(true);
    expect(res.penaltyPointsApplied).toBe(50);
    expect(res.reblastPayload).toBeDefined();
    expect(res.reblastPayload?.targetTier).toBe('TIER_2_HOT');
    expect(res.reblastPayload?.headline).toContain('BACK ON MARKET');
  });
});
