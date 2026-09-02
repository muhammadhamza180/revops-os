# Enterprise 3-Sub-Account Architecture Specification

## Overview & Data Isolation Model
Enterprise real estate and private equity operators handle sensitive seller motivation data, unvetted cold caller queues, and confidential cash buyer lists. Storing all records in a single GoHighLevel sub-account causes data leaks, pipeline clutter, and slow app performance.

This architecture enforces **strict multi-sub-account isolation** connected by automated webhook bridges:

---

```
┌─────────────────────────┐       Webhook Bridge       ┌─────────────────────────┐       Webhook Bridge       ┌─────────────────────────┐
│   SUB-ACCOUNT 01        │ ─────────────────────────> │   SUB-ACCOUNT 02        │ ─────────────────────────> │   SUB-ACCOUNT 03        │
│   Cold Outbound & Lead  │   Auto-Promote Score ≥ 75  │   Acquisitions Core OS  │  Purchase Contract Signed  │   Dispositions & TC     │
│   Intake Processing     │                            │   Underwriting Engine   │                            │   Buyer Blasts & Escrow │
└─────────────────────────┘                            └─────────────────────────┘                            └─────────────────────────┘
```

### Sub-Account 01: Cold Outbound & Inbound Ingestion
- **Role**: High-volume top-of-funnel filtering.
- **Pipelines**: `Cold Intake`, `Nurture & Drips`, `Stale Recycling (30-Day Loop)`.
- **Key Automations**:
  - Inbound webhook validation and spam suppression.
  - Automated opt-out compliance (DND tagging and immediate campaign unenrollment).
  - Mathematical Lead Qualification Scoring Engine (#1).

### Sub-Account 02: Acquisitions Core OS
- **Role**: High-intent seller negotiation, underwriting, and purchase contract closing.
- **Pipelines**: `Active Negotiations`, `Underwriting & Comp Analysis`, `Contracts Out / Pending Signature`.
- **Key Automations**:
  - Round-robin lead distribution to on-duty acquisition representatives.
  - **24-Hour & 48-Hour SLA Escalation Guard**: Automatic manager notification if a qualified lead is not contacted within 4 hours.
  - Dynamic purchase contract generation and DocuSign/PandaDoc webhook synchronization.

### Sub-Account 03: Dispositions & Transaction Coordination (TC)
- **Role**: VIP cash buyer matching, assignment contracts, title escrow, and closing.
- **Pipelines**: `VIP Buyer Matching`, `Under Title / Escrow`, `Closed & Commission Disbursed`.
- **Key Automations**:
  - Broadcast email and SMS blasts to segmented cash buyer lists based on target buy box and geographical radius.
  - Automated Earnest Money Deposit (EMD) verification countdown timer.
  - Title company milestone tracking and closing statement generation.
