# SOP-06: Role-Based Access Control & Tenant Permissions Isolation

**Version**: 2.1.0  
**Domain**: Security & Role-Based Access Control (RBAC)  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  

---

## 1. Objective
Enforce strict security boundaries between department roles across the 3 sub-accounts, ensuring that Acquisitions Reps cannot access proprietary Cash Buyer contact lists, and TC Coordinators have locked escrow authorization controls.

---

## 2. Role Permissions Matrix

| Permission / Capability | Agency Admin | Acquisitions Rep | TC Specialist | Dispositions Manager | Executive Auditor |
|---|---|---|---|---|---|
| **Sub-Account 01: View Leads & Pipelines** | ✅ Full | ✅ Assigned Only | 👁️ Read-Only | ❌ No Access | 👁️ Read-Only |
| **Sub-Account 01: Modify Lead Score & MAO** | ✅ Full | ✅ Full | ❌ No Access | ❌ No Access | ❌ No Access |
| **Sub-Account 02: Manage Title & Documents** | ✅ Full | 👁️ Read-Only | ✅ Full | 👁️ Read-Only | 👁️ Read-Only |
| **Sub-Account 02: Approve Final Closing Statement** | ✅ Full | ❌ No Access | ✅ Requires Lead Signoff | ❌ No Access | 👁️ Read-Only |
| **Sub-Account 03: View VIP Cash Buyer List** | ✅ Full | ❌ Denied | ❌ Denied | ✅ Full | 👁️ Read-Only |
| **Sub-Account 03: Trigger Deal Packet Broadcast** | ✅ Full | ❌ Denied | ❌ Denied | ✅ Full | ❌ Denied |
| **Export Contacts / CSV Download** | ✅ Full | ❌ Restricted | ❌ Restricted | ❌ Restricted | ❌ Restricted |
| **Manage API Keys & Webhooks** | ✅ Full | ❌ Restricted | ❌ Restricted | ❌ Restricted | ❌ Restricted |

---

## 3. User Setup Protocol
1. Navigate to **Agency Settings** > **Team Members**.
2. Select **Add Employee**.
3. Under **User Roles**, assign `User (Standard)` for reps or `Admin` for managers.
4. Under **User Permissions**, assign only their designated sub-account:
   - For Acquisitions Closers: check *only* `[ACQ] Enterprise Acquisitions Mesh`.
   - For TC Managers: check *only* `[TC] Enterprise Coordination Hub`.
   - For Dispo Managers: check *only* `[DISPO] Enterprise Dispositions Engine`.
5. Enable **Only Assigned Data** toggle to prevent sales reps from viewing peer accounts.
6. Enable two-factor authentication (2FA) for all agency and sub-account users.
