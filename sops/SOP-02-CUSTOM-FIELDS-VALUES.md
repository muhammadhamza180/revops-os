# SOP-02: Custom Fields & Custom Values Data Dictionary

**Version**: 2.3.0  
**Domain**: Data Integrity & CRM Custom Fields  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  

---

## 1. Objective
Define and standardize the 48 custom fields and global custom values across all 3 sub-accounts, ensuring zero schema mismatch during cross-tenant webhook payload synchronization.

---

## 2. Core Custom Fields Dictionary

### 2.1 Acquisitions Sub-Account Fields (16 Fields)
| Field Key | Label | Data Type | Validation Regex / Options | Sub-Account Scoping |
|---|---|---|---|---|
| `lead_score` | Seller Motivation Score | Numerical (Integer) | `^[0-9]{1,3}$` [0–100] | Acquisitions |
| `property_address` | Property Street Address | Single Line Text | Required | Acquisitions, TC |
| `property_city` | Property City | Single Line Text | Required | All Sub-Accounts |
| `property_state` | Property State | Single Line Text (2 Chars) | `^[A-Z]{2}$` | All Sub-Accounts |
| `property_zip` | Property ZIP Code | Single Line Text | `^\d{5}(-\d{4})?$` | All Sub-Accounts |
| `asking_price` | Seller Asking Price | Monetary (USD) | Currency | Acquisitions |
| `estimated_arv` | Estimated After-Repair Value (ARV) | Monetary (USD) | Currency | Acquisitions, Dispo |
| `estimated_rehab` | Estimated Renovation Cost | Monetary (USD) | Currency | Acquisitions, TC, Dispo |
| `max_allowable_offer` | Max Allowable Offer (MAO) | Monetary (USD) | Currency | Acquisitions |
| `seller_urgency` | Seller Timeline Urgency | Dropdown | `high_30d`, `medium_60d`, `low_90d+` | Acquisitions |
| `occupancy_status` | Property Occupancy | Dropdown | `vacant`, `owner_occupied`, `tenant_occupied` | Acquisitions, TC |
| `roof_age_years` | Roof Age (Years) | Numerical (Integer) | `^[0-9]{1,2}$` | Acquisitions |
| `hvac_condition` | HVAC Unit Condition | Dropdown | `operational`, `needs_replacement`, `unknown` | Acquisitions |
| `mortgage_balance` | Existing Mortgage Balance | Monetary (USD) | Currency | Acquisitions, TC |
| `monthly_piti` | Monthly PITI Payment | Monetary (USD) | Currency | Acquisitions, TC |
| `lead_sla_status` | SLA Compliance Status | Dropdown | `within_sla`, `warning_24h`, `breached_48h` | Acquisitions |

### 2.2 Transaction Coordination Sub-Account Fields (16 Fields)
| Field Key | Label | Data Type | Validation Regex / Options | Sub-Account Scoping |
|---|---|---|---|---|
| `deal_type` | Transaction Route | Dropdown | `wholesale_assignment`, `novation`, `creative_finance`, `retail_mls`, `joint_venture` | TC, Dispo |
| `purchase_price` | Contract Purchase Price | Monetary (USD) | Currency | TC |
| `earnest_money_seller` | EMD to Seller Escrow | Monetary (USD) | Currency | TC |
| `contract_executed_date` | Purchase Contract Date | Date Picker | `YYYY-MM-DD` | TC |
| `target_closing_date` | Scheduled Closing Date | Date Picker | `YYYY-MM-DD` | TC, Dispo |
| `title_company_name` | Closing Title Agency | Single Line Text | Text | TC |
| `title_officer_email` | Escrow Officer Email | Email Address | Email | TC |
| `title_escrow_number` | Title Escrow File # | Single Line Text | Text | TC |
| `title_commitment_status` | Preliminary Title Status | Dropdown | `ordered`, `received_clear`, `cloud_detected`, `closed` | TC |
| `inspection_period_expires` | Inspection Expiration Date | Date Picker | `YYYY-MM-DD` | TC |
| `psa_document_url` | Executed PSA Document Link | URL | `https://.*` | TC |
| `assignment_fee` | Anticipated Assignment Spread | Monetary (USD) | Currency | TC, Dispo |
| `jv_partner_name` | JV Partner Entity | Single Line Text | Text | TC |
| `jv_split_percentage` | JV Partner Split | Numerical (Percentage) | `^[0-9]{1,2}$%` | TC |
| `subto_lender_name` | Underlying Mortgage Servicer | Single Line Text | Text | TC |
| `risk_alert_flag` | Active Risk Trigger | Dropdown | `none`, `missing_emd`, `title_cloud`, `contractor_delay`, `funding_risk` | TC |

### 2.3 Dispositions Sub-Account Fields (16 Fields)
| Field Key | Label | Data Type | Validation Regex / Options | Sub-Account Scoping |
|---|---|---|---|---|
| `buyer_score` | Buyer Qualification Score | Numerical (Float/Int) | `^[0-9]{1,3}(\.[0-9])?$` [0–100] | Dispositions |
| `buyer_tier` | Cash Buyer Priority Tier | Dropdown | `TIER_1_VIP`, `TIER_2_HOT`, `TIER_3_WARM`, `TIER_4_COLD` | Dispositions |
| `verified_liquid_cash` | Verified Proof of Funds ($) | Monetary (USD) | Currency | Dispositions |
| `pof_verified_date` | POF Verification Date | Date Picker | `YYYY-MM-DD` (Max 30d) | Dispositions |
| `deals_closed_90d` | Prior Closed Transactions (90d) | Numerical (Integer) | `^[0-9]{1,3}$` | Dispositions |
| `target_zip_codes` | Target Buying ZIPs | Multi-Line Text | Comma-separated | Dispositions |
| `target_asset_classes` | Target Property Classes | Checkbox | Single Family, Multi-Family, Land, Commercial | Dispositions |
| `max_purchase_capacity` | Maximum Single Deal Budget | Monetary (USD) | Currency | Dispositions |
| `assigned_buyer_id` | Locked Buyer Contact ID | Single Line Text | ID | Dispositions, TC |
| `buyer_verbal_accept_at` | Verbal Agreement Timestamp | Date Time | ISO 8601 | Dispositions |
| `emd_90m_deadline_at` | 90-Minute EMD Wire Deadline | Date Time | ISO 8601 | Dispositions |
| `emd_status` | Buyer Wire Status | Dropdown | `pending_90m`, `wire_verified`, `failed_timeout` | Dispositions |
| `buyer_penalties_count` | Historical Breach Count | Numerical (Integer) | `^[0-9]+$` | Dispositions |
| `deal_packet_link` | Full Diligence Packet URL | URL | `https://.*` | Dispositions |
| `dispo_rep_assigned` | Assigned Dispo Specialist | Single Line Text | Name | Dispositions |
| `opt_in_sms_deal_blast` | SMS Deal Notification Consent | Boolean | `true` / `false` | Dispositions |

---

## 3. Global Custom Values Setup
Ensure the following Custom Values are populated in **Agency Settings** > **Custom Values**:
- `{{custom_values.company_name}}`: `"Enterprise Acquisitions Group"`
- `{{custom_values.support_email}}`: `"hamza@hamzabuildai.com"`
- `{{custom_values.calendar_booking_link}}`: `"https://cal.com/hamzabuildai/discovery"`
- `{{custom_values.dispo_portal_url}}`: `"https://hamzabuildai.com/deals"`
- `{{custom_values.title_escrow_deposit_limit_hours}}`: `"48"`
- `{{custom_values.buyer_emd_countdown_minutes}}`: `"90"`
