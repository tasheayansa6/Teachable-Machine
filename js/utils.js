/**
 * utils.js — Shared helpers
 */

/** Center-crop + resize an image to a square canvas */
function imageToCanvas(imgEl, size = 224) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const min = Math.min(imgEl.naturalWidth || imgEl.width, imgEl.naturalHeight || imgEl.height);
  const sx  = ((imgEl.naturalWidth  || imgEl.width)  - min) / 2;
  const sy  = ((imgEl.naturalHeight || imgEl.height) - min) / 2;
  ctx.drawImage(imgEl, sx, sy, min, min, 0, 0, size, size);
  return canvas;
}

/** File → HTMLImageElement */
function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** src string / data-url → HTMLImageElement */
function srcToImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Toast notification */
function showToast(message, type = 'default', duration = 3200) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'show';
  if (type === 'success') toast.classList.add('toast-success');
  if (type === 'error')   toast.classList.add('toast-error');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.className = ''; }, duration);
}

/** Seeded pseudo-random (mulberry32) */
function seededRng(seed) {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** CLASS ACCENT COLOURS */
const CLASS_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];
function classColor(idx) { return CLASS_COLORS[idx % CLASS_COLORS.length]; }
