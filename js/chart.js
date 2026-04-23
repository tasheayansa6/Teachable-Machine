/**
 * chart.js — Lightweight live training chart (no external deps)
 * Draws loss + accuracy curves on a <canvas> element.
 */
const TrainingChart = (() => {
  let canvas, ctx;
  const lossData = [];
  const accData  = [];

  function init(canvasEl) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    lossData.length = 0;
    accData.length  = 0;
    resize();
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth  * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function push(loss, acc) {
    lossData.push(loss);
    accData.push(acc);
    draw();
  }

  function draw() {
    if (!ctx) return;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 8, right: 12, bottom: 24, left: 36 };
    const cW  = W - pad.left - pad.right;
    const cH  = H - pad.top  - pad.bottom;

    // Grid lines
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#64748b' : '#94a3b8';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (cH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = `${10 * devicePixelRatio / devicePixelRatio}px Inter, sans-serif`;
      ctx.fillText((1 - i / 4).toFixed(2), 2, y + 4);
    }

    if (lossData.length < 2) return;
    const n = lossData.length;

    function plotLine(data, color) {
      const maxVal = Math.max(...data, 1);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2;
      ctx.lineJoin    = 'round';
      data.forEach((v, i) => {
        const x = pad.left + (i / (n - 1)) * cW;
        const y = pad.top  + (1 - Math.min(v, maxVal) / maxVal) * cH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dot at last point
      const lx = pad.left + cW;
      const ly = pad.top  + (1 - Math.min(data[n-1], maxVal) / maxVal) * cH;
      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    plotLine(lossData, '#ef4444');
    plotLine(accData,  '#10b981');

    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('1', pad.left, H - 6);
    ctx.fillText(String(n), pad.left + cW - 8, H - 6);
  }

  function reset() {
    lossData.length = 0;
    accData.length  = 0;
    if (ctx) ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  }

  return { init, push, draw, reset, resize };
})();
