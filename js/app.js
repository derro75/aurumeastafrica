/**
 * AURUM EAST AFRICA — CORE APPLICATION ORCHESTRATOR
 * Preloader, Header interactions, Live Tickers, Drawer, Toasts, and Animations.
 */

import { CONFIG } from '../config.js';
import { priceService } from './priceService.js';
import { themeManager } from './theme.js';
import { i18n } from './i18n.js';
import { QuoteModalManager } from './quoteModal.js';

class Application {
  constructor() {
    this.quoteManager = null;
  }

  init() {
    // Start the loader immediately so network-backed translations cannot delay dismissal.
    this.setupLuxuryPreloader();

    // 1. Initialize Themes and I18n first to avoid layout flashes
    themeManager.init();
    void i18n.init();

    // 2. Start Live Benchmark Price Service
    priceService.init();

    // 3. Initialize Shared Quote Modal
    this.quoteManager = new QuoteModalManager();

    // 4. Setup Header & Navigation
    this.setupHeader();
    this.setupMobileDrawer();
    this.setupLanguageDropdown();

    // 5. Setup Live Price Mini-Tickers across Header and Hero
    this.setupLiveTickers();

    // 6. Setup Toast, Cookie Banner, and Scroll Reveals
    this.setupCookieBanner();
    this.setupScrollReveal();
    this.setupAccordions();

    console.log(`Aurum East Africa platform initialized. Headquarters: ${CONFIG.company.headquartersCity}`);
  }

  /**
   * Bespoke Luxury Loading Experience
   */
  setupLuxuryPreloader() {
    const preloader = document.getElementById('luxuryPreloader');
    if (!preloader) return;

    const progressBar = preloader.querySelector('.preloader-progress-bar');
    const statusText = preloader.querySelector('.preloader-status-text');

    // Check if user has already loaded in this session
    let isReturning = false;
    try {
      isReturning = sessionStorage.getItem('aurum_preloaded') === 'true';
    } catch (e) {}

    const targetDuration = isReturning ? 250 : 850;
    const startTime = performance.now();
    let dismissed = false;
    let watchdog;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      clearTimeout(watchdog);
      preloader.classList.add('fade-out');
      try {
        sessionStorage.setItem('aurum_preloaded', 'true');
      } catch (e) {}
    };

    // Never leave the page covered if progress animation frames are delayed.
    watchdog = setTimeout(dismiss, 2200);

    const updateProgress = (now) => {
      if (dismissed) return;
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.round((elapsed / targetDuration) * 100));

      if (progressBar) progressBar.style.width = `${progress}%`;

      if (statusText) {
        if (progress < 40) {
          statusText.textContent = "Connecting Secure Feed...";
        } else if (progress < 80) {
          statusText.textContent = "Calibrating Bullion Benchmark...";
        } else {
          statusText.textContent = "Trading Desk Ready";
        }
      }

      if (elapsed < targetDuration) {
        requestAnimationFrame(updateProgress);
      } else {
        dismiss();
      }
    };

    requestAnimationFrame(updateProgress);
  }

  /**
   * Sticky Header Shrink on Scroll
   */
  setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * Accessible Fullscreen Mobile Menu Drawer
   */
  setupMobileDrawer() {
    const toggleBtn = document.getElementById('menuToggleBtn');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('closeDrawerBtn');

    if (!toggleBtn || !drawer) return;

    const openDrawer = () => {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    closeBtn?.addEventListener('click', closeDrawer);

    // Close when clicking any nav link in drawer
    drawer.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  /**
   * Language Switcher Dropdown Interaction
   */
  setupLanguageDropdown() {
    const selector = document.querySelector('.lang-selector');
    const toggleBtn = document.querySelector('.lang-btn');
    if (!selector || !toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selector.classList.toggle('open');
    });

    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        i18n.setLanguage(lang);
        selector.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      selector.classList.remove('open');
    });
  }

  /**
   * Real-Time Spot Price Tickers across all pages
   */
  setupLiveTickers() {
    const tickerVal = document.getElementById('topBarTickerValue');
    const heroSpotPrice = document.getElementById('heroLivePrice');
    const heroPriceTimestamp = document.getElementById('heroPriceTimestamp');

    priceService.subscribe((snapshot) => {
      const formattedPerOz = priceService.formatAmount(snapshot.spotPerOz);
      const formattedPerGram = priceService.formatAmount(snapshot.spotPerGram);

      document.querySelectorAll('[data-price-weight-grams]').forEach((price) => {
        const weightGrams = Number(price.dataset.priceWeightGrams);
        price.textContent = priceService.formatAmount(snapshot.spotPerGram * weightGrams, 'USD');
      });

      if (tickerVal) {
        tickerVal.textContent = `${formattedPerOz} / oz  •  ${formattedPerGram} / g`;
      }

      if (heroSpotPrice) {
        heroSpotPrice.textContent = formattedPerOz;
      }

      if (heroPriceTimestamp) {
        heroPriceTimestamp.textContent = `Updated ${snapshot.formattedTime} EAT • Indicative Spot`;
      }
    });
  }

  /**
   * Cookie Consent Banner
   */
  setupCookieBanner() {
    let consentGiven = false;
    try {
      consentGiven = localStorage.getItem('aurum_cookie_consent') === 'true';
    } catch (e) {}

    if (consentGiven) return;

    const banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Privacy and Cookies Consent');
    banner.innerHTML = `
      <p>
        We use essential cookies to maintain your currency preferences, language selection, and secure quote sessions. We do not sell data or run third-party advertising trackers.
      </p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-primary btn-sm" id="acceptCookiesBtn">Accept</button>
        <button type="button" class="btn btn-secondary btn-sm" id="declineCookiesBtn">Essential Only</button>
      </div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('show'), 2000);

    const dismiss = () => {
      banner.classList.remove('show');
      try {
        localStorage.setItem('aurum_cookie_consent', 'true');
      } catch (e) {}
      setTimeout(() => banner.remove(), 400);
    };

    banner.querySelector('#acceptCookiesBtn').addEventListener('click', dismiss);
    banner.querySelector('#declineCookiesBtn').addEventListener('click', dismiss);
  }

  /**
   * Scroll Reveal Micro-Animations (IntersectionObserver)
   */
  setupScrollReveal() {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
      });
    }
  }

  /**
   * Accordion Keyboard & ARIA Enhancement
   */
  setupAccordions() {
    document.querySelectorAll('.accordion-item summary').forEach(summary => {
      summary.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          summary.click();
        }
      });
    });
  }

  /**
   * Toast Notification Dispatcher
   */
  static showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }
}

// Start application when DOM is parsed
const app = new Application();
document.addEventListener('DOMContentLoaded', () => app.init());

export { Application };
