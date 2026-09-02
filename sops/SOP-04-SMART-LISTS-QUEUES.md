# SOP-04: Smart Lists Daily Operating System & Triage

**Version**: 2.1.0  
**Domain**: Daily Sales Rep Operations  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  

---

## 1. Objective
Guide Acquisitions Reps, Closers, and TC Coordinators through the standard daily triage protocol across 14 prioritized Smart Lists, eliminating lead neglect and enforcing 100% first-contact SLA compliance.

---

## 2. Daily Shift Priority Matrix

| Priority | Smart List Name | Target Response Time | Responsible Role | Operating Action |
|---|---|---|---|---|
| **P0 (Critical)** | `🔥 HOT LEADS (Score ≥ 15)` | < 5 Minutes | Senior Closer | Live phone call; extend MAO offer or lock contract |
| **P0 (Critical)** | `⚡ Uncontacted Leads (SLA < 24h)` | < 15 Minutes | Inbound Rep | 3 phone dials + personalized SMS + video intro |
| **P1 (High)** | `⚠️ SLA At Risk (24h - 48h Warning)` | Immediate | Inbound Rep & Manager | Resolve uncontacted status before 48h revocation |
| **P1 (High)** | `🚨 SLA Breached / Reassigned (48h+)` | < 30 Minutes | Reassigned Closer | Apology triage script + immediate property review |
| **P1 (High)** | `📞 Scheduled Calls & Appointments Today` | 15 Min Prior | Closer | Review comps dossier; lead discovery consultation |
| **P1 (High)** | `📝 Intake Completed — Needs Offer` | < 4 Hours | Underwriting Specialist | Run ARV & MAO formulas; generate offer packet |
| **P1 (High)** | `📨 Offers Sent — Awaiting Signature` | Daily 10:00 AM | Closer | Overcome contract hesitation & closing date terms |
| **P2 (Medium)** | `👻 Ghosted Post-Offer (72h Recovery)` | Daily 2:00 PM | Closer | Deploy Chris Voss psychological takeaway texts |
| **P2 (Medium)** | `🔄 Active 0–7 Day High Frequency Drip` | As Replies Arrive | Inbound Rep | Jump on inbound responses immediately |
| **P3 (Low)** | `🌱 Active 30-Day Nurture Pipeline` | Weekly Cadence | Junior Rep | Soft check-in calls testing for motivation shifts |
| **P3 (Low)** | `💣 120+ Day Reactivation Blitz Target` | Quarterly Sprint | Outbound Blitz Rep | Deploy 9-word text blitz campaign |

---

## 3. Standard Operating Script for SLA Breached Leads
When a lead is reassigned due to a 48-hour SLA breach:
1. Open the contact record and review previous notes.
2. Dial the contact immediately.
3. If connected, open warmly:
   > *"Hi {{contact.first_name}}, Hamza here from Enterprise Acquisitions. I noticed our team had a slight delay getting your property review over for {{property.address}}—I wanted to personally step in and ensure you get our priority cash valuation today. Do you have 2 minutes to review the numbers?"*
4. Apply tag `contacted` to clear the breach status.
