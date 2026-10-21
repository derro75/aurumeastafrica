/**
 * AURUM EAST AFRICA — GOLD VALUATION CALCULATOR
 * Instant physical bullion and raw dore calculator
 */

import { CONFIG } from '../config.js';
import { priceService } from './priceService.js';

export class GoldCalculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.unit = 'grams'; // 'grams', 'kg', 'oz'
    this.weight = 100; // default 100g
    this.purityKey = '9999';
    this.currency = priceService.currentCurrency;

    this.render();
    this.attachEvents();

    // Recompute whenever live price ticks
    priceService.subscribe(() => {
      this.calculate();
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="calc-wrapper">
        <div class="calc-inputs-pane">
          <!-- Weight & Unit -->
          <div class="calc-form-group">
            <label class="calc-label" for="calcWeightInput">Weight &amp; Quantity</label>
            <div class="calc-input-row">
              <input type="number" id="calcWeightInput" class="calc-input tabular-nums" value="${this.weight}" min="0.1" step="any" placeholder="Enter weight">
              <select id="calcUnitSelect" class="calc-select" aria-label="Weight Unit">
                <option value="grams" ${this.unit === 'grams' ? 'selected' : ''}>Grams (g)</option>
                <option value="kg" ${this.unit === 'kg' ? 'selected' : ''}>Kilograms (kg)</option>
                <option value="oz" ${this.unit === 'oz' ? 'selected' : ''}>Troy Ounces (oz)</option>
              </select>
            </div>
          </div>

          <!-- Purity Standard Selection -->
          <div class="calc-form-group">
            <label class="calc-label" for="calcPuritySelect">Fineness / Purity Standard</label>
            <select id="calcPuritySelect" class="calc-select" style="width: 100%;">
              <option value="9999" ${this.purityKey === '9999' ? 'selected' : ''}>999.9 Fine Gold (24 Karat Bullion)</option>
              <option value="995" ${this.purityKey === '995' ? 'selected' : ''}>995.0 Investment Kilobar Grade</option>
              <option value="916" ${this.purityKey === '916' ? 'selected' : ''}>916.0 Crown Gold (22 Karat)</option>
              <option value="750" ${this.purityKey === '750' ? 'selected' : ''}>750.0 Fine (18 Karat Alloy)</option>
              <option value="dore_raw" ${this.purityKey === 'dore_raw' ? 'selected' : ''}>Unrefined Doré (~90% Estimated Assay)</option>
            </select>
          </div>

          <!-- Settlement Currency Selection -->
          <div class="calc-form-group">
            <label class="calc-label" for="calcCurrencySelect">Settlement Currency</label>
            <select id="calcCurrencySelect" class="calc-select" style="width: 100%;">
              <option value="USD">USD ($) — United States Dollar</option>
              <option value="KES">KES (KSh) — Kenyan Shilling</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="UGX">UGX (USh) — Ugandan Shilling</option>
              <option value="CDF">CDF (FC) — Congolese Franc</option>
            </select>
          </div>
        </div>

        <!-- Calculated Valuation Output -->
        <div class="calc-results-card">
          <div>
            <div class="badge badge-gold" style="margin-bottom: var(--space-4);" id="calcModeBadge">
              Buying Investment Bullion
            </div>

            <div class="calc-result-row">
              <span class="calc-result-label">Gross Metal Weight:</span>
              <span class="calc-result-value tabular-nums" id="outGrossWeight">100.00 g</span>
            </div>

            <div class="calc-result-row">
              <span class="calc-result-label">Net Fine Gold Content:</span>
              <span class="calc-result-value tabular-nums" id="outFineContent">99.99 g (3.21 oz)</span>
            </div>

            <div class="calc-result-row">
              <span class="calc-result-label">Live Spot Benchmark:</span>
              <span class="calc-result-value tabular-nums" id="outSpotBaseline">$9,423.06</span>
            </div>

            <div class="calc-result-row">
              <span class="calc-result-label" id="lblPremiumSpread">Fabrication / Assay Margin:</span>
              <span class="calc-result-value tabular-nums" id="outPremiumSpread">+$169.62 (+1.8%)</span>
            </div>
          </div>

          <div class="calc-result-total">
            <span class="calc-result-label">Indicative Estimated Value</span>
            <div class="calc-result-value tabular-nums" id="outTotalValue">$9,592.67</div>
            <div style="font-size: var(--text-xs); color: var(--color-gold-light); margin-top: var(--space-1);" id="outPricePerGram">
              ≈ $95.93 / gram
            </div>
          </div>

          <div style="margin-top: var(--space-6); font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">
            * Indicative benchmark only. Final transaction price is confirmed in a written Proforma Invoice with certified laboratory assay.
          </div>
        </div>
      </div>
    `;

    this.calculate();
  }

  attachEvents() {
    // Inputs
    const weightInput = this.container.querySelector('#calcWeightInput');
    const unitSelect = this.container.querySelector('#calcUnitSelect');
    const puritySelect = this.container.querySelector('#calcPuritySelect');
    const currSelect = this.container.querySelector('#calcCurrencySelect');

    weightInput.addEventListener('input', (e) => {
      this.weight = parseFloat(e.target.value) || 0;
      this.calculate();
    });

    unitSelect.addEventListener('change', (e) => {
      this.unit = e.target.value;
      this.calculate();
    });

    puritySelect.addEventListener('change', (e) => {
      this.purityKey = e.target.value;
      this.calculate();
    });

    currSelect.addEventListener('change', (e) => {
      this.currency = e.target.value;
      priceService.setCurrency(this.currency);
      this.calculate();
    });
  }

  calculate() {
    const purityObj = CONFIG.pricing.purities[this.purityKey] || CONFIG.pricing.purities["9999"];
    const purityFactor = purityObj.factor;
    const troyGrams = CONFIG.pricing.troyOunceToGrams;

    // Convert gross weight to grams
    let grossGrams = this.weight;
    if (this.unit === 'kg') grossGrams = this.weight * 1000;
    if (this.unit === 'oz') grossGrams = this.weight * troyGrams;

    // Pure fine gold grams & troy oz
    const fineGrams = grossGrams * purityFactor;
    const fineOz = fineGrams / troyGrams;

    // Spot price per gram in selected currency
    const currObj = CONFIG.pricing.currencies[this.currency] || CONFIG.pricing.currencies.USD;
    const fxRate = currObj.rateAgainstUsd;
    const spotGramInCurr = (priceService.currentSpotUsdPerOz * fxRate) / troyGrams;

    // Baseline Spot Value for the fine content
    const spotBaselineVal = fineGrams * spotGramInCurr;

    // Volume tier discount: if over 1kg, reduce the retail markup.
    let marginPercent = 0;
    marginPercent = CONFIG.pricing.spread.retailBuyMarkupPercent;
    if (grossGrams >= 1000) {
      marginPercent = CONFIG.pricing.spread.institutionalBuyMarkupPercent;
    }

    const marginAmount = spotBaselineVal * (marginPercent / 100);
    const totalEstimated = spotBaselineVal + marginAmount;
    const pricePerGram = grossGrams > 0 ? (totalEstimated / grossGrams) : 0;

    // Update DOM
    const outGross = this.container.querySelector('#outGrossWeight');
    const outFine = this.container.querySelector('#outFineContent');
    const outSpot = this.container.querySelector('#outSpotBaseline');
    const outSpread = this.container.querySelector('#outPremiumSpread');
    const outTotal = this.container.querySelector('#outTotalValue');
    const outGram = this.container.querySelector('#outPricePerGram');

    if (outGross) outGross.textContent = `${grossGrams.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} g`;
    if (outFine) outFine.textContent = `${fineGrams.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} g (${fineOz.toFixed(2)} oz)`;
    
    if (outSpot) outSpot.textContent = priceService.formatAmount(spotBaselineVal, this.currency);
    
    if (outSpread) {
      const sign = marginAmount >= 0 ? '+' : '';
      outSpread.textContent = `${sign}${priceService.formatAmount(marginAmount, this.currency)} (${sign}${marginPercent}%)`;
    }

    if (outTotal) outTotal.textContent = priceService.formatAmount(totalEstimated, this.currency);
    if (outGram) outGram.textContent = `≈ ${priceService.formatAmount(pricePerGram, this.currency)} / gram`;
  }
}
