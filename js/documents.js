/**
 * AURUM EAST AFRICA — TRUST CENTRE & DOCUMENT LIGHTBOX
 * Dynamic legal registry, country filters, and verifiable document inspection lightbox.
 */

export class DocumentsManager {
  constructor(gridId, filterBarId, lightboxId) {
    this.grid = document.getElementById(gridId);
    this.filterBar = document.getElementById(filterBarId);
    this.lightbox = document.getElementById(lightboxId);
    this.documents = [];
    this.activeCountry = 'All';
    this.activeType = 'All';

    this.init();
  }

  async init() {
    try {
      const response = await fetch('data/documents.json');
      if (!response.ok) throw new Error('Failed to load documents');
      this.documents = await response.json();
    } catch (e) {
      console.warn("Using fallback empty documents array:", e);
      this.documents = [];
    }

    this.renderFilters();
    this.renderDocuments();
    this.setupLightbox();
  }

  renderFilters() {
    if (!this.filterBar) return;
    const countries = [
      { id: 'All', label: 'All Jurisdictions' },
      { id: 'Kenya', label: 'Kenya (Nairobi HQ)' },
      { id: 'DRC', label: 'DRC (Comptoir)' },
      { id: 'South Sudan', label: 'South Sudan (Juba)' }
    ];

    this.filterBar.innerHTML = countries.map(c => `
      <button type="button" class="filter-chip ${c.id === this.activeCountry ? 'active' : ''}" data-country="${c.id}">
        ${c.label}
      </button>
    `).join('');

    this.filterBar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCountry = btn.dataset.country;
        this.renderDocuments();
      });
    });
  }

  getFiltered() {
    if (this.activeCountry === 'All') return this.documents;
    return this.documents.filter(d => d.country === this.activeCountry);
  }

  renderDocuments() {
    if (!this.grid) return;
    const docs = this.getFiltered();

    if (docs.length === 0) {
      this.grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: var(--space-12); color: var(--color-text-muted);">
          No registered documents for this filter.
        </div>
      `;
      return;
    }

    this.grid.innerHTML = docs.map(doc => `
      <article class="document-card" data-claim-source="${doc.claimSource}">
        <div class="document-preview-thumb">
          <img src="${doc.thumbnail}" alt="${doc.title} thumbnail" loading="lazy">
        </div>
        <div class="document-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
            <span class="badge badge-gold">${doc.country}</span>
            <span class="badge badge-success">${doc.type}</span>
          </div>
          
          <h4 style="font-size: var(--text-lg); margin-bottom: var(--space-3);">${doc.title}</h4>
          
          <div class="document-meta-item">
            <strong>Issuer:</strong> ${doc.issuer}
          </div>
          <div class="document-meta-item">
            <strong>Registration / No:</strong> <span style="font-family: var(--font-mono);">${doc.number}</span>
          </div>
          <div class="document-meta-item">
            <strong>Validity:</strong> ${doc.issueDate} — ${doc.expiryDate}
          </div>

          <p style="font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; margin: var(--space-3) 0 var(--space-4);">
            ${doc.description}
          </p>

          <div class="document-card-actions">
            <button type="button" class="btn btn-secondary btn-sm view-doc-btn" data-doc-id="${doc.id}" style="flex: 1;">
              Inspect Document
            </button>
            <a href="${doc.verifyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" title="Verify with statutory authority">
              Verify ↗
            </a>
          </div>
        </div>
      </article>
    `).join('');

    this.grid.querySelectorAll('.view-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.dataset.docId;
        const doc = this.documents.find(d => d.id === docId);
        if (doc) this.openLightbox(doc);
      });
    });
  }

  setupLightbox() {
    if (!this.lightbox) return;
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox || e.target.classList.contains('close-lightbox-trigger')) {
        this.closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('open')) {
        this.closeLightbox();
      }
    });
  }

  openLightbox(doc) {
    if (!this.lightbox) return;

    this.lightbox.innerHTML = `
      <div class="lightbox-container" role="dialog" aria-modal="true" aria-labelledby="lightboxTitle">
        <!-- Document Graphic Preview Pane -->
        <div class="lightbox-preview-pane">
          <img src="${doc.file}" alt="${doc.title} full document preview" style="max-height: 90%; max-width: 90%;">
        </div>

        <!-- Verification & Metadata Sidebar -->
        <div class="lightbox-sidebar">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <span class="badge badge-gold">${doc.country} • ${doc.type}</span>
            <button type="button" class="close-lightbox-trigger" style="background:none; border:none; color:var(--color-text-muted); font-size:24px; cursor:pointer;" aria-label="Close document viewer">✕</button>
          </div>

          <h3 id="lightboxTitle" style="font-size: var(--text-2xl); margin-bottom: var(--space-3);">${doc.title}</h3>
          
          <div style="background: var(--color-bg-base); border: 1px solid var(--color-gold-border); border-radius: var(--radius-sm); padding: var(--space-4); margin-bottom: var(--space-4);">
            <div style="font-size: var(--text-xs); color: var(--color-text-muted);">Issuing Authority:</div>
            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-2);">${doc.issuer}</div>

            <div style="font-size: var(--text-xs); color: var(--color-text-muted);">Official Document / Permit Number:</div>
            <div style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-gold-light); font-weight: 700; margin-bottom: var(--space-2);">${doc.number}</div>

            <div style="font-size: var(--text-xs); color: var(--color-text-muted);">Effective Status:</div>
            <div style="font-size: var(--text-xs); color: var(--color-success); font-weight: 600;">${doc.status}</div>
          </div>

          <p style="font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-6);">
            ${doc.description}
          </p>

          <div style="margin-top: auto; display: flex; flex-direction: column; gap: var(--space-3);">
            <a href="${doc.verifyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="width: 100%;">
              Verify with Issuing Authority ↗
            </a>
            <a href="${doc.file}" download="${doc.id}.svg" class="btn btn-secondary btn-sm" style="width: 100%;">
              Download Specimen Copy
            </a>
          </div>
        </div>
      </div>
    `;

    this.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}
