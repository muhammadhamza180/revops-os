# Dual Mathematical Scoring Engine Specification

## 1. Engine #1: Inbound Motivation & Urgency Score (0 – 100 Points)
Calculated upon form submission or cold caller intake log:

| Qualification Parameter | Evaluation Criteria | Point Weight |
| :--- | :--- | :--- |
| **Timeline to Close** | Immediate (&lt; 14 Days) = +30 pts \| 14–30 Days = +20 pts \| 30+ Days = +5 pts | **30 Pts Max** |
| **Motivation Trigger** | Foreclosure / Tax Lien / Urgent Relocation = +25 pts \| Downsizing = +10 pts | **25 Pts Max** |
| **Property Condition** | Major Repairs / As-Is Needed = +20 pts \| Minor Cosmetic = +10 pts | **20 Pts Max** |
| **Asking Price vs. Market** | Asking &lt; 70% ARV = +25 pts \| Asking 70–85% ARV = +15 pts \| Market = 0 pts | **25 Pts Max** |

- **Threshold Action**:
  - **Score ≥ 75**: Auto-promotes from Sub-Account 01 → Sub-Account 02 (Acquisitions Core) with high-priority SLA tag.
  - **Score 40–74**: Enrolled into 14-day automated SMS/Email drip sequence.
  - **Score &lt; 40**: Routed to 30-day cold recycling pool.

---

## 2. Engine #2: Deal Profitability & Margin Index (DPI)
Calculated during underwriting inside Sub-Account 02:

$$\text{DPI} = \frac{\text{ARV} - (\text{Repair Costs} + \text{Acquisition Price} + \text{Closing Costs})}{\text{Acquisition Price}} \times 100$$

- **DPI ≥ 25%**: Fast-tracked to immediate offer generation within 2 hours.
- **DPI 15%–24%**: Standard negotiation review.
- **DPI &lt; 15%**: Automatic counter-offer workflow triggered.
