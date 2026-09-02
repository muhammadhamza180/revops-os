import { EngagementEvent, SellerScoreBreakdown, BuyerScoreInput, BuyerScoreResult } from './types';

/**
 * Positive point values defined in GHL Scoring System.pdf
 */
export const SELLER_POINT_VALUES: Record<EngagementEvent, number> = {
  lead_new: 1,
  email_opened: 1,
  email_clicked: 2,
  sms_reply: 3,
  intake_complete: 3,
  call_connected: 4,
  appointment_set: 6,
  offer_sent: 8,
  contract_signed: 15,
};

/**
 * Calculate Seller Motivation Score with time-decay penalties
 * Formula: Score_Seller = sum(Points_Engagement) - sum(Penalties_Decay)
 */
export function calculateSellerMotivationScore(
  events: EngagementEvent[],
  daysInactive: number,
  isAlreadyLocked: boolean = false
): SellerScoreBreakdown {
  if (isAlreadyLocked || events.includes('contract_signed')) {
    const rawPos = events.reduce((sum, ev) => sum + (SELLER_POINT_VALUES[ev] || 0), 0);
    return {
      rawPositivePoints: rawPos,
      decayPenalty: 0,
      netScore: Math.max(30, rawPos),
      clampedScore: Math.min(100, Math.max(30, rawPos)),
      tier: 'TIER_LIVE_DEAL',
      recommendedStage: 'stage_acq_under_contract',
      isLocked: true,
    };
  }

  // 1. Calculate positive engagement points
  const rawPositivePoints = events.reduce((sum, ev) => sum + (SELLER_POINT_VALUES[ev] || 0), 0);

  // 2. Calculate time-decay penalties
  let decayPenalty = 0;
  if (daysInactive >= 90) {
    decayPenalty += 15;
  } else if (daysInactive >= 60) {
    decayPenalty += 6;
  } else if (daysInactive >= 30) {
    decayPenalty += 4;
  } else if (daysInactive >= 14) {
    decayPenalty += 2;
  }

  // 3. Compute net & clamped score
  const netScore = rawPositivePoints - decayPenalty;
  const clampedScore = Math.max(0, Math.min(100, netScore));

  // 4. Determine lifecycle tier & pipeline stage
  let tier: SellerScoreBreakdown['tier'] = 'TIER_NEW_COLD';
  let recommendedStage = 'stage_acq_new';

  if (clampedScore >= 30) {
    tier = 'TIER_LIVE_DEAL';
    recommendedStage = 'stage_acq_under_contract';
  } else if (clampedScore >= 15) {
    tier = 'TIER_HOT_LEAD';
    recommendedStage = 'stage_acq_appt_set';
  } else if (clampedScore >= 5) {
    tier = 'TIER_NURTURE';
    recommendedStage = 'stage_acq_nurture';
  } else {
    tier = 'TIER_NEW_COLD';
    recommendedStage = 'stage_acq_new';
  }

  return {
    rawPositivePoints,
    decayPenalty,
    netScore,
    clampedScore,
    tier,
    recommendedStage,
    isLocked: false,
  };
}

/**
 * Calculate Buyer Qualification & Gamification Score
 * Formula: Score_Buyer = (0.35 * S_POF) + (0.25 * S_Velocity) + (0.25 * S_Response) + (0.15 * S_BuyBox) - Penalties
 */
export function calculateBuyerQualificationScore(input: BuyerScoreInput): BuyerScoreResult {
  // 1. Sub-Score POF (35%)
  let scorePof = 0;
  if (input.verifiedLiquidCash >= 1_000_000) {
    scorePof = 100;
  } else if (input.verifiedLiquidCash >= 250_000) {
    scorePof = 75;
  } else if (input.hardMoneyPreapprovalVerified) {
    scorePof = 50;
  } else {
    scorePof = 0;
  }

  // 2. Sub-Score Velocity (25%)
  let scoreVelocity = 30;
  if (input.dealsClosed90d >= 3) {
    scoreVelocity = 100;
  } else if (input.dealsClosed90d >= 1) {
    scoreVelocity = 70;
  }

  // 3. Sub-Score Response (25%)
  let scoreResponse = 10;
  if (input.avgResponseMinutes <= 15) {
    scoreResponse = 100;
  } else if (input.avgResponseMinutes <= 60) {
    scoreResponse = 70;
  } else if (input.avgResponseMinutes <= 1440) {
    scoreResponse = 40;
  }

  // 4. Sub-Score Buy Box (15%)
  let scoreBuyBox = 10;
  if (input.strictZipAndAssetMatch) {
    scoreBuyBox = 100;
  } else if (input.adjacentCountyMatch) {
    scoreBuyBox = 60;
  }

  // Weighted sum
  const weightedScore =
    0.35 * scorePof + 0.25 * scoreVelocity + 0.25 * scoreResponse + 0.15 * scoreBuyBox;

  // Penalties
  let totalPenalties = 0;
  if (input.penalties?.missed90minEmdDeadline) totalPenalties += 50;
  if (input.penalties?.renegedVerbalAgreement) totalPenalties += 30;
  if (input.penalties?.unauthorizedSellerContact) totalPenalties += 100;

  const rawFinal = weightedScore - totalPenalties;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawFinal * 10) / 10));

  // Tiers
  let tier: BuyerScoreResult['tier'] = 'TIER_4_COLD';
  let broadcastWindow = 'Weekly Digest Only';

  if (finalScore >= 85) {
    tier = 'TIER_1_VIP';
    broadcastWindow = 'Minutes 0 to 15 (Exclusive First Look)';
  } else if (finalScore >= 65) {
    tier = 'TIER_2_HOT';
    broadcastWindow = 'Minutes 15 to 45 (Secondary Window / Instant Reblast Target)';
  } else if (finalScore >= 45) {
    tier = 'TIER_3_WARM';
    broadcastWindow = 'Hour 1+ (General Syndication)';
  } else {
    tier = 'TIER_4_COLD';
    broadcastWindow = 'Weekly Digest Only';
  }

  return {
    scorePof,
    scoreVelocity,
    scoreResponse,
    scoreBuyBox,
    weightedScore: Math.round(weightedScore * 10) / 10,
    totalPenalties,
    finalScore,
    tier,
    broadcastWindow,
  };
}
