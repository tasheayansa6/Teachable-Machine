/**
 * demo.js — Generates synthetic demo images using Canvas API.
 *
 * Demo scenario: "Sunny Day" vs "Rainy Day" vs "Night Sky"
 * Each class is represented by procedurally drawn canvas images
 * so the demo works with zero external assets.
 */

const Demo = (() => {

  const CLASSES = [
    {
      name: 'Sunny Day',
      emoji: '☀️',
      count: 12,
      draw(ctx, w, h, seed) {
        const rng = seededRng(seed);
        // Sky gradient
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `hsl(200, ${70 + rng()*20}%, ${55 + rng()*15}%)`);
        sky.addColorStop(1, `hsl(210, 60%, 80%)`);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // Sun
        const sx = w * (0.55 + rng() * 0.3);
        const sy = h * (0.1 + rng() * 0.2);
        const sr = 28 + rng() * 14;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(45, 100%, ${65 + rng()*15}%)`;
        ctx.fill();

        // Sun rays
        ctx.strokeStyle = `hsla(45,100%,70%,0.6)`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(sx + Math.cos(angle) * (sr + 4), sy + Math.sin(angle) * (sr + 4));
          ctx.lineTo(sx + Math.cos(angle) * (sr + 18 + rng()*8), sy + Math.sin(angle) * (sr + 18 + rng()*8));
          ctx.stroke();
        }

        // Clouds
        for (let c = 0; c < 2 + Math.floor(rng()*2); c++) {
          drawCloud(ctx, w * (0.1 + rng()*0.7), h * (0.1 + rng()*0.25), 30 + rng()*20, rng);
        }

        // Ground
        const ground = ctx.createLinearGradient(0, h*0.72, 0, h);
        ground.addColorStop(0, `hsl(100, ${50+rng()*20}%, ${40+rng()*10}%)`);
        ground.addColorStop(1, `hsl(90, 40%, 30%)`);
        ctx.fillStyle = ground;
        ctx.fillRect(0, h * 0.72, w, h);
      }
    },
    {
      name: 'Rainy Day',
      emoji: '🌧️',
      count: 12,
      draw(ctx, w, h, seed) {
        const rng = seededRng(seed);
        // Dark sky
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `hsl(220, ${20+rng()*15}%, ${25+rng()*10}%)`);
        sky.addColorStop(1, `hsl(210, 15%, 45%)`);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // Storm clouds
        for (let c = 0; c < 3 + Math.floor(rng()*3); c++) {
          drawDarkCloud(ctx, w * (rng()), h * (0.05 + rng()*0.35), 40 + rng()*30, rng);
        }

        // Rain streaks
        ctx.strokeStyle = `rgba(180,210,255,0.55)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 60 + Math.floor(rng()*40); i++) {
          const rx = rng() * w;
          const ry = rng() * h;
          const len = 10 + rng() * 14;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + len);
          ctx.stroke();
        }

        // Wet ground
        const ground = ctx.createLinearGradient(0, h*0.72, 0, h);
        ground.addColorStop(0, `hsl(210, 20%, 35%)`);
        ground.addColorStop(1, `hsl(210, 15%, 20%)`);
        ctx.fillStyle = ground;
        ctx.fillRect(0, h * 0.72, w, h);

        // Puddle reflections
        for (let p = 0; p < 3; p++) {
          ctx.beginPath();
          ctx.ellipse(w*(0.15+rng()*0.7), h*(0.8+rng()*0.12), 20+rng()*25, 5+rng()*4, 0, 0, Math.PI*2);
          ctx.fillStyle = `rgba(150,190,230,0.3)`;
          ctx.fill();
        }
      }
    },
    {
      name: 'Night Sky',
      emoji: '🌙',
      count: 12,
      draw(ctx, w, h, seed) {
        const rng = seededRng(seed);
        // Deep night gradient
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `hsl(240, ${40+rng()*20}%, ${5+rng()*8}%)`);
        sky.addColorStop(1, `hsl(230, 30%, 15%)`);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // Stars
        for (let s = 0; s < 80 + Math.floor(rng()*60); s++) {
          const sx = rng() * w;
          const sy = rng() * h * 0.75;
          const sr = 0.5 + rng() * 1.5;
          const bright = 60 + rng() * 40;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(220, 30%, ${bright}%)`;
          ctx.fill();
        }

        // Moon
        const mx = w * (0.15 + rng() * 0.6);
        const my = h * (0.08 + rng() * 0.2);
        const mr = 22 + rng() * 12;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(55, 80%, ${75+rng()*15}%)`;
        ctx.fill();
        // Moon shadow (crescent)
        ctx.beginPath();
        ctx.arc(mx + mr * 0.35, my - mr * 0.1, mr * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(240, 40%, ${8+rng()*5}%)`;
        ctx.fill();

        // Dark ground / silhouette
        ctx.fillStyle = `hsl(230, 20%, 8%)`;
        ctx.fillRect(0, h * 0.75, w, h);

        // Tree silhouettes
        for (let t = 0; t < 3 + Math.floor(rng()*3); t++) {
          drawTree(ctx, w*(0.05 + rng()*0.9), h*0.75, 15+rng()*20, rng);
        }
      }
    }
  ];

  // ── Drawing helpers ──────────────────────────────────────────────

  function drawCloud(ctx, x, y, r, rng) {
    ctx.fillStyle = `rgba(255,255,255,${0.75 + rng()*0.2})`;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(x + i * r * 0.5, y + (i % 2 === 0 ? 0 : -r * 0.2), r * (0.5 + rng()*0.4), 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawDarkCloud(ctx, x, y, r, rng) {
    const lightness = 25 + rng() * 15;
    ctx.fillStyle = `hsl(220, 15%, ${lightness}%)`;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(x + i * r * 0.55, y + (i % 2 === 0 ? 0 : -r * 0.25), r * (0.5 + rng()*0.4), 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawTree(ctx, x, baseY, size, rng) {
    // trunk
    ctx.fillStyle = '#111';
    ctx.fillRect(x - size*0.1, baseY - size*0.6, size*0.2, size*0.6);
    // canopy triangle
    ctx.beginPath();
    ctx.moveTo(x, baseY - size * (1.8 + rng()*0.5));
    ctx.lineTo(x - size * 0.6, baseY - size * 0.5);
    ctx.lineTo(x + size * 0.6, baseY - size * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
  }

  // Simple seeded pseudo-random (mulberry32)
  function seededRng(seed) {
    let s = seed * 2654435761 >>> 0;
    return function() {
      s += 0x6D2B79F5;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ── Public API ───────────────────────────────────────────────────

  /**
   * Generate a canvas image for a class at a given seed index.
   * Returns an HTMLImageElement (via data URL).
   */
  function generateImage(classIndex, seed) {
    const canvas = document.createElement('canvas');
    canvas.width  = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    CLASSES[classIndex].draw(ctx, 224, 224, seed + classIndex * 1000);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = canvas.toDataURL('image/jpeg', 0.85);
    });
  }

  /**
   * Load all demo images for all classes.
   * Returns [{ name, emoji, images: [HTMLImageElement] }]
   */
  async function loadAll(onProgress) {
    const result = [];
    let done = 0;
    const total = CLASSES.reduce((s, c) => s + c.count, 0);

    for (let ci = 0; ci < CLASSES.length; ci++) {
      const cls = CLASSES[ci];
      const images = [];
      for (let i = 0; i < cls.count; i++) {
        images.push(await generateImage(ci, i * 7 + 3));
        done++;
        if (onProgress) onProgress(done, total);
      }
      result.push({ name: cls.name, emoji: cls.emoji, images });
    }
    return result;
  }

  /** Generate one test image per class (for the predict demo buttons). */
  async function loadTestImages() {
    const tests = [];
    for (let ci = 0; ci < CLASSES.length; ci++) {
      const img = await generateImage(ci, 999 + ci * 333);
      tests.push({ name: CLASSES[ci].name, emoji: CLASSES[ci].emoji, img });
    }
    return tests;
  }

  return { loadAll, loadTestImages, classCount: CLASSES.length };
})();
