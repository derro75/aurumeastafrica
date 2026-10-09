/**
 * AURUM EAST AFRICA — THEME TOGGLE ENGINE
 * Persistent luxury dark mode (default) & warm-ivory light mode.
 */

class ThemeManager {
  constructor() {
    this.theme = 'dark';
  }

  init() {
    try {
      const saved = localStorage.getItem('aurum_theme');
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.theme = saved;
      }
    } catch (e) {
      // Storage unavailable fallback
    }

    this.applyTheme();
    this.attachEvents();
  }

  applyTheme() {
    if (this.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.updateUI();
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('aurum_theme', this.theme);
    } catch (e) {}
    this.applyTheme();
  }

  updateUI() {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const isLight = this.theme === 'light';
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme');
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = isLight ? '🌙' : '☀️';
      }
    });
  }

  attachEvents() {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
}

export const themeManager = new ThemeManager();
