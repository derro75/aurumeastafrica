/**
 * Global Configuration for the Luxury Gold Trading Platform
 * Edit this file to customize company credentials, contact channels,
 * live pricing rules, currencies, and form endpoints.
 */

export const CONFIG = {
  // Company Profile
  company: {
    name: "AURUM EAST AFRICA",
    legalName: "Aurum East Africa Precious Metals Limited",
    tagline: "Institutional Gold Trading & Refined Bullion House",
    registrationNumber: "[REPLACE: CPR/2024/000000 - Kenya BRS]",
    dealerLicenseNumber: "[REPLACE: ML/GD/2024/000 - Kenya Ministry of Mining]",
    drcAuthorizationNumber: "[REPLACE: DRC/DIV-MIN/2024/000 - Goma/Kinshasa]",
    southSudanPermitNumber: "[REPLACE: RSS/MM/BP/2024/000 - Juba]",
    headquartersCity: "Nairobi, Kenya",
    supportEmail: "inquiries@aurumeastafrica.com",
    complianceEmail: "compliance@aurumeastafrica.com",
    tradingDeskPhone: "+254 20 790 0000",
    phoneDisplay: "+254 (0) 20 790 0000",
    whatsappNumber: "254700000000", // International format without '+' for wa.me link
    whatsappDisplay: "+254 700 000 000",
    operatingHours: "Monday – Friday: 08:30 – 17:30 EAT | Sat: By appointment",
    foundedYear: 2018
  },

  // Regional Physical Offices
  offices: [
    {
      id: "nairobi-hq",
      city: "Nairobi",
      country: "Kenya",
      type: "Headquarters & Trading Floor",
      address: "Riverside Green Offices, 4th Floor, Riverside Drive, Nairobi, Kenya",
      poBox: "P.O. Box 45890-00100, Nairobi",
      phone: "+254 20 790 0000",
      whatsapp: "+254 700 000 000",
      email: "nairobi@aurumeastafrica.com",
      hours: "Mon - Fri: 08:30 - 17:30 EAT",
      securityClearance: "Appointment required. Secured premises with biometric access and armed security escort.",
      licenseHeld: "Licensed Mineral Dealer (Class A) — Republic of Kenya"
    },
    {
      id: "drc-branch",
      city: "Goma & Kinshasa",
      country: "Democratic Republic of Congo",
      type: "Regional Office & Assaying Facility",
      address: "Avenue du Boulevard 14, Commune de Goma, Nord-Kivu, DRC",
      phone: "+243 81 000 0000",
      whatsapp: "+243 81 000 0000",
      email: "drc@aurumeastafrica.com",
      hours: "Mon - Fri: 09:00 - 17:00 CAT",
      securityClearance: "Appointment required. XRF laboratory on-site.",
      licenseHeld: "Agrément de Comptoir d'Achat d'Or — Ministère des Mines, RDC"
    },
    {
      id: "juba-branch",
      city: "Juba",
      country: "South Sudan",
      type: "Regional Trading Office",
      address: "Ministries Road, Juba Center Commercial Tower, 2nd Floor, Juba, South Sudan",
      phone: "+211 92 000 0000",
      whatsapp: "+211 92 000 0000",
      email: "juba@aurumeastafrica.com",
      hours: "Mon - Fri: 08:30 - 16:30 CAT",
      securityClearance: "Photo ID required at entrance. Commercial vault custody available.",
      licenseHeld: "Mineral Dealer Certificate of Registration — Ministry of Mining, Juba"
    }
  ],

  // Form Submission Endpoints
  // Replace with Formspree, Netlify Forms, or your custom CRM endpoint.
  forms: {
    endpoint: "", // e.g. "https://formspree.io/f/your_form_id"
    method: "POST",
    honeypotField: "b_aurum_hp_check",
    rateLimitSeconds: 30, // Anti-spam delay between submissions
    fallbackToWhatsapp: true,
    fallbackEmail: "inquiries@aurumeastafrica.com"
  },

  // Live Price Service Settings
  pricing: {
    updateIntervalMs: 30000, // 30 seconds poll / mock tick
    providerName: "London Bullion Benchmark / Demo Real-Time Feed",
    baseCurrency: "USD",
    benchmarkUnit: "oz_troy", // 1 troy ounce = 31.1034768 grams
    troyOunceToGrams: 31.1034768,
    
    // Default Indicative Spot Prices (Updated via priceService.js)
    defaultSpotUsdPerOz: 2742.50,
    
    // Spread and Margin Rules (Config-driven, never hardcoded in HTML)
    spread: {
      retailBuyMarkupPercent: 1.8,     // Client buys bullion from us (+1.8% over spot)
      institutionalBuyMarkupPercent: 0.8 // Bulk purchase > 5kg
    },

    // Supported Currencies with conversion rates against USD
    currencies: {
      USD: { symbol: "$", name: "US Dollar", rateAgainstUsd: 1.0, decimals: 2 },
      KES: { symbol: "KSh ", name: "Kenyan Shilling", rateAgainstUsd: 130.50, decimals: 0 },
      EUR: { symbol: "€", name: "Euro", rateAgainstUsd: 0.92, decimals: 2 },
      UGX: { symbol: "USh ", name: "Ugandan Shilling", rateAgainstUsd: 3680.0, decimals: 0 },
      CDF: { symbol: "FC ", name: "Congolese Franc", rateAgainstUsd: 2820.0, decimals: 0 }
    },

    // Purity Multipliers
    purities: {
      "9999": { name: "999.9 Fine Gold (24K)", factor: 0.9999, description: "Investment Grade Bullion Bar" },
      "995": { name: "995.0 Investment Bar", factor: 0.9950, description: "Standard Kilobar Trade Quality" },
      "916": { name: "916.0 Crown Gold (22K)", factor: 0.9167, description: "Traditional High Purity Minting" },
      "750": { name: "750.0 Fine (18K)", factor: 0.7500, description: "Commercial & Jewelry Alloy" },
      "dore_raw": { name: "Unrefined Doré (Estimated 88-92%)", factor: 0.9000, description: "Preliminary Assayed Dore Bar" }
    }
  },

  // Standard Legal Disclaimers
  disclaimers: {
    pricingNotice: "Prices displayed are indicative spot references. Official transaction pricing is locked and issued via a formal Proforma Invoice following certified laboratory assay.",
    fluctuationNotice: "Precious metals markets fluctuate continuously based on international commodities exchanges. Physical bullion does not guarantee capital appreciation.",
    complianceNotice: "All transactions are subject to AML/CFT verification under Kenyan and regional East African mining regulations. Legitimate source-of-funds and identity verification required."
  }
};
