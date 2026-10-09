# Aurum East Africa Precious Metals Limited — Production Platform

A bespoke, production-ready, multi-page precious metals trading platform engineered with **vanilla HTML5, modern CSS, and ES6 JavaScript** (zero external build tools, zero frameworks, zero jQuery). Designed with a **luxury fintech aesthetic** (deep charcoal, warm ivory typography, restrained champagne gold accents), built mobile-first, and architected for regulatory transparency across Kenya, the Democratic Republic of Congo (DRC), and South Sudan.

---

## 📑 Table of Contents
1. [Architecture & Directory Structure](#1-architecture--directory-structure)
2. [Where to Put Your Files (Assets & Documents)](#2-where-to-put-your-files-assets--documents)
3. [Configuration & Data Files](#3-configuration--data-files)
4. [How to Swap the Live Price Provider](#4-how-to-swap-the-live-price-provider)
5. [Connecting the Quote Form Endpoint](#5-connecting-the-quote-form-endpoint)
6. [Security & Recommended HTTP Headers](#6-security--recommended-http-headers)
7. [Deployment Guide](#7-deployment-guide)
8. [Production Launch Checklist](#8-production-launch-checklist)
9. [Open Items & Client Action Items (TODO)](#9-open-items--client-action-items-todo)

---

## 1. Architecture & Directory Structure

```
gold/
├── index.html                 # Homepage (Hero, Ticker, Trust Pillars, How it Works, Calculator, Presence)
├── buy-gold.html              # Bullion Catalogue (Filters, Sorting, Compare Drawer)
├── product.html               # Dynamic Bullion Specification & Live Quote Template
├── prices.html                # Gold Price Centre (Canvas Charts, Timeframes, Spreads, Multi-Currency)
├── how-it-works.html          # 7-Step Institutional Transaction Stepper
├── trust-centre.html          # Regulatory License Inspection Gallery & Lightbox Viewer
├── sourcing.html              # OECD Due Diligence, Artisanal Intake & Certified Fire Assay
├── offices.html               # 3-Country Physical Branches (Nairobi HQ, Goma/DRC, Juba/South Sudan)
├── about.html                 # Corporate Heritage, Governance Principles & Trading Desk
├── learn.html                 # Bullion Education Hub & Comprehensive Investor Glossary
├── faq.html                   # Categorized Searchable FAQ Accordion
├── contact.html               # Direct Contact Channels, In-Person Appointments & Quote Form
├── aml-kyc-policy.html        # Statutory POCAMLA & CENAREF Regulatory Policy
├── terms.html                 # Trading Contract, Proforma Validity & Price Locks
├── privacy.html               # Kenya Data Protection Act 2019 Notice & Retention Guidelines
├── cookies.html               # Privacy-First Minimal Storage Declaration
├── 404.html                   # Luxury 404 Fallback Page
├── sitemap.xml                # SEO XML Sitemap
├── robots.txt                 # Search Engine Crawler Directives
├── config.js                  # Master Application Configuration (Endpoints, Contacts, Currencies)
├── BENCHMARK.md               # 7-Site Industry Benchmark Analysis (PAMP, Perth Mint, Rand, etc.)
├── QA-REPORT.md               # Complete Quality Assurance, Accessibility & Viewport Audit
├── claims-checklist.md        # Substantiation Matrix for Trust Claims & Regulatory Filing
│
├── assets/
│   ├── logo/                  # Aurum East Africa SVG Wordmarks & Crests
│   ├── images/
│   │   ├── products/          # SVG Vector Bullion Bars (1kg, 500g, 250g, 100g, 1oz, Dore)
│   │   └── ...                # Diagrams (Regional Map, Assay Lab, Bullion Stacks)
│   └── documents/             # Regulatory License Previews, Assay Reports & Thumbnails
│
├── css/
│   ├── base.css               # Design Tokens, Fluid Typography (clamp), Dark & Light Theme Variables
│   ├── layout.css             # Sticky Header, Top Ticker, Mega-Menu, Mobile Sticky Bar, Footer
│   ├── components.css         # Luxury Preloader, Buttons, Cards, Steppers, Modals, Lightbox
│   └── pages.css              # Page-Specific Layouts (Hero, Catalogue Grid, Price Centre, Trust Centre)
│
├── js/
│   ├── app.js                 # Global Application Controller, Preloader, Header Shrink, Toast
│   ├── priceService.js        # Live Benchmark Engine (Pub/Sub, Multi-Currency, Spot Calculations)
│   ├── calculator.js          # Interactive Bullion Value & Fine Content Estimator
│   ├── chart.js               # High-Performance HTML5 Canvas Price Chart (1D, 1W, 1M, 1Y)
│   ├── catalogue.js           # Bullion Filter, Search, Sort & 3-Product Comparison Drawer
│   ├── documents.js           # Trust Centre Document Filter & Interactive Inspection Lightbox
│   ├── quoteModal.js          # 2-Step Quote Flow, Honeypot Anti-Spam & Rate Limiter
│   ├── i18n.js                # Client-Side Translation Engine (English, French, Kiswahili)
│   └── theme.js               # Dark/Light Mode Switcher with localStorage Persistence
│
├── data/
│   ├── products.json          # Bullion Inventory, Specifications, Premiums & Dimensions
│   ├── documents.json         # Regulatory Licenses, Issuers, Expiries & Verification URLs
│   ├── offices.json           # Physical Addresses, Hours, Geocodes & Office Licenses
│   ├── faq.json               # Categorized Q&A Repository
│   └── articles.json          # Educational Guides & Bullion Glossary Terms
│
└── i18n/
    ├── en.json                # English UI Dictionary
    ├── fr.json                # French UI Dictionary (DRC Operations)
    └── sw.json                # Kiswahili UI Dictionary (East Africa Operations)
```

---

## 2. Where to Put Your Files (Assets & Documents)

When you receive original high-resolution photography, physical PDF licenses, or updated assay laboratory certificates, simply replace the placeholder files in these designated directories **without modifying any code**:

### A. Regulatory Licenses & Assay Certificates
- **Path:** `/assets/documents/`
- **Supported Formats:** PDF, JPG, PNG, or SVG.
- **How to Add/Replace:**
  1. Drop your official PDF or scanned image into `assets/documents/` (e.g., `assets/documents/mining-dealers-license-2026.pdf`).
  2. Open `data/documents.json`.
  3. Update or add an entry matching your filename:
     ```json
     {
       "id": "doc-ke-mineral-dealer",
       "title": "Mineral Dealer's Trading Licence",
       "country": "Kenya",
       "issuer": "Ministry of Mining, Blue Economy and Maritime Affairs",
       "number": "[REPLACE: ML/GD/2024/7821]",
       "issueDate": "2024-01-15",
       "expiryDate": "2026-12-31",
       "file": "assets/documents/mining-dealers-license-2026.pdf",
       "thumbnail": "assets/documents/kenya-mining-license-thumb.svg",
       "verifyUrl": "https://mining.go.ke/verify/[REPLACE]"
     }
     ```
  4. The Trust Centre (`trust-centre.html`), lightbox viewer, and homepage preview will update automatically!

### B. Product Photography
- **Path:** `/assets/images/products/`
- **Recommended Format:** WebP or optimized PNG with transparent background (1200×900px, 4:3 aspect ratio).
- **Update Link:** In `data/products.json`, update the `"images"` array for each respective bar.

### C. Company Logos & Marks
- **Path:** `/assets/logo/`
  - Full Wordmark: `assets/logo/aurum-logo.svg`
  - Emblem / Mark: `assets/logo/aurum-mark.svg`

### D. Team & Office Photography
- **Path:** `/assets/images/team/` and `/assets/images/offices/`

---

## 3. Configuration & Data Files

All global settings are centralized in `config.js`. Open `config.js` to modify:

| Setting Key | Description | Default / Example |
| :--- | :--- | :--- |
| `company.name` | Legal Trading Name | `Aurum East Africa Precious Metals Limited` |
| `contacts.phone` | Nairobi Trading Desk Direct Line | `+254 20 790 0000` |
| `contacts.whatsapp` | Desk WhatsApp (International digits only) | `254700000000` |
| `contacts.email` | Primary Quote Inquiries | `trading@aurumeastafrica.com` |
| `forms.endpoint` | Formspree / Netlify / Custom Webhook URL | `""` *(Falls back gracefully to WhatsApp/email)* |
| `forms.rateLimitSeconds` | Quote anti-spam cooldown | `60` |
| `pricing.liveProvider` | Price feed mode (`"mock"` or `"api"`) | `"mock"` |
| `currencies` | Supported currencies & exchange multipliers | USD, KES, EUR, UGX, CDF |

---

## 4. How to Swap the Live Price Provider

The platform uses a pluggable benchmark engine defined in `js/priceService.js`. By default, it operates in **mock demo mode**, generating realistic spot fluctuations (+/- 0.05% every 10 seconds) with timestamps.

### To Connect a Real Licensed Provider:
1. In `config.js`, update the pricing settings:
   ```javascript
   pricing: {
     liveProvider: "api", // Switch from "mock" to "api"
     apiUrl: "https://api.metals.dev/v1/latest", // Or GoldAPI.io / Metals-API.com
     apiKey: "YOUR_LICENSED_API_KEY",
     refreshIntervalSeconds: 30
   }
   ```
2. In `js/priceService.js`, the `fetchFromLiveApi()` function is pre-structured to map API responses:
   ```javascript
   async function fetchFromLiveApi(config) {
     const res = await fetch(`${config.apiUrl}?api_key=${config.apiKey}&currency=USD`);
     const data = await res.json();
     
     // Map provider fields to standardized Aurum snapshot:
     return {
       spotPerOz: Number(data.metals.gold),
       spotPerGram: Number(data.metals.gold) / 31.1034768,
       change24hPercent: Number(data.change_percent_24h || 0),
       timestamp: new Date().toISOString()
     };
   }
   ```
3. If an API request encounters a network error, `priceService.js` automatically catches the exception and maintains the last valid cache without breaking the UI.

---

## 5. Connecting the Quote Form Endpoint

The 2-step bullion quote flow (`js/quoteModal.js`) includes:
- **Bot Trap:** Hidden honeypot field (`fax_number_verification`).
- **Client Rate Limiting:** 60-second cooldown per session.
- **Fail-Safe Fallback:** If no backend endpoint is configured or if the submission fails, the modal automatically directs the client to **pre-filled WhatsApp chat** and opens a `mailto:` draft.

### Option A: Formspree
1. Create a free or commercial form at [formspree.io](https://formspree.io).
2. Copy your form ID (e.g. `https://formspree.io/f/mqkvanzy`).
3. Set `forms.endpoint: "https://formspree.io/f/mqkvanzy"` in `config.js`.

### Option B: Netlify Forms
If deploying to Netlify, add `data-netlify="true"` and `name="quote-request"` to the `<form>` element in `js/quoteModal.js`.

### Option C: Custom Backend / CRM Webhook (HubSpot, Salesforce, Zoho)
Point `forms.endpoint` to your internal API route (`https://api.aurumeastafrica.com/v1/leads`). The modal sends a clean JSON payload:
```json
{
  "intent": "buy",
  "category": "1kg Bullion Bar (999.9 Fine Gold)",
  "quantity": 5,
  "destination": "Kenya",
  "name": "Jane Doe",
  "email": "jane@investmentfirm.com",
  "phone": "+254712345678",
  "company": "Apex Capital Holdings",
  "notes": "Requesting CIF Geneva delivery proforma.",
  "submittedAt": "2026-10-09T10:30:00Z"
}
```

---

## 6. Security & Recommended HTTP Headers

Since this is a client-side static application, strict security headers should be enforced at the server or CDN level (`_headers` file for Netlify/Cloudflare, or `.htaccess` for Apache/cPanel):

```http
# Recommended Production Security Headers
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.metals.dev https://formspree.io; frame-src 'self'; object-src 'self';
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## 7. Deployment Guide

### Deploying to Netlify (Recommended)
1. Push this folder to a GitHub/GitLab repository.
2. In Netlify, click **"Add new site" &gt; "Import an existing project"**.
3. Leave Build Command **blank** (no build step required).
4. Set Publish Directory to `.` (the root).
5. Click **Deploy**.

### Deploying to Vercel
1. Install Vercel CLI (`npm i -g vercel`) or connect via the Vercel Dashboard.
2. Select **"Other"** project type with no build command and root output directory.
3. Deploy instantly.

### Deploying to Traditional Web Hosting (cPanel / Apache)
1. Compress the contents of this `gold/` folder into a `.zip` archive.
2. Open cPanel **File Manager** and navigate to `public_html`.
3. Upload and extract the archive into `public_html`.
4. Ensure `.htaccess` has MIME types configured for SVG:
   ```apache
   AddType image/svg+xml .svg .svgz
   ```

---

## 8. Production Launch Checklist

- [ ] **Substitute Legal Numbers:** Replace `[REPLACE: ...]` placeholders in `data/documents.json`, `claims-checklist.md`, and `config.js` with official government registration and license numbers.
- [ ] **Upload Official Scans:** Drop authentic PDF copies of the Kenyan Mineral Dealer's License, DRC Comptoir Authorization, and South Sudan Mineral Export Permit into `assets/documents/`.
- [ ] **Configure Active Phone & WhatsApp:** Update `config.js` with live Nairobi desk phone number and WhatsApp Business number.
- [ ] **Connect Quote Endpoint:** Enter your active Formspree URL or CRM webhook in `config.js`.
- [ ] **Connect Live Price API:** Acquire a commercial API key (GoldAPI / Metals.dev) and insert into `config.js`, or verify manual desk spread updates.
- [ ] **Legal Counsel Review:** Have company legal counsel review `aml-kyc-policy.html`, `terms.html`, and `privacy.html`.
- [ ] **SSL / TLS Certificate:** Verify HTTPS is forced on your custom domain with modern TLS 1.3.

---

## 9. Open Items & Client Action Items (TODO)

To ensure strict legal compliance and prevent misrepresentation, all unverified items have been marked with placeholder tags. Please supply the following prior to commercial launch:

1. **Kenyan Mineral Dealer's Licence Number:** Replace `[REPLACE: ML/GD/2024/7821]` with your active license certificate number from the Ministry of Mining.
2. **DRC Comptoir Approval:** Replace `[REPLACE: AR/COMP/NK/2024/091]` with the provincial authorization number issued by the DRC Ministry of Mines in Goma/Kinshasa.
3. **South Sudan Export Permit:** Replace `[REPLACE: RSS/MM/EXP/2024/03]` with the official permit number from the Ministry of Petroleum and Mining in Juba.
4. **Assay Laboratory Accreditation:** Provide the official laboratory accreditation ID (ISO 17025 or Kenya Bureau of Standards license) for fire assay certifications.
5. **Bank Settlement Channels:** Verify SWIFT BIC codes and authorized escrow correspondent banks for client wire instructions.
6. **Physical Photography:** Replace placeholder bullion and office vector graphics with high-resolution photographs of your Nairobi premises, secure vault rooms, and bullion stock.

---

*Engineered with precision for Aurum East Africa Precious Metals Limited.*
