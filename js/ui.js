/**
 * ui.js — All DOM rendering and UI state management
 */
const UI = (() => {
  // ── Element refs ──────────────────────────────────────────────
  const classesContainer = document.getElementById('classes-container');
  const classesEmpty     = document.getElementById('classes-empty');
  const trainBtn         = document.getElementById('train-btn');
  const trainStatusBar   = document.getElementById('train-status-bar');
  const trainStatusText  = document.getElementById('train-status-text');
  const progressWrap     = document.getElementById('train-progress-wrap');
  const progressBar      = document.getElementById('train-progress-bar');
  const progressLabel    = document.getElementById('train-progress-label');
  const chartWrap        = document.getElementById('chart-wrap');
  const trainChart       = document.getElementById('train-chart');
  const trainStats       = document.getElementById('train-stats');
  const modelActions     = document.getElementById('model-actions');
  const predictSection   = document.getElementById('section-predict');
  const predictResults   = document.getElementById('predict-results-wrap');
  const predictPreview   = document.getElementById('predict-preview-img');
  const resultsContainer = document.getElementById('results-container');
  const template         = document.getElementById('class-card-tpl');

  let cardCount = 0;

  // ── Class Cards ───────────────────────────────────────────────
  function addClassCard(callbacks, prefill = {}) {
    const idx  = cardCount++;
    const frag = template.content.cloneNode(true);
    const card = frag.querySelector('.class-card');
    card.dataset.index = idx;

    const dot       = card.querySelector('.color-dot');
    const nameInput = card.querySelector('.class-name-input');
    const fileInput = card.querySelector('.class-file-input');
    const uploadZone= card.querySelector('.class-upload-zone');
    const countBadge= card.querySelector('.class-count-badge');
    const thumbs    = card.querySelector('.class-thumbnails');
    const removeBtn = card.querySelector('.class-remove-btn');
    const clearBtn  = card.querySelector('.class-clear-btn');
    const uploadLbl = card.querySelector('.upload-label');

    // Unique file input id
    const fid = `fi-${idx}`;
    fileInput.id = fid;
    uploadLbl.setAttribute('for', fid);

    // Accent colour
    dot.style.background = classColor(idx);
    card.style.setProperty('--class-accent', classColor(idx));

    // Pre-fill
    if (prefill.name) nameInput.value = prefill.name;
    nameInput.placeholder = I18n.t('classesTitle') ? `Class ${idx + 1}` : `Class ${idx + 1}`;

    // Events
    nameInput.addEventListener('input', () => callbacks.onNameChange(idx, nameInput.value));

    fileInput.addEventListener('change', async e => {
      await _handleFiles(Array.from(e.target.files), idx, countBadge, thumbs, callbacks.onImages);
      fileInput.value = '';
    });

    uploadZone.addEventListener('dragover',  e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', ()  => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', async e => {
      e.preventDefault(); uploadZone.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      await _handleFiles(files, idx, countBadge, thumbs, callbacks.onImages);
    });

    removeBtn.addEventListener('click', () => { card.remove(); callbacks.onRemove(idx); _checkEmpty(); });
    clearBtn.addEventListener('click',  () => {
      thumbs.innerHTML = '';
      countBadge.textContent = '0 images';
      callbacks.onClear(idx);
    });

    classesContainer.appendChild(frag);

    if (prefill.images && prefill.images.length) {
      _renderThumbs(prefill.images, countBadge, thumbs);
    }

    _checkEmpty();
    return idx;
  }

  async function _handleFiles(files, idx, countBadge, thumbs, onImages) {
    if (!files.length) return;
    const imgs = await Promise.all(files.map(fileToImage));
    onImages(idx, imgs);
    _renderThumbs(imgs, countBadge, thumbs);
  }

  function _renderThumbs(imgs, countBadge, thumbs) {
    const prev = parseInt(countBadge.textContent) || 0;
    const total = prev + imgs.length;
    countBadge.textContent = `${total} image${total !== 1 ? 's' : ''}`;
    imgs.forEach(img => {
      const el = document.createElement('img');
      el.src = img.src; el.alt = 'sample';
      thumbs.appendChild(el);
    });
  }

  function _checkEmpty() {
    const hasCards = classesContainer.children.length > 0;
    classesEmpty.style.display = hasCards ? 'none' : 'block';
  }

  function clearAllCards() {
    classesContainer.innerHTML = '';
    cardCount = 0;
    _checkEmpty();
  }

  // ── Train UI ──────────────────────────────────────────────────
  function setTrainEnabled(v) { trainBtn.disabled = !v; }

  function setStatus(type, icon, textKey, rawText) {
    trainStatusBar.className = `train-status train-status-${type}`;
    trainStatusText.textContent = rawText || I18n.t(textKey);
  }

  function showProgress(v) { progressWrap.style.display = v ? 'flex' : 'none'; }

  function updateProgress(epoch, total, loss, acc) {
    const pct = Math.round((epoch / total) * 100);
    progressBar.style.width = pct + '%';
    progressLabel.textContent = pct + '%';
    const epochEl = document.getElementById('train-progress-epoch');
    if (epochEl) epochEl.textContent = `Epoch ${epoch}/${total} — loss: ${loss.toFixed(3)}`;
    TrainingChart.push(loss, acc);
  }

  function showChart(v) {
    chartWrap.style.display = v ? 'block' : 'none';
    if (v) { TrainingChart.init(trainChart); }
  }

  function showStats(epochs, samples, acc, loss) {
    trainStats.style.display = 'grid';
    document.getElementById('stat-epochs').textContent  = epochs;
    document.getElementById('stat-samples').textContent = samples;
    document.getElementById('stat-acc').textContent     = (acc * 100).toFixed(1) + '%';
    document.getElementById('stat-loss').textContent    = loss.toFixed(4);
  }

  function showModelActions(v) { modelActions.style.display = v ? 'flex' : 'none'; }

  // ── Predict UI ────────────────────────────────────────────────
  function showPredictSection() {
    predictSection.style.display = 'block';
    setTimeout(() => predictSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  function showPredictResults(imgSrc, predictions) {
    predictPreview.src = imgSrc;
    predictResults.style.display = 'grid';

    resultsContainer.innerHTML = '';
    predictions.forEach((p, i) => {
      const pct = (p.probability * 100).toFixed(1);
      const div = document.createElement('div');
      div.className = 'result-bar-item';
      div.innerHTML = `
        <div class="result-bar-header">
          <div class="result-bar-label">
            <span style="width:10px;height:10px;border-radius:50%;background:${classColor(i)};display:inline-block;flex-shrink:0"></span>
            <span>${p.className}</span>
          </div>
          <span class="result-bar-pct">${pct}%</span>
        </div>
        <div class="result-bar-track">
          <div class="result-bar-fill ${i===0?'top':''}" style="width:0%"></div>
        </div>`;
      resultsContainer.appendChild(div);
      requestAnimationFrame(() => div.querySelector('.result-bar-fill').style.width = pct + '%');
    });
  }

  // ── Demo test buttons ─────────────────────────────────────────
  function showDemoTestBtns(tests, onTest) {
    const wrap = document.getElementById('demo-test-btns');
    wrap.innerHTML = '';
    tests.forEach(({ name, emoji, img }) => {
      const btn = document.createElement('button');
      btn.className = 'demo-test-btn';
      btn.innerHTML = `<span>${emoji}</span><span>Test ${name}</span>`;
      btn.addEventListener('click', () => onTest(img));
      wrap.appendChild(btn);
    });
    wrap.style.display = 'flex';
  }

  return {
    addClassCard, clearAllCards, setTrainEnabled,
    setStatus, showProgress, updateProgress, showChart, showStats, showModelActions,
    showPredictSection, showPredictResults, showDemoTestBtns,
  };
})();
