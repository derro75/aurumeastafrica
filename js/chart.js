/**
 * AURUM EAST AFRICA — FINANCIAL CANVAS CHART
 * Lightweight, zero-dependency, ultra-fast canvas chart with hover tooltips and accessibility table.
 */

import { priceService } from './priceService.js';

export class GoldPriceChart {
  constructor(canvasId, accessibleContainerId) {
    this.canvas = document.getElementById(canvasId);
    this.tableContainer = document.getElementById(accessibleContainerId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.timeframe = '1D';
    this.hoverIndex = -1;

    this.setupCanvas();
    this.attachEvents();
    this.render();

    // Re-render if window resizes
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.render();
    });
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = 320;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  setTimeframe(tf) {
    this.timeframe = tf;
    this.hoverIndex = -1;
    this.render();
    this.updateAccessibleTable();
  }

  attachEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const data = priceService.getHistorical(this.timeframe);
      const padding = 50;
      const step = (this.width - padding * 2) / (data.length - 1);

      let closestIdx = 0;
      let minDiff = Infinity;
      data.forEach((_, i) => {
        const pointX = padding + i * step;
        const diff = Math.abs(mouseX - pointX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });

      this.hoverIndex = closestIdx;
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverIndex = -1;
      this.render();
    });
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const data = priceService.getHistorical(this.timeframe);

    ctx.clearRect(0, 0, w, h);

    if (!data || data.length === 0) return;

    const paddingX = 55;
    const paddingY = 45;

    const values = data.map(d => d.value);
    const minVal = Math.min(...values) * 0.9995;
    const maxVal = Math.max(...values) * 1.0005;
    const range = maxVal - minVal || 1;

    const getX = (i) => paddingX + i * ((w - paddingX * 2) / (data.length - 1));
    const getY = (val) => h - paddingY - ((val - minVal) / range) * (h - paddingY * 2);

    // 1. Draw subtle horizontal grid lines & price labels
    ctx.strokeStyle = 'rgba(201, 162, 75, 0.12)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#A8A396';
    ctx.font = '10px Inter, sans-serif';

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const gridY = paddingY + i * ((h - paddingY * 2) / gridLines);
      const gridPrice = maxVal - (i / gridLines) * range;

      ctx.beginPath();
      ctx.moveTo(paddingX, gridY);
      ctx.lineTo(w - paddingX, gridY);
      ctx.stroke();

      ctx.fillText(`$${gridPrice.toFixed(1)}`, 8, gridY + 3);
    }

    // 2. Draw Area Gradient beneath line
    const areaGrad = ctx.createLinearGradient(0, paddingY, 0, h - paddingY);
    areaGrad.addColorStop(0, 'rgba(201, 162, 75, 0.28)');
    areaGrad.addColorStop(1, 'rgba(201, 162, 75, 0.00)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0].value));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(i), getY(data[i].value));
    }
    ctx.lineTo(getX(data.length - 1), h - paddingY);
    ctx.lineTo(getX(0), h - paddingY);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // 3. Draw Main Golden Trendline
    const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
    lineGrad.addColorStop(0, '#E3C77A');
    lineGrad.addColorStop(0.5, '#C9A24B');
    lineGrad.addColorStop(1, '#FFE9AA');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0].value));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(i), getY(data[i].value));
    }
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Draw X-axis timestamps and points
    data.forEach((d, i) => {
      const ptX = getX(i);
      const ptY = getY(d.value);

      // Label
      ctx.fillStyle = '#A8A396';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.time, ptX, h - 16);

      // Point circle
      ctx.beginPath();
      ctx.arc(ptX, ptY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0B0D10';
      ctx.fill();
      ctx.strokeStyle = '#C9A24B';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 5. Active Hover Tooltip Callout
    if (this.hoverIndex >= 0 && this.hoverIndex < data.length) {
      const hovered = data[this.hoverIndex];
      const hX = getX(this.hoverIndex);
      const hY = getY(hovered.value);

      // Glowing outer ring on active point
      ctx.beginPath();
      ctx.arc(hX, hY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#C9A24B';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip Card
      const tooltipText = `$${hovered.value.toFixed(2)} / oz (${hovered.time})`;
      ctx.font = 'bold 11px Inter, sans-serif';
      const textWidth = ctx.measureText(tooltipText).width;
      const boxW = textWidth + 24;
      const boxH = 28;
      let boxX = hX - boxW / 2;
      let boxY = hY - boxH - 12;

      // Keep inside bounds
      if (boxX < 10) boxX = 10;
      if (boxX + boxW > w - 10) boxX = w - boxW - 10;
      if (boxY < 10) boxY = hY + 12;

      ctx.fillStyle = '#14171C';
      ctx.strokeStyle = '#C9A24B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFF0C2';
      ctx.textAlign = 'center';
      ctx.fillText(tooltipText, boxX + boxW / 2, boxY + 18);
    }
  }

  updateAccessibleTable() {
    if (!this.tableContainer) return;
    const data = priceService.getHistorical(this.timeframe);
    let html = `
      <table class="spread-table" aria-label="Historical Gold Spot Prices table">
        <thead>
          <tr>
            <th scope="col">Time Interval (${this.timeframe})</th>
            <th scope="col">Indicative Spot (USD/oz)</th>
          </tr>
        </thead>
        <tbody>
    `;
    data.forEach(d => {
      html += `
        <tr>
          <td>${d.time}</td>
          <td class="tabular-nums font-weight-bold">$${d.value.toFixed(2)}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    this.tableContainer.innerHTML = html;
  }
}
