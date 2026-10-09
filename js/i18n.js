/**
 * AURUM EAST AFRICA — LIGHTWEIGHT I18N ENGINE
 * Client-side language switcher supporting English, French, and Kiswahili.
 */

class I18nEngine {
  constructor() {
    this.currentLang = 'en';
    this.translations = {};
    this.loaded = false;
  }

  async init() {
    try {
      const saved = localStorage.getItem('aurum_lang');
      if (saved && ['en', 'fr', 'sw'].includes(saved)) {
        this.currentLang = saved;
      }
    } catch (e) {
      // Storage unavailable fallback
    }

    await this.loadLanguage(this.currentLang);
    this.applyTranslations();
    this.updateLanguageUI();
  }

  async loadLanguage(lang) {
    try {
      const response = await fetch(`i18n/${lang}.json`);
      if (!response.ok) throw new Error(`Could not load i18n/${lang}.json`);
      this.translations[lang] = await response.json();
      this.currentLang = lang;
      try {
        localStorage.setItem('aurum_lang', lang);
      } catch (e) {}
    } catch (err) {
      console.warn(`Falling back to English i18n:`, err);
      if (lang !== 'en' && !this.translations['en']) {
        await this.loadLanguage('en');
      }
    }
  }

  async setLanguage(lang) {
    if (!['en', 'fr', 'sw'].includes(lang)) return;
    if (!this.translations[lang]) {
      await this.loadLanguage(lang);
    } else {
      this.currentLang = lang;
      try {
        localStorage.setItem('aurum_lang', lang);
      } catch (e) {}
    }
    this.applyTranslations();
    this.updateLanguageUI();
  }

  getTranslation(key) {
    const dict = this.translations[this.currentLang] || this.translations['en'];
    if (!dict) return key;

    const parts = key.split('.');
    let cur = dict;
    for (const part of parts) {
      if (cur && cur[part] !== undefined) {
        cur = cur[part];
      } else {
        return null;
      }
    }
    return cur;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.getTranslation(key);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update document lang attribute
    document.documentElement.lang = this.currentLang;
  }

  updateLanguageUI() {
    const label = document.getElementById('currentLangLabel');
    if (label) {
      const displayNames = { en: 'EN', fr: 'FR', sw: 'SW' };
      label.textContent = displayNames[this.currentLang] || 'EN';
    }

    document.querySelectorAll('.lang-option').forEach(opt => {
      const isSelected = opt.dataset.lang === this.currentLang;
      opt.classList.toggle('active', isSelected);
      opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }
}

export const i18n = new I18nEngine();
