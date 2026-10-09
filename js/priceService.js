/**
 * AURUM EAST AFRICA — PRICE SERVICE
 * Pluggable Real-Time Gold Benchmark & Multi-Currency Engine
 * Provides live indicative prices, spread calculations, and historical points.
 */

import { CONFIG } from '../config.js';

class PriceService {
  constructor() {
    this.currentSpotUsdPerOz = CONFIG.pricing.defaultSpotUsdPerOz;
    this.currentCurrency = CONFIG.pricing.baseCurrency;
    this.lastUpdated = new Date();
    this.listeners = new Set();
    this.timer = null;
    this.historyData = this.generateHistoricalData();
  }

  init() {
    // Start live indicative tick loop
    this.startLiveFeed();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately invoke with current state
    callback(this.getPriceSnapshot());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const snapshot = this.getPriceSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error("Price listener error:", err);
      }
    }
  }

  /**
   * Set user currency (USD, KES, EUR, UGX, CDF)
   */
  setCurrency(currCode) {
    if (CONFIG.pricing.currencies[currCode]) {
      this.currentCurrency = currCode;
      this.notify();
    }
  }

  /**
   * Mock Real-Time Adapter with subtle realistic market volatility
   * Easily swappable with a licensed API endpoint.
   */
  startLiveFeed() {
    this.timer = setInterval(() => {
      // Simulate micro-fluctuation between -0.15% and +0.15%
      const deltaPercent = (Math.random() - 0.49) * 0.0018;
      this.currentSpotUsdPerOz = +(this.currentSpotUsdPerOz * (1 + deltaPercent)).toFixed(2);
      this.lastUpdated = new Date();
      this.notify();
    }, CONFIG.pricing.updateIntervalMs);
  }

  /**
   * Documented Adapter Interface for connecting a real live API
   * (e.g., GoldAPI.io, Metals-API, Kitco Developer Feed, Bloomberg B-PIPE)
   * 
   * Usage:
   * priceService.connectLicensedFeed('https://api.metals.live/v1/spot/gold', 'API_KEY');
   */
  async connectLicensedFeed(endpointUrl, apiKey) {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'x-access-token': apiKey, 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      
      // Adapt field from provider (e.g. data.price or data.gold)
      if (data && (data.price || data.rate)) {
        this.currentSpotUsdPerOz = parseFloat(data.price || data.rate);
        this.lastUpdated = new Date();
        this.notify();
      }
    } catch (error) {
      console.warn("Live API connection failed, maintaining indicative benchmark:", error);
    }
  }

  /**
   * Returns complete calculated pricing object for all units and currencies
   */
  getPriceSnapshot() {
    const curr = CONFIG.pricing.currencies[this.currentCurrency];
    const fxRate = curr.rateAgainstUsd;
    const troyGrams = CONFIG.pricing.troyOunceToGrams;

    // Spot Prices in chosen currency
    const spotPerOzInCurr = this.currentSpotUsdPerOz * fxRate;
    const spotPerGramInCurr = spotPerOzInCurr / troyGrams;
    const spotPerKgInCurr = spotPerGramInCurr * 1000;

    // Buy Price (Client buys refined bullion from Aurum: spot + markup)
    const buyMarkupFactor = 1 + (CONFIG.pricing.spread.retailBuyMarkupPercent / 100);
    const buyPerGram = spotPerGramInCurr * buyMarkupFactor;
    const buyPerOz = spotPerOzInCurr * buyMarkupFactor;
    const buyPerKg = spotPerKgInCurr * buyMarkupFactor;

    return {
      currency: this.currentCurrency,
      currencySymbol: curr.symbol,
      decimals: curr.decimals,
      lastUpdated: this.lastUpdated,
      formattedTime: this.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      spotUsdPerOz: this.currentSpotUsdPerOz,
      
      // Indicative Spot
      spotPerOz: spotPerOzInCurr,
      spotPerGram: spotPerGramInCurr,
      spotPerKg: spotPerKgInCurr,

      // Trading Desk Buy Rates (Retail Bullion)
      buyPerGram,
      buyPerOz,
      buyPerKg,

      spreadBuyPercent: CONFIG.pricing.spread.retailBuyMarkupPercent,
    };
  }

  /**
   * Generates realistic historical dataset for 1D, 1W, 1M, 1Y chart visualizer
   */
  generateHistoricalData() {
    const base = CONFIG.pricing.defaultSpotUsdPerOz;
    return {
      "1D": [
        { time: "09:00", value: base - 4.5 },
        { time: "11:00", value: base - 2.1 },
        { time: "13:00", value: base + 3.8 },
        { time: "15:00", value: base + 1.2 },
        { time: "17:00", value: base }
      ],
      "1W": [
        { time: "Mon", value: base - 18.0 },
        { time: "Tue", value: base - 8.5 },
        { time: "Wed", value: base - 12.0 },
        { time: "Thu", value: base + 6.2 },
        { time: "Fri", value: base }
      ],
      "1M": [
        { time: "Wk 1", value: base - 45.0 },
        { time: "Wk 2", value: base - 28.0 },
        { time: "Wk 3", value: base + 14.5 },
        { time: "Wk 4", value: base }
      ],
      "1Y": [
        { time: "Q1", value: base - 210.0 },
        { time: "Q2", value: base - 140.0 },
        { time: "Q3", value: base - 55.0 },
        { time: "Q4", value: base }
      ]
    };
  }

  getHistorical(timeframe = "1D") {
    return this.historyData[timeframe] || this.historyData["1D"];
  }

  /**
   * Helper currency formatter
   */
  formatAmount(val, overrideCurrency = null) {
    const code = overrideCurrency || this.currentCurrency;
    const curr = CONFIG.pricing.currencies[code] || CONFIG.pricing.currencies.USD;
    return `${curr.symbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: curr.decimals,
      maximumFractionDigits: curr.decimals
    })}`;
  }
}

export const priceService = new PriceService();
