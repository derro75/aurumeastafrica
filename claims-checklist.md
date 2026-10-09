# Trust Claims, Regulatory Compliance & Evidence Checklist

This checklist audits every legal, regulatory, sourcing, and operational claim made across the website. In accordance with compliance guardrails, claims must not be asserted as verified truth without matching documentation in `/assets/documents/` and registered in `data/documents.json`.

---

## 1. Inventory of Trust Claims & Evidence Requirements

| Section / Page | Stated Claim / Badge | Evidence Required from Client | Status in Mock / Default Code | Attribute Tag in Code |
| :--- | :--- | :--- | :--- | :--- |
| **Header / Trust Strip** | "Licensed Gold Dealer in Kenya" | Dealer's Trading License issued by the State Department for Mining / Ministry of Mining, Blue Economy and Maritime Affairs, Republic of Kenya. | `[TODO: Insert Kenya License Number]` | `data-claim-source="kenya-mining-license"` |
| **Header / Trust Strip** | "Registered Entity in Kenya" | Certificate of Incorporation / CR12 from Business Registration Service (BRS), Nairobi. | `[TODO: Insert Registration Number]` | `data-claim-source="kenya-brs-cert"` |
| **Trust Strip / Offices** | "DRC Branch Office & Mineral Trading Authorization" | Ministerial Order / Division Provinciale des Mines trading authorization (Kinshasa or Goma/Lubumbashi), RCCM, and Id. Nat. | `[TODO: Insert DRC Registration/Permit Number]` | `data-claim-source="drc-mines-authorization"` |
| **Trust Strip / Offices** | "South Sudan (Juba) Branch Registration" | Ministry of Mining & Ministry of Justice certificate of business registration and trading permit, Juba. | `[TODO: Insert South Sudan Permit Number]` | `data-claim-source="south-sudan-mining-permit"` |
| **Sourcing / Process** | "Independent Assay & Purity Verification" | Laboratory assay reports utilizing Fire Assay / X-Ray Fluorescence (XRF) from accredited assay laboratories (e.g., Ministry of Mining Labs or private ISO/IEC 17025 accredited labs). | `[TODO: Insert Sample Lab Assay Report]` | `data-claim-source="assay-lab-certificate"` |
| **Sourcing / Compliance** | "OECD Due Diligence Alignment" | Documented supply-chain risk assessment policy conforming with the *OECD Due Diligence Guidance for Responsible Supply Chains of Minerals from Conflict-Affected and High-Risk Areas*. | Template provided; pending client legal sign-off. | `data-claim-source="oecd-due-diligence-policy"` |
| **Process / Delivery** | "Customs Clearance & Formal Mineral Export Permits" | Ministry export permits, Central Bank CD forms, payment receipt of applicable mineral royalties and withholding taxes. | `[TODO: Insert Specimen Export Declaration]` | `data-claim-source="export-customs-permit"` |
| **Financial Security** | "Compliant Banking & Regulated Escrow Transfers" | Commercial bank settlement details (Nairobi HQ); certified AML/CFT bank compliance statement. | Template guidelines provided. | `data-claim-source="banking-compliance"` |

> **Notice to Website Administrator:**
> Any claim without substantiated evidence MUST retain the `data-claim-source` attribute and placeholder tag until an official PDF or high-resolution scan is added to `/assets/documents/` and referenced in `data/documents.json`.

---

## 2. Regulatory & Legal Template Language (For Counsel Review)

### A. Anti-Money Laundering (AML) & Know-Your-Customer (KYC) Declaration
> **Statutory Notice:** All precious metals transactions conducted through our Nairobi headquarters and regional offices are governed by the **Proceeds of Crime and Anti-Money Laundering Act (POCAMLA) of Kenya**, alongside the applicable regional financial intelligence frameworks in the DRC (CENAREF) and South Sudan (FIU).
> 
> Prior to executing any physical bullion purchase, refined gold sale, or funds settlement, all counterparties (buyers and suppliers) must complete mandatory Know Your Customer (KYC) onboarding. We require:
> 1. Certified government identification (Passport, National ID, or Alien Card) for beneficial owners and directors.
> 2. Proof of registered physical address (utility bill or tenancy agreement dated within the last 90 days).
> 3. Proof of legitimate source of funds or source of gold (bank statement, tax registration, mineral concession permit, or legal trading license).
> 4. Verification against global sanctions lists, including UN, OFAC, and regional embargo registries. We maintain a zero-tolerance policy regarding illicit trade, terrorist financing, and sanctioned entities.

### B. Responsible Gold Sourcing & Conflict-Free Minerals Statement
> **Policy:** We strictly reject gold originating from artisanal sites or trading channels that contribute to armed conflict, human rights abuses, forced labor, or severe environmental contamination.
>
> Our intake protocol for raw dore and bullion bars requires verifiable chain-of-custody documentation, including transport waybills, local royalty tax receipts, and verified mine-site origin documentation. We operate our due diligence in structured alignment with the five-step framework of the **OECD Due Diligence Guidance**.

### C. Risk & Pricing Disclaimer (Standard Component Reused Across Site)
> **Precious Metals Market & Indicative Pricing Disclaimer:**
> Live spot prices displayed on this platform are indicative market benchmarks intended for estimation purposes only. Precious metal markets fluctuate continuously based on global commodities exchanges. Final contract pricing, pure weight determination, applicable premiums, refining deductions, and delivery fees are strictly locked and confirmed via an official written, timestamped Proforma Invoice issued by our commercial trading desk following laboratory assay verification. Physical bullion investments carry market risks, and previous price performance is not indicative of future returns.
