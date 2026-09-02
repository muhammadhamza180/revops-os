# SOP-01: Snapshot Provisioning & 3-Sub-Account Isolation

**Version**: 2.4.0  
**Domain**: Enterprise RevOps Mesh  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  
**Security Level**: Strict Role Isolation  

---

## 1. Objective
Establish a clean, multi-tenant 3-sub-account GoHighLevel infrastructure that completely isolates Acquisitions, Transaction Coordination (TC), and Dispositions while maintaining automated programmatic bridges between stages.

---

## 2. Infrastructure Architecture
```
                          [AGENCY UMBRELLA ACCOUNT]
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
[01-ACQUISITIONS]            [02-COORDINATION]            [03-DISPOSITIONS]
  Location: loc_acq_01         Location: loc_tc_02          Location: loc_dispo_03
  Focus: Lead Intake           Focus: Title & Milestones    Focus: Cash Buyer Pool
  SLA: 24h/48h Lead SLA        SLA: 48h EMD / Risk Alarms   SLA: 90-Min EMD Countdown
```

---

## 3. Step-by-Step Provisioning Checklist

### Phase 1: Agency Level Sub-Account Creation
1. Log in to the GoHighLevel Agency Admin Console (`https://app.gohighlevel.com`).
2. Navigate to **Agency View** > **Sub-Accounts** > **+ Create Sub-Account**.
3. Create the 3 mandatory sub-accounts with standardized naming conventions:
   - **Account 1**: `[ACQ] Enterprise Acquisitions Mesh - Location ID: {{LOC_ACQ_ID}}`
   - **Account 2**: `[TC] Enterprise Coordination Hub - Location ID: {{LOC_TC_ID}}`
   - **Account 3**: `[DISPO] Enterprise Dispositions Engine - Location ID: {{LOC_DISPO_ID}}`
4. Set Company Timezone to the operational headquarters timezone (e.g., `America/Chicago` or `America/New_York`).
5. Ensure Twilio 10DLC Brand and Campaign registrations are linked per sub-account for carrier-compliant SMS deliverability.

### Phase 2: Snapshot Import & Asset Deployment
1. Navigate to **Agency Settings** > **Snapshot Management**.
2. Select `Enterprise-GHL-RevOps-Mesh-Bundle-v2.4.snapshot` (or import JSON blueprint schemas).
3. Push snapshot assets into each designated sub-account:
   - Push **Acquisitions Asset Pack** -> Sub-Account 01
   - Push **Transaction Coordination Asset Pack** -> Sub-Account 02
   - Push **Dispositions Asset Pack** -> Sub-Account 03
4. Select **Conflict Resolution Mode**: `Overwrite existing assets` for fresh installations or `Keep existing data` for incremental upgrades.

### Phase 3: Webhook Bridge Registration
1. In Sub-Account 01 (Acquisitions), open **Automation** > **Workflows** > `WF-ACQ-08: Handoff Under Contract to TC`.
2. Configure HTTP Webhook action targeting Sub-Account 02:
   - **URL**: `https://api.yourdomain.com/webhooks/ghl/tc-handoff`
   - **Method**: `POST`
   - **Headers**:
     ```http
     Content-Type: application/json
     X-GHL-Auth-Token: YOUR_GHL_API_KEY_HERE
     ```
3. In Sub-Account 03 (Dispositions), configure the `WF-DISPO-04: Automated EMD Timeout Reblast` webhook targeting the backup investor pool.

---

## 4. Verification & Validation Protocol
- Run test contact ingestion through Sub-Account 01.
- Confirm lead motivation score initializes at `1 point` and tag `lead_new` is applied.
- Simulate an executed purchase agreement to verify instant record creation in Sub-Account 02 within <3 seconds.
