import { DealType } from './types';

export interface DealRouteResult {
  dealType: DealType;
  pipelineId: string;
  targetClosingDays: number;
  requiredDocumentSlots: string[];
  initialTasks: string[];
}

export function routeDealByType(dealType: DealType): DealRouteResult {
  switch (dealType) {
    case 'wholesale_assignment':
      return {
        dealType,
        pipelineId: 'pipe_tc_wholesale_v1',
        targetClosingDays: 21,
        requiredDocumentSlots: [
          'executed_purchase_agreement',
          'seller_id_verification',
          'title_commitment_prelim',
          'assignment_agreement_buyer',
          'buyer_earnest_money_receipt',
          'settlement_statement_hud',
        ],
        initialTasks: [
          'Open Escrow with Title Company (12h SLA)',
          'Verify Seller EMD Wire Confirmation (48h SLA)',
          'Dispatch Property Walkthrough Media Specialist',
        ],
      };

    case 'novation':
      return {
        dealType,
        pipelineId: 'pipe_tc_novation_v1',
        targetClosingDays: 60,
        requiredDocumentSlots: [
          'novation_agreement_signed',
          'limited_power_of_attorney',
          'seller_net_sheet_guarantee',
          'contractor_scope_of_work',
          'mls_listing_agreement',
          'retail_buyer_purchase_contract',
        ],
        initialTasks: [
          'Execute Notarized POA & Novation Agreement with Seller',
          'Order Contractor Renovation Bid (5-day SLA)',
          'Schedule Professional Real Estate Media',
        ],
      };

    case 'creative_finance':
      return {
        dealType,
        pipelineId: 'pipe_tc_creative_v1',
        targetClosingDays: 30,
        requiredDocumentSlots: [
          'subject_to_addendum',
          'existing_mortgage_statements_3mo',
          'authorization_to_release_info',
          'deed_of_trust_warranty_deed',
          'hazard_insurance_loss_payee',
          'due_on_sale_disclosure_acknowledgment',
        ],
        initialTasks: [
          'Order Formal Underlying Mortgage Payoff Statement',
          'Set up 3rd-Party Escrow Servicing Account',
          'Endorse Homeowners Insurance with Loss Payee Named',
        ],
      };

    case 'retail_mls':
      return {
        dealType,
        pipelineId: 'pipe_tc_mls_v1',
        targetClosingDays: 45,
        requiredDocumentSlots: [
          'exclusive_right_to_sell_listing_agreement',
          'seller_property_condition_disclosure',
          'lead_based_paint_disclosure',
          'mls_input_sheet',
          'professional_media_packet',
        ],
        initialTasks: [
          'Sign Brokerage Exclusive Right to Sell Agreement',
          'Commission 3D Virtual Tour & Drone Photography',
          'Publish Live to Regional MLS & Real-Time Syndication',
        ],
      };

    case 'joint_venture':
      return {
        dealType,
        pipelineId: 'pipe_tc_jv_v1',
        targetClosingDays: 21,
        requiredDocumentSlots: [
          'executed_jv_operating_agreement',
          'primary_seller_purchase_contract',
          'joint_closing_instruction_to_title',
          'partner_w9_identification',
        ],
        initialTasks: [
          'Sign Joint Venture Agreement with 50/50 Profit Split',
          'Submit Joint Closing Instructions to Escrow Officer',
          'Syndicate Deal Packet to Shared Buyer Network',
        ],
      };

    default:
      throw new Error(`Unknown deal type: ${dealType}`);
  }
}
