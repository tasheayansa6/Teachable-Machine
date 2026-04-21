/**
 * utils.js — Helper functions
 */

/**
 * Resize and crop an image element to a square canvas, returning a tensor.
 * @param {HTMLImageElement} imgEl
 * @param {number} size - target width/height in pixels
 * @returns {HTMLCanvasElement}
 */
function imageToCanvas(imgEl, size = 224) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // Center-crop
  const min = Math.min(imgEl.naturalWidth, imgEl.naturalHeight);
  const sx = (imgEl.naturalWidth  - min) / 2;
  const sy = (imgEl.naturalHeight - min) / 2;
  ctx.drawImage(imgEl, sx, sy, min, min, 0, 0, size, size);
  return canvas;
}

/**
 * Load a File object as an HTMLImageElement (resolves when loaded).
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Show a temporary toast notification.
 * @param {string} message
 * @param {number} duration - ms
 */
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/**
 * Clamp a number between min and max.
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
