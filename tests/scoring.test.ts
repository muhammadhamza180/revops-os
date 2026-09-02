import {
  calculateSellerMotivationScore,
  calculateBuyerQualificationScore,
  SELLER_POINT_VALUES,
} from '../webhooks/handlers/scoring-engine';
import { EngagementEvent } from '../webhooks/handlers/types';

describe('Seller Motivation Scoring Engine', () => {
  test('should calculate correct positive points for individual engagement events', () => {
    expect(SELLER_POINT_VALUES.lead_new).toBe(1);
    expect(SELLER_POINT_VALUES.email_opened).toBe(1);
    expect(SELLER_POINT_VALUES.email_clicked).toBe(2);
    expect(SELLER_POINT_VALUES.sms_reply).toBe(3);
    expect(SELLER_POINT_VALUES.intake_complete).toBe(3);
    expect(SELLER_POINT_VALUES.call_connected).toBe(4);
    expect(SELLER_POINT_VALUES.appointment_set).toBe(6);
    expect(SELLER_POINT_VALUES.offer_sent).toBe(8);
    expect(SELLER_POINT_VALUES.contract_signed).toBe(15);
  });

  test('should assign fresh lead with 1 point to TIER_NEW_COLD', () => {
    const res = calculateSellerMotivationScore(['lead_new'], 0);
    expect(res.rawPositivePoints).toBe(1);
    expect(res.decayPenalty).toBe(0);
    expect(res.clampedScore).toBe(1);
    expect(res.tier).toBe('TIER_NEW_COLD');
    expect(res.recommendedStage).toBe('stage_acq_new');
    expect(res.isLocked).toBe(false);
  });

  test('should elevate score to TIER_NURTURE when engagement reaches 5-14 pts', () => {
    // lead_new (1) + sms_reply (3) + intake_complete (3) = 7 pts
    const events: EngagementEvent[] = ['lead_new', 'sms_reply', 'intake_complete'];
    const res = calculateSellerMotivationScore(events, 2);
    expect(res.rawPositivePoints).toBe(7);
    expect(res.clampedScore).toBe(7);
    expect(res.tier).toBe('TIER_NURTURE');
    expect(res.recommendedStage).toBe('stage_acq_nurture');
  });

  test('should elevate score to TIER_HOT_LEAD when score >= 15 pts', () => {
    // lead_new (1) + sms_reply (3) + intake_complete (3) + appointment_set (6) + call_connected (4) = 17 pts
    const events: EngagementEvent[] = [
      'lead_new',
      'sms_reply',
      'intake_complete',
      'appointment_set',
      'call_connected',
    ];
    const res = calculateSellerMotivationScore(events, 1);
    expect(res.rawPositivePoints).toBe(17);
    expect(res.clampedScore).toBe(17);
    expect(res.tier).toBe('TIER_HOT_LEAD');
    expect(res.recommendedStage).toBe('stage_acq_appt_set');
  });

  test('should apply time decay penalties accurately at 14d, 30d, 60d, 90d', () => {
    const events: EngagementEvent[] = ['lead_new', 'sms_reply', 'intake_complete', 'call_connected']; // 1+3+3+4 = 11 pts

    // 0 days inactive: 0 penalty
    expect(calculateSellerMotivationScore(events, 0).decayPenalty).toBe(0);
    expect(calculateSellerMotivationScore(events, 0).clampedScore).toBe(11);

    // 14 days inactive: -2 penalty (net 9)
    expect(calculateSellerMotivationScore(events, 14).decayPenalty).toBe(2);
    expect(calculateSellerMotivationScore(events, 14).clampedScore).toBe(9);

    // 30 days inactive: -4 penalty (net 7)
    expect(calculateSellerMotivationScore(events, 30).decayPenalty).toBe(4);
    expect(calculateSellerMotivationScore(events, 30).clampedScore).toBe(7);

    // 60 days inactive: -6 penalty (net 5)
    expect(calculateSellerMotivationScore(events, 60).decayPenalty).toBe(6);
    expect(calculateSellerMotivationScore(events, 60).clampedScore).toBe(5);

    // 90 days inactive: -15 penalty (net 11-15 = -4 -> clamped to 0)
    expect(calculateSellerMotivationScore(events, 90).decayPenalty).toBe(15);
    expect(calculateSellerMotivationScore(events, 90).clampedScore).toBe(0);
    expect(calculateSellerMotivationScore(events, 90).tier).toBe('TIER_NEW_COLD');
  });

  test('should lock score and assign TIER_LIVE_DEAL on contract_signed', () => {
    const events: EngagementEvent[] = [
      'lead_new',
      'intake_complete',
      'appointment_set',
      'offer_sent',
      'contract_signed',
    ];
    const res = calculateSellerMotivationScore(events, 100); // even with 100d decay
    expect(res.isLocked).toBe(true);
    expect(res.tier).toBe('TIER_LIVE_DEAL');
    expect(res.recommendedStage).toBe('stage_acq_under_contract');
    expect(res.clampedScore).toBeGreaterThanOrEqual(30);
  });
});

describe('Buyer Qualification & Gamification Scoring Engine', () => {
  test('should calculate Tier 1 VIP score for liquid high-velocity investor', () => {
    const res = calculateBuyerQualificationScore({
      verifiedLiquidCash: 1_200_000, // 100 pts * 0.35 = 35
      dealsClosed90d: 4, // 100 pts * 0.25 = 25
      avgResponseMinutes: 10, // 100 pts * 0.25 = 25
      strictZipAndAssetMatch: true, // 100 pts * 0.15 = 15
    });

    expect(res.scorePof).toBe(100);
    expect(res.scoreVelocity).toBe(100);
    expect(res.scoreResponse).toBe(100);
    expect(res.scoreBuyBox).toBe(100);
    expect(res.weightedScore).toBe(100);
    expect(res.finalScore).toBe(100);
    expect(res.tier).toBe('TIER_1_VIP');
    expect(res.broadcastWindow).toContain('Minutes 0 to 15');
  });

  test('should calculate Tier 2 Hot Cash score for moderate balance investor', () => {
    const res = calculateBuyerQualificationScore({
      verifiedLiquidCash: 350_000, // 75 pts * 0.35 = 26.25
      dealsClosed90d: 1, // 70 pts * 0.25 = 17.5
      avgResponseMinutes: 45, // 70 pts * 0.25 = 17.5
      strictZipAndAssetMatch: true, // 100 pts * 0.15 = 15
    });

    // 26.25 + 17.5 + 17.5 + 15 = 76.25 -> 76.3
    expect(res.finalScore).toBe(76.3);
    expect(res.tier).toBe('TIER_2_HOT');
    expect(res.broadcastWindow).toContain('Minutes 15 to 45');
  });

  test('should deduct -50 penalty points on missed 90-min EMD deadline and demote tier', () => {
    const res = calculateBuyerQualificationScore({
      verifiedLiquidCash: 1_000_000, // 35
      dealsClosed90d: 3, // 25
      avgResponseMinutes: 12, // 25
      strictZipAndAssetMatch: true, // 15 (Total 100)
      penalties: {
        missed90minEmdDeadline: true, // -50 penalty
      },
    });

    expect(res.weightedScore).toBe(100);
    expect(res.totalPenalties).toBe(50);
    expect(res.finalScore).toBe(50);
    expect(res.tier).toBe('TIER_3_WARM'); // Demoted from Tier 1 VIP to Tier 3 Warm
  });

  test('should clamp negative scores to 0', () => {
    const res = calculateBuyerQualificationScore({
      verifiedLiquidCash: 0,
      dealsClosed90d: 0,
      avgResponseMinutes: 3000,
      strictZipAndAssetMatch: false,
      penalties: {
        unauthorizedSellerContact: true, // -100
        renegedVerbalAgreement: true, // -30
      },
    });

    expect(res.finalScore).toBe(0);
    expect(res.tier).toBe('TIER_4_COLD');
  });
});
