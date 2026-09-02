# Mathematical Formulation: Dual Scoring & Gamification Engine

**Version**: 3.2.0  
**Author**: Muhammad Hamza (hamza@hamzabuildai.com)  

---

## 1. Formula 1: Seller Motivation & Lifecycle Scoring

The Seller Motivation Score quantifies seller intent and pipeline velocity by aggregating positive engagement events against a temporal decay curve.

### Mathematical Formulation
$$\text{Score}_{\text{Seller}} = \operatorname{clamp}\left(0, 100, \sum_{i} w_i E_i - \sum_{j} d_j \cdot \mathbb{I}(\Delta t \ge T_j)\right)$$

Where:
- $E_i \in \{0, 1\}$ represents occurrence of engagement event $i$.
- $w_i$ represents the positive point weight for event $i$.
- $d_j$ represents the decay penalty applied when inactivity interval $\Delta t$ reaches threshold $T_j$.
- $\operatorname{clamp}(0, 100, x) = \max(0, \min(100, x))$.

### Engagement Point Weights ($w_i$)
| Event Token ($E_i$) | Description | Weight ($w_i$) | Cumulative Theoretical Max |
|---|---|---|---|
| `lead_new` | Initial record ingestion | **+1** | 1 |
| `email_opened` | Marketing email open | **+1** | 2 |
| `email_clicked` | Link click in email body | **+2** | 4 |
| `sms_reply` | Inbound text message received | **+3** | 7 |
| `intake_complete` | Property questionnaire submitted | **+3** | 10 |
| `call_connected` | Rep phone conversation (>60s) | **+4** | 14 |
| `appointment_set` | Discovery consultation booked | **+6** | 20 |
| `offer_sent` | Written cash offer extended | **+8** | 28 |
| `contract_signed` | Executed purchase agreement | **+15** | **43+ (Locked @ Deal)** |

### Time-Decay Step Function ($d_j$)
$$\text{Penalties}_{\text{Decay}} = 2 \cdot \mathbb{I}(\Delta t \ge 14\text{d}) + 4 \cdot \mathbb{I}(\Delta t \ge 30\text{d}) + 6 \cdot \mathbb{I}(\Delta t \ge 60\text{d}) + 15 \cdot \mathbb{I}(\Delta t \ge 90\text{d})$$

### Lifecycle Tiers & CRM Routing
- **Score 0–4 (New / Cold)**: Enters automated 0–7 Day High-Frequency rapid touch cadence.
- **Score 5–14 (Nurture Pool)**: Enters 8–45 Day Short Nurture smart list; bi-weekly soft touch.
- **Score 15–29 (Hot Lead)**: Triggers instant P0 Closer task (`"🔥 HOT LEAD — Dial in 5 Min"`).
- **Score 30+ (Live Deal)**: Score permanently locked; triggers automated TC handoff webhook upon `contract_signed`.

---

## 2. Formula 2: Buyer Qualification & Gamification Matrix

The Buyer Qualification Score ranks cash investors based on verified liquidity, past closing velocity, responsiveness, and buy-box alignment.

### Mathematical Formulation
$$\text{Score}_{\text{Buyer}} = \operatorname{clamp}\left(0, 100, (0.35 \cdot S_{\text{POF}}) + (0.25 \cdot S_{\text{Velocity}}) + (0.25 \cdot S_{\text{Response}}) + (0.15 \cdot S_{\text{BuyBox}}) - \sum P_k\right)$$

### Component Breakdown
1. **Proof of Funds Sub-Score ($S_{\text{POF}} \in [0, 100]$)**:
   - $S_{\text{POF}} = 100$: Liquid cash $\ge \$1,000,000$ verified within 30 days.
   - $S_{\text{POF}} = 75$: Liquid cash $\ge \$250,000$ verified within 30 days.
   - $S_{\text{POF}} = 50$: Pre-approved hard money lender letter verified.
   - $S_{\text{POF}} = 0$: Unverified self-reported funds.

2. **Transaction Velocity Sub-Score ($S_{\text{Velocity}} \in [0, 100]$)**:
   - $S_{\text{Velocity}} = 100$: $\ge 3$ deals closed with company in past 90 days.
   - $S_{\text{Velocity}} = 70$: $1–2$ deals closed with company in past 90 days.
   - $S_{\text{Velocity}} = 30$: First-time buyer with no transaction history.

3. **Response Speed Sub-Score ($S_{\text{Response}} \in [0, 100]$)**:
   - $S_{\text{Response}} = 100$: Average response time $\le 15$ minutes to deal broadcasts.
   - $S_{\text{Response}} = 70$: Average response time $\le 60$ minutes.
   - $S_{\text{Response}} = 40$: Average response time $\le 24$ hours.
   - $S_{\text{Response}} = 10$: Average response time $> 24$ hours.

4. **Buy-Box Alignment Sub-Score ($S_{\text{BuyBox}} \in [0, 100]$)**:
   - $S_{\text{BuyBox}} = 100$: Exact match on ZIP code, property class, and minimum ROI.
   - $S_{\text{BuyBox}} = 60$: Adjacent county match or broader criteria.
   - $S_{\text{BuyBox}} = 10$: General investor without defined criteria.

5. **Penalties Matrix ($\sum P_k$)**:
   - $P_1 = -50$ Points: Missed 90-Minute EMD wire deadline after verbal lock.
   - $P_2 = -30$ Points: Reneging on agreed purchase terms before wire.
   - $P_3 = -100$ Points: Unauthorized direct contact with property seller.

---

## 3. Investor Syndication Priority Windows

| Buyer Tier | Score Range | Broadcast Timing Window | Communication Channels |
|---|---|---|---|
| **Tier 1 — VIP Buyers** | **85 – 100** | **Minutes 0 – 15** (Exclusive First Look) | Priority SMS + Instant URL Packet |
| **Tier 2 — Hot Cash Pool** | **65 – 84** | **Minutes 15 – 45** (Secondary Window / Reblast Target) | Targeted SMS + Email Broadcast |
| **Tier 3 — General Pool** | **45 – 64** | **Hour 1+** (General Syndication) | Email Newsletter + Web Portal |
| **Tier 4 — Cold / Unverified** | **< 45** | **Weekly Digest Only** | Weekly Curated Digest |
