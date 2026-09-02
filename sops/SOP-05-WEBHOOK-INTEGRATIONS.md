# SOP-05: Webhook Integrations & Telephony Configuration

**Version**: 2.0.0  
**Domain**: Telephony, API Webhooks & External Bridges  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  

---

## 1. Objective
Document endpoint configurations, authentication schemas, and Twilio SIP / 10DLC setup for seamless bidirectional data exchange between GoHighLevel and external voice/enrichment services.

---

## 2. Registered Webhook Endpoints

### 2.1 Inbound Lead Ingestion
- **Route**: `POST /api/webhooks/ghl/lead-ingest`
- **Target Sub-Account**: Sub-Account 01 (Acquisitions)
- **Authentication**: Bearer Token (`Authorization: Bearer YOUR_GHL_API_KEY_HERE`)
- **JSON Schema**: `webhooks/schemas/lead-ingestion.schema.json`
- **Expected Payload Example**:
```json
{
  "source": "web_funnel",
  "sub_account_id": "sub_acq_enterprise_01",
  "contact": {
    "first_name": "David",
    "last_name": "Miller",
    "phone": "+15550199010",
    "email": "david.miller@example.com"
  },
  "property": {
    "address": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704",
    "asking_price": 245000,
    "estimated_arv": 340000,
    "seller_urgency": "high_30d"
  }
}
```

### 2.2 TC Sub-Account Handoff
- **Route**: `POST /api/webhooks/ghl/tc-handoff`
- **Trigger Workflow**: `WF-ACQ-08: Handoff Under Contract`
- **Target Sub-Account**: Sub-Account 02 (Coordination)
- **JSON Schema**: `webhooks/schemas/tc-handoff.schema.json`

### 2.3 Dispositions Automated Reblast
- **Route**: `POST /api/webhooks/ghl/dispo-reblast`
- **Trigger**: 90-Minute EMD Countdown Expiration
- **Target Sub-Account**: Sub-Account 03 (Dispositions)
- **JSON Schema**: `webhooks/schemas/dispo-reblast.schema.json`

---

## 3. Twilio 10DLC Telephony Guidelines
- Register 10DLC Campaign under Use Case: `Customer Care & Account Notification`.
- Enforce strict Opt-Out keywords: `STOP`, `UNSUBSCRIBE`, `CANCEL`.
- Any inbound text containing opt-out keywords automatically applies `DNC` tag and terminates all active drip sequences.
