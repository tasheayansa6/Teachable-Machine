/**
 * demo.js — Procedurally generated demo images (Canvas API, zero assets)
 * Classes: Sunny Day · Rainy Day · Night Sky
 */
const Demo = (() => {
  const CLASSES = [
    {
      name: 'Sunny Day', emoji: '☀️', count: 15,
      draw(ctx, w, h, rng) {
        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `hsl(${200+rng()*10}, ${70+rng()*15}%, ${55+rng()*12}%)`);
        sky.addColorStop(1, `hsl(210, 60%, 82%)`);
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
        // Sun
        const sx = w*(0.55+rng()*0.3), sy = h*(0.1+rng()*0.18), sr = 28+rng()*14;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2);
        ctx.fillStyle = `hsl(45,100%,${65+rng()*12}%)`; ctx.fill();
        // Rays
        ctx.strokeStyle = `hsla(45,100%,70%,0.55)`; ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const a = (i/8)*Math.PI*2;
          ctx.beginPath();
          ctx.moveTo(sx+Math.cos(a)*(sr+5), sy+Math.sin(a)*(sr+5));
          ctx.lineTo(sx+Math.cos(a)*(sr+20+rng()*8), sy+Math.sin(a)*(sr+20+rng()*8));
          ctx.stroke();
        }
        // Clouds
        for (let c = 0; c < 2+Math.floor(rng()*3); c++)
          _cloud(ctx, w*(0.05+rng()*0.8), h*(0.08+rng()*0.28), 28+rng()*22, rng, 'rgba(255,255,255,0.85)');
        // Ground
        const g = ctx.createLinearGradient(0, h*0.72, 0, h);
        g.addColorStop(0, `hsl(${100+rng()*15},${50+rng()*18}%,${40+rng()*10}%)`);
        g.addColorStop(1, `hsl(90,38%,28%)`);
        ctx.fillStyle = g; ctx.fillRect(0, h*0.72, w, h);
      }
    },
    {
      name: 'Rainy Day', emoji: '🌧️', count: 15,
      draw(ctx, w, h, rng) {
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `hsl(220,${18+rng()*12}%,${22+rng()*10}%)`);
        sky.addColorStop(1, `hsl(210,14%,44%)`);
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
        for (let c = 0; c < 4+Math.floor(rng()*3); c++)
          _cloud(ctx, w*rng(), h*(0.04+rng()*0.32), 42+rng()*32, rng, `hsl(220,14%,${24+rng()*14}%)`);
        ctx.strokeStyle = `rgba(180,210,255,0.5)`; ctx.lineWidth = 1;
        for (let i = 0; i < 70+Math.floor(rng()*40); i++) {
          const rx = rng()*w, ry = rng()*h, len = 10+rng()*14;
          ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx-3, ry+len); ctx.stroke();
        }
        const g = ctx.createLinearGradient(0, h*0.72, 0, h);
        g.addColorStop(0, `hsl(210,18%,32%)`); g.addColorStop(1, `hsl(210,14%,18%)`);
        ctx.fillStyle = g; ctx.fillRect(0, h*0.72, w, h);
        for (let p = 0; p < 4; p++) {
          ctx.beginPath();
          ctx.ellipse(w*(0.12+rng()*0.76), h*(0.8+rng()*0.12), 18+rng()*26, 4+rng()*4, 0, 0, Math.PI*2);
          ctx.fillStyle = `rgba(140,185,225,0.28)`; ctx.fill();
        }
      }
    },
    {
      name: 'Night Sky', emoji: '🌙', count: 15,
      draw(ctx, w, h, rng) {
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `hsl(240,${38+rng()*18}%,${5+rng()*7}%)`);
        sky.addColorStop(1, `hsl(230,28%,14%)`);
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
        for (let s = 0; s < 100+Math.floor(rng()*60); s++) {
          const sx = rng()*w, sy = rng()*h*0.76, sr = 0.4+rng()*1.6;
          ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2);
          ctx.fillStyle = `hsl(220,28%,${58+rng()*40}%)`; ctx.fill();
        }
        const mx = w*(0.15+rng()*0.6), my = h*(0.08+rng()*0.2), mr = 22+rng()*12;
        ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2);
        ctx.fillStyle = `hsl(55,78%,${74+rng()*14}%)`; ctx.fill();
        ctx.beginPath(); ctx.arc(mx+mr*0.36, my-mr*0.1, mr*0.84, 0, Math.PI*2);
        ctx.fillStyle = `hsl(240,38%,${7+rng()*5}%)`; ctx.fill();
        ctx.fillStyle = `hsl(230,18%,7%)`; ctx.fillRect(0, h*0.75, w, h);
        for (let t = 0; t < 3+Math.floor(rng()*4); t++)
          _tree(ctx, w*(0.04+rng()*0.92), h*0.75, 14+rng()*22, rng);
      }
    }
  ];

  function _cloud(ctx, x, y, r, rng, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(x+i*r*0.52, y+(i%2===0?0:-r*0.22), r*(0.48+rng()*0.38), 0, Math.PI*2);
      ctx.fill();
    }
  }
  function _tree(ctx, x, baseY, size, rng) {
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(x-size*0.1, baseY-size*0.6, size*0.2, size*0.6);
    ctx.beginPath();
    ctx.moveTo(x, baseY-size*(1.8+rng()*0.5));
    ctx.lineTo(x-size*0.6, baseY-size*0.5);
    ctx.lineTo(x+size*0.6, baseY-size*0.5);
    ctx.closePath(); ctx.fill();
  }

  function _generate(classIdx, seed) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 224;
    const ctx = canvas.getContext('2d');
    CLASSES[classIdx].draw(ctx, 224, 224, seededRng(seed + classIdx * 1337));
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = canvas.toDataURL('image/jpeg', 0.88);
    });
  }

  async function loadAll(onProgress) {
    const result = [];
    let done = 0;
    const total = CLASSES.reduce((s, c) => s + c.count, 0);
    for (let ci = 0; ci < CLASSES.length; ci++) {
      const images = [];
      for (let i = 0; i < CLASSES[ci].count; i++) {
        images.push(await _generate(ci, i * 11 + 7));
        if (onProgress) onProgress(++done, total);
      }
      result.push({ name: CLASSES[ci].name, emoji: CLASSES[ci].emoji, images });
    }
    return result;
  }

  async function loadTestImages() {
    return Promise.all(CLASSES.map(async (cls, ci) => ({
      name: cls.name, emoji: cls.emoji,
      img: await _generate(ci, 9999 + ci * 777)
    })));
  }

  return { loadAll, loadTestImages, classCount: CLASSES.length };
})();
