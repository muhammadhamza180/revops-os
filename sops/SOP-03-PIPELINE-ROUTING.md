# SOP-03: Pipeline Configuration & 5 Deal-Type Routing Trees

**Version**: 2.2.0  
**Domain**: Pipeline Architecture & Transaction Operations  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  

---

## 1. Objective
Establish standard operating protocols for routing incoming transactions through 7 automated pipelines, with dedicated milestone chains for 5 distinct real estate closing mechanisms.

---

## 2. Five Deal-Type Routing Specifications

```
                       [CONTRACT SIGNED]
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     [01. WHOLESALE]     [02. NOVATION]     [03. CREATIVE]
     21-Day Escrow       60-Day Rehab/MLS   30-Day Sub-To
     Assignment Fee      Guaranteed Net     Loan Servicing
            │                  │                  │
            └──────────┬───────┴──────────────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
     [04. RETAIL MLS]       [05. JOINT VENTURE]
     45-Day Brokerage       21-Day Co-Wholesale
     Commission Split       50/50 Fee Split
```

### Route 01: Wholesale Assignment (21-Day Standard)
1. **Trigger**: Tag `deal_type_wholesale` applied.
2. **Escrow Timeline**: Day 1 Open Escrow -> Day 2 Verify Seller EMD -> Day 5 Photo Walkthrough -> Day 10 Dispo Lock -> Day 14 Assignment Executed -> Day 21 Wire Fee Disbursement.
3. **Approval Gate**: Assignment Contract must be signed by verified Tier 1/2 cash buyer with title wire receipt attached.

### Route 02: Novation Route (60-Day Renovation & MLS Syndication)
1. **Trigger**: Tag `deal_type_novation` applied.
2. **Key Requirements**:
   - Notarized Limited Power of Attorney (POA) from Seller.
   - Guaranteed Net Sheet Agreement specifying seller's fixed payout.
   - Contractor repair budget capped at $<35,000 with 14-day completion SLA.
3. **Closing Gate**: Dual Settlement closing: Escrow wires seller guaranteed net, reimburses contractor draws, and distributes remaining profit spread.

### Route 03: Creative Finance Route (Subject-To / Seller Wrap)
1. **Trigger**: Tag `deal_type_creative` applied.
2. **Key Requirements**:
   - Verification of underlying mortgage PITI, current balance, and interest rate.
   - Third-party loan servicing account created (e.g. Weststar, EscrowServicing LLC).
   - Hazard insurance endorsed with new buyer as Primary Named Insured and lender as Additional Loss Payee.
   - Due-on-sale risk disclosure signed by all parties.

### Route 04: Retail MLS Listing Route (45-Day Brokerage)
1. **Trigger**: Tag `deal_type_retail_mls` applied.
2. **Key Requirements**:
   - Executed Exclusive Right to Sell listing contract with agreed commission split.
   - Professional photography & 3D Matterport scan ordered.
   - Published to regional MLS within 5 business days.

### Route 05: Joint Venture (JV) Route (21-Day Co-Wholesale)
1. **Trigger**: Tag `deal_type_joint_venture` applied.
2. **Key Requirements**:
   - Executed JV Agreement defining percentage splits (e.g. 50/50).
   - Joint title escrow instructions signed by both operating entities.

---

## 3. Maintenance & Exception Handling
- If a deal structure modifies mid-escrow (e.g., Wholesale switches to Novation due to retail buyer demand), the TC lead updates the custom field `deal_type` in GHL, triggering automated pipeline re-routing and workflow reassignment.
