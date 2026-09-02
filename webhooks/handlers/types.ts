export type EngagementEvent =
  | 'lead_new'
  | 'email_opened'
  | 'email_clicked'
  | 'sms_reply'
  | 'intake_complete'
  | 'call_connected'
  | 'appointment_set'
  | 'offer_sent'
  | 'contract_signed';

export interface SellerScoreBreakdown {
  rawPositivePoints: number;
  decayPenalty: number;
  netScore: number;
  clampedScore: number;
  tier: 'TIER_NEW_COLD' | 'TIER_NURTURE' | 'TIER_HOT_LEAD' | 'TIER_LIVE_DEAL';
  recommendedStage: string;
  isLocked: boolean;
}

export interface BuyerScoreInput {
  verifiedLiquidCash: number;
  hardMoneyPreapprovalVerified?: boolean;
  dealsClosed90d: number;
  avgResponseMinutes: number;
  strictZipAndAssetMatch: boolean;
  adjacentCountyMatch?: boolean;
  penalties?: {
    missed90minEmdDeadline?: boolean;
    renegedVerbalAgreement?: boolean;
    unauthorizedSellerContact?: boolean;
  };
}

export interface BuyerScoreResult {
  scorePof: number;
  scoreVelocity: number;
  scoreResponse: number;
  scoreBuyBox: number;
  weightedScore: number;
  totalPenalties: number;
  finalScore: number;
  tier: 'TIER_1_VIP' | 'TIER_2_HOT' | 'TIER_3_WARM' | 'TIER_4_COLD';
  broadcastWindow: string;
}

export type DealType =
  | 'wholesale_assignment'
  | 'novation'
  | 'creative_finance'
  | 'retail_mls'
  | 'joint_venture';

export interface LeadSlaRecord {
  leadId: string;
  assignedRepId: string;
  createdAt: Date;
  lastContactAttemptAt?: Date;
  contactedAt?: Date;
  isBreached: boolean;
  isReassigned: boolean;
  tags: string[];
}

export interface EmdTimerRecord {
  dealId: string;
  buyerId: string;
  buyerName: string;
  verbalAcceptAt: Date;
  deadlineAt: Date;
  wireConfirmedAt?: Date;
  isExpired: boolean;
  reblastDispatched: boolean;
}
