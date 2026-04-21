/**
 * ui.js — DOM manipulation & UI updates
 */

const UI = (() => {
  const classesContainer  = document.getElementById('classes-container');
  const trainBtn          = document.getElementById('train-btn');
  const trainStatus       = document.getElementById('train-status');
  const progressContainer = document.getElementById('progress-bar-container');
  const progressBar       = document.getElementById('progress-bar');
  const progressLabel     = document.getElementById('progress-label');
  const predictSection    = document.getElementById('predict-section');
  const predictInput      = document.getElementById('predict-input');
  const predictPreviewCon = document.getElementById('predict-preview-container');
  const predictPreview    = document.getElementById('predict-preview');
  const resultsContainer  = document.getElementById('results-container');
  const template          = document.getElementById('class-card-template');

  let cardCount = 0;

  /**
   * Render a new class card.
   * @param {Function} onImagesAdded
   * @param {Function} onRemove
   * @param {Function} onNameChange
   * @param {{ name?: string, images?: HTMLImageElement[] }} prefill - optional demo data
   */
  function addClassCard(onImagesAdded, onRemove, onNameChange, prefill = {}) {
    const idx  = cardCount++;
    const frag = template.content.cloneNode(true);
    const card = frag.querySelector('.class-card');
    card.dataset.index = idx;

    const nameInput  = card.querySelector('.class-name-input');
    const fileInput  = card.querySelector('.class-file-input');
    const uploadArea = card.querySelector('.class-upload-area');
    const countEl   = card.querySelector('.image-count');
    const thumbGrid = card.querySelector('.thumbnail-grid');
    const removeBtn = card.querySelector('.remove-class-btn');
    const fileLabel = card.querySelector('.class-upload-area label');

    fileLabel.setAttribute('for', `file-input-${idx}`);
    fileInput.id = `file-input-${idx}`;

    nameInput.placeholder = `Class ${idx + 1}`;

    // Pre-fill name
    if (prefill.name) {
      nameInput.value = prefill.name;
    }

    nameInput.addEventListener('input', () => onNameChange(idx, nameInput.value));

    // File input
    fileInput.addEventListener('change', async (e) => {
      await handleFiles(Array.from(e.target.files), idx, countEl, thumbGrid, onImagesAdded);
      fileInput.value = '';
    });

    // Drag & drop
    uploadArea.addEventListener('dragover',  (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
    uploadArea.addEventListener('dragleave', ()  => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', async (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      await handleFiles(files, idx, countEl, thumbGrid, onImagesAdded);
    });

    removeBtn.addEventListener('click', () => { card.remove(); onRemove(idx); });

    classesContainer.appendChild(frag);

    // Pre-fill images (demo mode)
    if (prefill.images && prefill.images.length) {
      renderThumbnails(prefill.images, countEl, thumbGrid);
    }

    return idx;
  }

  async function handleFiles(files, classIndex, countEl, thumbGrid, onImagesAdded) {
    if (!files.length) return;
    const images = await Promise.all(files.map(fileToImage));
    onImagesAdded(classIndex, images);
    renderThumbnails(images, countEl, thumbGrid);
  }

  function renderThumbnails(images, countEl, thumbGrid) {
    const current = parseInt(countEl.textContent) || 0;
    const total   = current + images.length;
    countEl.textContent = `${total} image${total !== 1 ? 's' : ''}`;
    images.forEach(img => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.alt = 'sample';
      thumbGrid.appendChild(thumb);
    });
  }

  function setTrainBtnEnabled(enabled) { trainBtn.disabled = !enabled; }
  function setTrainStatus(msg)         { trainStatus.textContent = msg; }

  function showProgress(show) {
    progressContainer.style.display = show ? 'block' : 'none';
  }

  function updateProgress(epoch, total, loss, acc) {
    const pct = Math.round((epoch / total) * 100);
    progressBar.style.width = pct + '%';
    progressLabel.textContent =
      `Epoch ${epoch}/${total} — loss: ${loss.toFixed(4)}` +
      (acc !== undefined ? ` — acc: ${(acc * 100).toFixed(1)}%` : '');
  }

  function showPredictSection() {
    predictSection.style.display = 'block';
    predictSection.scrollIntoView({ behavior: 'smooth' });
  }

  function bindPredictInput(onImage) {
    predictInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const img = await fileToImage(file);
      predictPreview.src = img.src;
      predictPreviewCon.style.display = 'flex';
      onImage(img);
      predictInput.value = '';
    });

    const area = document.getElementById('predict-upload-area');
    area.addEventListener('dragover',  (e) => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', ()  => area.classList.remove('drag-over'));
    area.addEventListener('drop', async (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const img = await fileToImage(file);
      predictPreview.src = img.src;
      predictPreviewCon.style.display = 'flex';
      onImage(img);
    });
  }

  function showResults(predictions) {
    resultsContainer.innerHTML = '';
    predictions.forEach((pred, i) => {
      const pct = (pred.probability * 100).toFixed(1);
      const wrapper = document.createElement('div');
      wrapper.className = 'result-bar-wrapper';
      wrapper.innerHTML = `
        <div class="result-label">
          <span>${pred.className}</span>
          <span>${pct}%</span>
        </div>
        <div class="result-bar-bg">
          <div class="result-bar-fill ${i === 0 ? 'top' : ''}" style="width:0%"></div>
        </div>`;
      resultsContainer.appendChild(wrapper);
      requestAnimationFrame(() => {
        wrapper.querySelector('.result-bar-fill').style.width = pct + '%';
      });
    });
  }

  return {
    addClassCard, setTrainBtnEnabled, setTrainStatus,
    showProgress, updateProgress, showPredictSection,
    bindPredictInput, showResults,
  };
})();
