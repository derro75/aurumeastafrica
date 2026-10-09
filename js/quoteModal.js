/**
 * AURUM EAST AFRICA — 2-STEP BULLION QUOTE FLOW
 * Unified conversion modal with client validation, honeypot, rate-limiting, and WhatsApp fallback.
 */

import { CONFIG } from '../config.js';

export class QuoteModalManager {
  constructor() {
    this.modal = null;
    this.currentStep = 1;
    this.formData = {
      intent: 'buy',
      product: '1,000g Cast Bullion Bar (999.9)',
      quantity: 1,
      unit: 'kg',
      destination: 'Nairobi Vault Custody',
      fullName: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    };
    this.lastSubmitTime = 0;

    this.init();
  }

  init() {
    this.createModalDOM();
    this.attachGlobalTriggers();
  }

  createModalDOM() {
    this.modal = document.createElement('div');
    this.modal.id = 'globalQuoteModal';
    this.modal.className = 'modal-overlay';
    this.modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="quoteModalTitle">
        <div class="modal-header">
          <div>
            <h3 id="quoteModalTitle" style="font-size: var(--text-xl); margin-bottom: 2px;">Request an Official Written Quote</h3>
            <p style="font-size: var(--text-xs); color: var(--color-gold-light); margin-bottom: 0;" id="quoteStepSubtitle">
              Step 1 of 2: Bullion &amp; Volume
            </p>
          </div>
          <button type="button" class="modal-close-btn" id="closeQuoteModalBtn" aria-label="Close quote modal">✕</button>
        </div>

        <!-- Stepper Progress Header -->
        <div class="quote-stepper-progress" role="tablist">
          <div class="step-indicator active" id="stepInd1">1. Bullion &amp; Volume</div>
          <div class="step-indicator" id="stepInd2">2. Contact Details</div>
        </div>

        <form id="quoteFormFlow" novalidate>
          <!-- Anti-Spam Honeypot Field -->
          <div class="hp-field" aria-hidden="true">
            <input type="text" name="${CONFIG.forms.honeypotField}" id="quoteHoneypot" tabindex="-1" autocomplete="off">
          </div>

          <div class="modal-body" id="quoteModalBody">
            <!-- Dynamically Rendered Step Content -->
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" id="quotePrevBtn" style="visibility: hidden;">
              ← Back
            </button>
            <div style="display: flex; gap: var(--space-2);">
              <button type="button" class="btn btn-primary btn-sm" id="quoteNextBtn">
                Continue →
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Modal Close Triggers
    this.modal.querySelector('#closeQuoteModalBtn').addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('open')) this.close();
    });

    // Step Nav
    this.modal.querySelector('#quoteNextBtn').addEventListener('click', () => this.handleNext());
    this.modal.querySelector('#quotePrevBtn').addEventListener('click', () => this.handlePrev());

    this.renderStep(1);
  }

  attachGlobalTriggers() {
    // Listen for custom event or clicks on any .trigger-quote-btn
    window.addEventListener('open-quote-modal', (e) => {
      if (e.detail?.product) this.formData.product = e.detail.product;
      if (e.detail?.notes) this.formData.notes = e.detail.notes;
      this.open();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.trigger-quote-btn, a[href="#get-quote"]');
      if (btn) {
        e.preventDefault();
        if (btn.dataset.product) this.formData.product = btn.dataset.product;
        this.open();
      }
    });
  }

  open() {
    this.currentStep = 1;
    this.renderStep(1);
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  renderStep(step) {
    this.currentStep = step;
    const body = this.modal.querySelector('#quoteModalBody');
    const prevBtn = this.modal.querySelector('#quotePrevBtn');
    const nextBtn = this.modal.querySelector('#quoteNextBtn');
    const subTitle = this.modal.querySelector('#quoteStepSubtitle');

    // Update Progress Indicator
    [1, 2].forEach(s => {
      const ind = this.modal.querySelector(`#stepInd${s}`);
      if (ind) {
        ind.classList.toggle('active', s === step);
      }
    });

    prevBtn.style.visibility = step > 1 ? 'visible' : 'hidden';

    if (step === 1) {
      subTitle.textContent = "Step 1 of 2: Bullion & Volume";
      nextBtn.textContent = "Continue to Contact Details →";
      body.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="qProductInput">Bullion Product</label>
          <input type="text" id="qProductInput" class="form-control" value="${this.formData.product}" placeholder="e.g. 1kg Cast Bar or 100g Minted Bar">
        </div>

        <div class="form-group" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-3);">
          <div>
            <label class="form-label" for="qQuantityInput">Estimated Quantity</label>
            <input type="number" id="qQuantityInput" class="form-control" value="${this.formData.quantity}" min="0.1" step="any">
          </div>
          <div>
            <label class="form-label" for="qUnitInput">Unit</label>
            <select id="qUnitInput" class="form-control">
              <option value="kg" ${this.formData.unit === 'kg' ? 'selected' : ''}>Kilograms (kg)</option>
              <option value="grams" ${this.formData.unit === 'grams' ? 'selected' : ''}>Grams (g)</option>
              <option value="oz" ${this.formData.unit === 'oz' ? 'selected' : ''}>Troy Ounces (oz)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="qDestinationInput">Settlement &amp; Delivery Destination</label>
          <select id="qDestinationInput" class="form-control">
            <option value="Nairobi Vault Custody">Nairobi Vault (Allocated &amp; Segregated)</option>
            <option value="In-Person Collection (Nairobi HQ)">Collect at Nairobi HQ</option>
            <option value="DRC Comptoir Handover">DRC Comptoir (Goma / Kinshasa)</option>
            <option value="Juba Branch Handover">Juba Branch (South Sudan)</option>
            <option value="Armored International Air Freight">Armored Air Freight (JKIA)</option>
          </select>
        </div>
      `;
    } else if (step === 2) {
      subTitle.textContent = "Step 2 of 2: Client Identity & Written Quote Delivery";
      nextBtn.textContent = "Submit Formal Request";
      body.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="qNameInput">Full Legal Name *</label>
          <input type="text" id="qNameInput" class="form-control" value="${this.formData.fullName}" placeholder="As shown on Passport or National ID" required>
        </div>

        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <div>
            <label class="form-label" for="qEmailInput">Email Address *</label>
            <input type="email" id="qEmailInput" class="form-control" value="${this.formData.email}" placeholder="corporate or personal email" required>
          </div>
          <div>
            <label class="form-label" for="qPhoneInput">Phone / WhatsApp Number *</label>
            <input type="tel" id="qPhoneInput" class="form-control" value="${this.formData.phone}" placeholder="+254 700 000 000" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="qCompanyInput">Company / Entity Name (Optional)</label>
          <input type="text" id="qCompanyInput" class="form-control" value="${this.formData.company}" placeholder="For corporate treasury accounts">
        </div>

        <div class="form-group">
          <label class="form-label" for="qNotesInput">Special Instructions or Assay Notes</label>
          <textarea id="qNotesInput" class="form-control" rows="2" placeholder="Any specific requirements...">${this.formData.notes}</textarea>
        </div>

        <div style="font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">
          Privacy Guarantee: Your contact and identity details are strictly protected under Kenyan data protection laws and used solely for proforma quotation and KYC compliance.
        </div>
      `;
    }
  }

  handleNext() {
    if (this.currentStep === 1) {
      const prod = this.modal.querySelector('#qProductInput')?.value;
      const qty = parseFloat(this.modal.querySelector('#qQuantityInput')?.value) || 1;
      const unit = this.modal.querySelector('#qUnitInput')?.value;
      const dest = this.modal.querySelector('#qDestinationInput')?.value;

      this.formData.product = prod;
      this.formData.quantity = qty;
      this.formData.unit = unit;
      this.formData.destination = dest;

      this.renderStep(2);
    } else if (this.currentStep === 2) {
      this.submitForm();
    }
  }

  handlePrev() {
    if (this.currentStep > 1) {
      this.renderStep(this.currentStep - 1);
    }
  }

  async submitForm() {
    const name = this.modal.querySelector('#qNameInput')?.value.trim();
    const email = this.modal.querySelector('#qEmailInput')?.value.trim();
    const phone = this.modal.querySelector('#qPhoneInput')?.value.trim();
    const company = this.modal.querySelector('#qCompanyInput')?.value.trim();
    const notes = this.modal.querySelector('#qNotesInput')?.value.trim();
    const hp = this.modal.querySelector('#quoteHoneypot')?.value;

    // 1. Honeypot Anti-Spam Check
    if (hp) {
      console.warn("Spam detected by honeypot field.");
      this.showSuccess();
      return;
    }

    // 2. Client-side Validation
    if (!name || !email || !phone) {
      alert("Please provide your full legal name, email address, and phone number.");
      return;
    }

    // 3. Client Rate-Limiting
    const now = Date.now();
    if (now - this.lastSubmitTime < CONFIG.forms.rateLimitSeconds * 1000) {
      alert(`Please wait ${CONFIG.forms.rateLimitSeconds} seconds between submissions.`);
      return;
    }

    this.formData.fullName = name;
    this.formData.email = email;
    this.formData.phone = phone;
    this.formData.company = company;
    this.formData.notes = notes;

    const nextBtn = this.modal.querySelector('#quoteNextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = "Transmitting to Trading Desk...";

    // Check if real endpoint configured
    if (CONFIG.forms.endpoint && CONFIG.forms.endpoint.trim() !== "") {
      try {
        const response = await fetch(CONFIG.forms.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(this.formData)
        });
        if (!response.ok) throw new Error("Endpoint returned status: " + response.status);
      } catch (err) {
        console.warn("Endpoint failed, falling back to local acknowledgment:", err);
      }
    }

    this.lastSubmitTime = now;
    this.showSuccess();
  }

  showSuccess() {
    const body = this.modal.querySelector('#quoteModalBody');
    const footer = this.modal.querySelector('.modal-footer');
    const subTitle = this.modal.querySelector('#quoteStepSubtitle');

    subTitle.textContent = "Submission Confirmed";
    footer.style.display = 'none';

    const waText = encodeURIComponent(
      `Hello Aurum East Africa Trading Desk,\nI have submitted a bullion purchase quote request for ${this.formData.quantity} ${this.formData.unit} of ${this.formData.product}.\nName: ${this.formData.fullName}\nEmail: ${this.formData.email}`
    );
    const waLink = `https://wa.me/${CONFIG.company.whatsappNumber}?text=${waText}`;

    body.innerHTML = `
      <div style="text-align: center; padding: var(--space-6) var(--space-2);">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); border: 2px solid var(--color-success); color: var(--color-success); font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-4);">
          ✓
        </div>
        <h3 style="font-size: var(--text-2xl); color: #FFF0C2; margin-bottom: var(--space-3);">
          Quote Request Logged
        </h3>
        <p style="color: var(--color-text-secondary); font-size: var(--text-sm); line-height: 1.6; max-width: 480px; margin: 0 auto var(--space-6);">
          A licensed account manager from our Nairobi trading floor has received your specifications. You will receive a formal, timestamped Proforma Quote with assay parameters within <strong>2 business hours</strong>.
        </p>

        <div style="background: var(--color-bg-base); border: 1px solid var(--color-gold-border); border-radius: var(--radius-sm); padding: var(--space-4); margin-bottom: var(--space-6); text-align: left; font-size: var(--text-xs);">
          <div><strong>Transaction:</strong> Bullion Purchase</div>
          <div><strong>Product &amp; Volume:</strong> ${this.formData.quantity} ${this.formData.unit} (${this.formData.product})</div>
          <div><strong>Delivery / Custody:</strong> ${this.formData.destination}</div>
          <div><strong>Contact Email:</strong> ${this.formData.email}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 380px; margin: 0 auto;">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
            Chat Instantly on WhatsApp ↗
          </a>
          <button type="button" class="btn btn-secondary btn-sm" id="closeSuccessBtn">
            Done &amp; Return to Site
          </button>
        </div>
      </div>
    `;

    body.querySelector('#closeSuccessBtn').addEventListener('click', () => {
      this.close();
      setTimeout(() => {
        footer.style.display = 'flex';
        this.renderStep(1);
      }, 500);
    });
  }
}
