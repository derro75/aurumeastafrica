/**
 * AURUM EAST AFRICA — PRODUCT CATALOGUE & COMPARISON
 * Filters, sorting, URL sync, and 3-item comparison drawer.
 */

import { priceService } from './priceService.js';
import { CONFIG } from '../config.js';

export class CatalogueManager {
  constructor(gridId, filterContainerId, compareDrawerId) {
    this.grid = document.getElementById(gridId);
    this.filterContainer = document.getElementById(filterContainerId);
    this.compareDrawer = document.getElementById(compareDrawerId);
    this.products = [];
    this.activeFilter = 'All';
    this.activeSort = 'default';
    this.selectedForCompare = new Set();

    this.init();
  }

  async init() {
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error('Failed to load products');
      this.products = await response.json();
    } catch (e) {
      console.warn("Using fallback embedded product list:", e);
      this.products = [];
    }

    this.renderFilters();
    this.renderProducts();
    this.setupCompareDrawer();

    // Re-render indicative price tags when price ticks
    priceService.subscribe(() => {
      this.updatePriceTags();
    });
  }

  renderFilters() {
    if (!this.filterContainer) return;
    const categories = ['All', 'Cast Bars', 'Minted Bars', 'Doré / Unrefined'];
    
    this.filterContainer.innerHTML = categories.map(cat => `
      <button type="button" class="filter-chip ${cat === this.activeFilter ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    this.filterContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.category;
        this.renderProducts();
      });
    });
  }

  getFilteredProducts() {
    let list = [...this.products];
    if (this.activeFilter !== 'All') {
      list = list.filter(p => p.category === this.activeFilter);
    }
    if (this.activeSort === 'weight-desc') {
      list.sort((a, b) => b.weightGrams - a.weightGrams);
    } else if (this.activeSort === 'weight-asc') {
      list.sort((a, b) => a.weightGrams - b.weightGrams);
    }
    return list;
  }

  renderProducts() {
    if (!this.grid) return;
    const items = this.getFilteredProducts();

    if (items.length === 0) {
      this.grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: var(--space-12); color: var(--color-text-muted);">
          No bullion products match this category filter.
        </div>
      `;
      return;
    }

    this.grid.innerHTML = items.map(p => {
      const isChecked = this.selectedForCompare.has(p.id);
      return `
        <article class="product-card" id="card-${p.id}">
          <div class="product-thumb-container">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
            <span class="badge badge-gold" style="position: absolute; top: 14px; left: 14px;">
              ${p.purity === 'dore_raw' ? 'Doré Lot' : `${p.purity} Fineness`}
            </span>
          </div>

          <div class="product-body">
            <h3 class="product-title">${p.name}</h3>
            
            <div class="product-specs-summary">
              <div><strong>Weight:</strong> ${p.weightDisplay}</div>
              <div><strong>Category:</strong> ${p.category}</div>
              <div><strong>Dimensions:</strong> ${p.dimensions}</div>
              <div><strong>Availability:</strong> ${p.availability}</div>
            </div>

            <p style="font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; margin-bottom: var(--space-4);">
              ${p.description.substring(0, 110)}...
            </p>

            <div class="product-price-from">
              <span class="price-indicative-label">Indicative From:</span>
              <span class="price-indicative-amount tabular-nums" data-product-id="${p.id}">
                ${this.calculateProductPrice(p)}
              </span>
            </div>

            <div style="display: flex; gap: var(--space-2); align-items: center; margin-top: var(--space-2);">
              <a href="product.html?id=${p.id}" class="btn btn-secondary btn-sm" style="flex: 1;">
                View Specs
              </a>
              <button type="button" class="btn btn-primary btn-sm trigger-quote-btn" data-product="${p.name}" style="flex: 1;">
                Get Quote
              </button>
            </div>

            <label style="display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-text-muted); cursor: pointer;">
              <input type="checkbox" class="compare-toggle" data-id="${p.id}" ${isChecked ? 'checked' : ''}>
              <span>Compare (${this.selectedForCompare.size}/3)</span>
            </label>
          </div>
        </article>
      `;
    }).join('');

    this.attachCardEvents();
  }

  calculateProductPrice(product) {
    const snap = priceService.getPriceSnapshot();
    const grams = product.weightGrams;
    const premiumFactor = 1 + ((product.premiumPercent || 1.5) / 100);
    const est = snap.spotPerGram * grams * premiumFactor;
    return priceService.formatAmount(est);
  }

  updatePriceTags() {
    this.grid?.querySelectorAll('.price-indicative-amount').forEach(el => {
      const pid = el.dataset.productId;
      const product = this.products.find(p => p.id === pid);
      if (product) {
        el.textContent = this.calculateProductPrice(product);
      }
    });
  }

  attachCardEvents() {
    // Compare toggles
    this.grid.querySelectorAll('.compare-toggle').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          if (this.selectedForCompare.size >= 3) {
            e.target.checked = false;
            alert("You can compare a maximum of 3 bullion bars simultaneously.");
            return;
          }
          this.selectedForCompare.add(id);
        } else {
          this.selectedForCompare.delete(id);
        }
        this.updateCompareDrawer();
      });
    });

    // Quote triggers
    this.grid.querySelectorAll('.trigger-quote-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodName = e.target.dataset.product;
        window.dispatchEvent(new CustomEvent('open-quote-modal', {
          detail: { intent: 'buy', product: prodName }
        }));
      });
    });
  }

  setupCompareDrawer() {
    if (!this.compareDrawer) return;
    this.updateCompareDrawer();
  }

  updateCompareDrawer() {
    if (!this.compareDrawer) return;
    if (this.selectedForCompare.size === 0) {
      this.compareDrawer.classList.remove('active');
      return;
    }

    this.compareDrawer.classList.add('active');
    const selectedItems = this.products.filter(p => this.selectedForCompare.has(p.id));

    this.compareDrawer.innerHTML = `
      <div class="container">
        <div style="display: flex; align-items: center; gap: var(--space-4);">
          <strong style="color: var(--color-gold-light); font-size: var(--text-sm);">
            Comparing (${selectedItems.length}/3)
          </strong>
          <div class="compare-chips">
            ${selectedItems.map(item => `
              <div class="compare-chip">
                <span>${item.name}</span>
                <button type="button" class="remove-compare-btn" data-id="${item.id}" style="background:none; border:none; color:var(--color-text-muted); cursor:pointer;">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="display: flex; gap: var(--space-3);">
          <button type="button" class="btn btn-outline btn-sm" id="clearCompareBtn">Clear</button>
          <button type="button" class="btn btn-primary btn-sm" id="launchCompareModalBtn">Open Matrix</button>
        </div>
      </div>
    `;

    // Remove single chip
    this.compareDrawer.querySelectorAll('.remove-compare-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedForCompare.delete(btn.dataset.id);
        this.renderProducts();
        this.updateCompareDrawer();
      });
    });

    // Clear all
    this.compareDrawer.querySelector('#clearCompareBtn')?.addEventListener('click', () => {
      this.selectedForCompare.clear();
      this.renderProducts();
      this.updateCompareDrawer();
    });

    // Open comparison matrix
    this.compareDrawer.querySelector('#launchCompareModalBtn')?.addEventListener('click', () => {
      this.showComparisonMatrix(selectedItems);
    });
  }

  showComparisonMatrix(items) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay open';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 900px;">
        <div class="modal-header">
          <h3>Bullion Comparison Matrix</h3>
          <button class="modal-close-btn" id="closeCompareModal">✕</button>
        </div>
        <div class="modal-body" style="overflow-x: auto;">
          <table class="spread-table" style="min-width: 600px;">
            <thead>
              <tr>
                <th>Specification</th>
                ${items.map(i => `<th>${i.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Gross Weight</strong></td>
                ${items.map(i => `<td>${i.weightDisplay}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Certified Fineness</strong></td>
                ${items.map(i => `<td>${i.fineness}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Dimensions</strong></td>
                ${items.map(i => `<td>${i.dimensions}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Manufacturing Finish</strong></td>
                ${items.map(i => `<td>${i.finish}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Packaging &amp; Security</strong></td>
                ${items.map(i => `<td>${i.packaging}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Indicative Value</strong></td>
                ${items.map(i => `<td class="price-val" style="color: var(--color-gold-light); font-weight: 700;">${this.calculateProductPrice(i)}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" id="closeCompareModal2">Close</button>
          <button type="button" class="btn btn-primary btn-sm trigger-quote-btn" data-product="Multi-Bar Comparison Selection">Request Quote for Selected</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closeCompareModal').onclick = close;
    modal.querySelector('#closeCompareModal2').onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
    modal.querySelector('.trigger-quote-btn').onclick = () => {
      close();
      window.dispatchEvent(new CustomEvent('open-quote-modal', {
        detail: { intent: 'buy', notes: `Comparing: ${items.map(i => i.name).join(', ')}` }
      }));
    };
  }
}
