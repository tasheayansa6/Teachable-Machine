/**
 * app.js — Application orchestrator
 */
(async () => {

  // ── 1. Language & Theme ───────────────────────────────────────
  const savedLang  = localStorage.getItem('tm-lang')  || 'en';
  const savedTheme = localStorage.getItem('tm-theme') || 'light';
  I18n.setLang(savedLang);
  document.documentElement.setAttribute('data-theme', savedTheme);
  _syncThemeIcon(savedTheme);
  document.getElementById('lang-label').textContent = savedLang === 'en' ? 'ML' : 'EN';

  document.getElementById('lang-toggle').addEventListener('click', () => {
    const next = I18n.getLang() === 'en' ? 'ml' : 'en';
    I18n.setLang(next);
    localStorage.setItem('tm-lang', next);
    document.getElementById('lang-label').textContent = next === 'en' ? 'ML' : 'EN';
    _refreshDynamicText();
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tm-theme', next);
    _syncThemeIcon(next);
    TrainingChart.draw();
  });

  // ── 2. Load MobileNet ─────────────────────────────────────────
  document.getElementById('loading-overlay').style.display = 'flex';
  await ModelManager.loadBackbone();
  document.getElementById('loading-overlay').style.display = 'none';
  UI.setStatus('idle', '⏳', 'statusIdle');

  // ── 3. Default 2 classes ──────────────────────────────────────
  _addNewClass();
  _addNewClass();

  // ── 4. Wire buttons ───────────────────────────────────────────
  document.getElementById('add-class-btn').addEventListener('click', _addNewClass);
  document.getElementById('train-btn').addEventListener('click', _trainModel);
  document.getElementById('reset-btn').addEventListener('click', _reset);
  document.getElementById('demo-btn').addEventListener('click', _loadDemo);
  document.getElementById('demo-btn-hero').addEventListener('click', _loadDemo);
  document.getElementById('export-btn').addEventListener('click', _exportModel);
  document.getElementById('import-input').addEventListener('change', _importModel);

  // Predict tabs
  document.getElementById('tab-upload').addEventListener('click', () => _switchTab('upload'));
  document.getElementById('tab-webcam').addEventListener('click', () => _switchTab('webcam'));

  // Predict file drop zone
  const dropZone = document.getElementById('predict-drop-zone');
  const fileInput = document.getElementById('predict-file-input');

  fileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (file) { await _runPrediction(await fileToImage(file)); fileInput.value = ''; }
  });
  dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', async e => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) await _runPrediction(await fileToImage(file));
  });
  dropZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

  // Webcam
  Webcam.bindButtons(async (img, src) => {
    if (!ModelManager.isTrained()) { showToast(I18n.t('toastTrainFirst'), 'error'); return; }
    UI.showPredictResults(src || img.src, ModelManager.predict(img));
  });

  // ── HELPERS ───────────────────────────────────────────────────

  function _addNewClass() {
    const idx = DataStore.addClass('');
    UI.addClassCard({
      onImages:     (i, imgs) => { DataStore.addImages(i, imgs);  _refreshTrainBtn(); },
      onRemove:     (i)       => { DataStore.removeClass(i);      _refreshTrainBtn(); },
      onClear:      (i)       => { DataStore.clearImages(i);      _refreshTrainBtn(); },
      onNameChange: (i, name) =>   DataStore.setClassName(i, name),
    });
    _refreshTrainBtn();
  }

  function _refreshTrainBtn() {
    UI.setTrainEnabled(DataStore.isReady(1));
    if (!DataStore.isReady(1)) UI.setStatus('idle', '⏳', 'statusIdle');
  }

  async function _loadDemo() {
    const btn = document.getElementById('demo-btn');
    btn.disabled = true;
    btn.textContent = '⏳ …';

    DataStore.clear();
    UI.clearAllCards();
    UI.setStatus('running', '⚙️', 'generatingDemo');

    const data = await Demo.loadAll((done, total) => {
      UI.setStatus('running', '⚙️', null, `${I18n.t('generatingDemo')} ${done}/${total}`);
    });

    for (const cls of data) {
      const i = DataStore.addClass(cls.name);
      DataStore.addImages(i, cls.images);
      UI.addClassCard({
        onImages:     (ci, imgs) => { DataStore.addImages(ci, imgs);  _refreshTrainBtn(); },
        onRemove:     (ci)       => { DataStore.removeClass(ci);      _refreshTrainBtn(); },
        onClear:      (ci)       => { DataStore.clearImages(ci);      _refreshTrainBtn(); },
        onNameChange: (ci, name) =>   DataStore.setClassName(ci, name),
      }, { name: cls.name, images: cls.images });
    }

    UI.setStatus('idle', '✅', null, I18n.t('toastDemoLoaded'));
    btn.disabled = false;
    btn.textContent = I18n.t('loadDemo');
    _refreshTrainBtn();
    showToast(I18n.t('toastDemoLoaded'), 'success');
  }

  async function _trainModel() {
    if (!DataStore.isReady(1)) { showToast(I18n.t('toastNeedClasses'), 'error'); return; }

    document.getElementById('train-btn').disabled = true;
    UI.setStatus('running', '⚙️', 'statusTraining');
    UI.showProgress(true);
    UI.showChart(true);
    TrainingChart.reset();

    let lastLoss = 0, lastAcc = 0;

    try {
      const result = await ModelManager.train(DataStore.getClasses(), (epoch, total, loss, acc, valAcc) => {
        UI.updateProgress(epoch, total, loss, acc, valAcc);
        lastLoss = loss; lastAcc = valAcc ?? acc;
      });

      UI.showProgress(false);
      const stoppedEarly = result && result.stopped;
      UI.setStatus('success', '✅', stoppedEarly ? null : 'statusDone',
        stoppedEarly ? `✅ ${I18n.t('statusDone')} (early stop)` : null);
      UI.showStats(40, DataStore.getTotalImages(), lastAcc, lastLoss);
      UI.showModelActions(true);
      UI.showPredictSection();

      // Demo test buttons
      const tests = await Demo.loadTestImages();
      UI.showDemoTestBtns(tests, img => _runPrediction(img));

      showToast(I18n.t('toastTrained'), 'success');
    } catch (err) {
      console.error(err);
      UI.setStatus('error', '❌', 'statusError');
      showToast(I18n.t('toastTrainFail'), 'error');
    } finally {
      document.getElementById('train-btn').disabled = false;
    }
  }

  async function _runPrediction(imgEl) {
    if (!ModelManager.isTrained()) { showToast(I18n.t('toastTrainFirst'), 'error'); return; }
    try {
      const preds = ModelManager.predict(imgEl);
      UI.showPredictResults(imgEl.src, preds);
    } catch (e) {
      console.error(e);
      showToast(I18n.t('toastTrainFail'), 'error');
    }
  }

  async function _exportModel() {
    try { await ModelManager.exportModel(); showToast(I18n.t('toastExported'), 'success'); }
    catch (e) { console.error(e); showToast(I18n.t('toastTrainFail'), 'error'); }
  }

  async function _importModel(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await ModelManager.importModel(file);
      UI.showModelActions(true);
      UI.showPredictSection();
      UI.setStatus('success', '✅', null, I18n.t('toastImported'));
      showToast(I18n.t('toastImported'), 'success');
    } catch (err) {
      console.error(err);
      showToast(I18n.t('toastImportFail'), 'error');
    }
    e.target.value = '';
  }

  function _reset() {
    DataStore.clear();
    UI.clearAllCards();
    UI.setStatus('idle', '⏳', 'statusIdle');
    UI.showProgress(false);
    UI.showChart(false);
    document.getElementById('train-stats').style.display = 'none';
    UI.showModelActions(false);
    document.getElementById('section-predict').style.display = 'none';
    _addNewClass();
    _addNewClass();
    showToast('Reset complete.', 'default');
  }

  function _switchTab(tab) {
    document.getElementById('tab-upload').classList.toggle('active', tab === 'upload');
    document.getElementById('tab-webcam').classList.toggle('active', tab === 'webcam');
    document.getElementById('panel-upload').style.display = tab === 'upload' ? 'block' : 'none';
    document.getElementById('panel-webcam').style.display = tab === 'webcam' ? 'block' : 'none';
    if (tab !== 'webcam') Webcam.stop();
  }

  function _syncThemeIcon(theme) {
    document.getElementById('icon-sun').style.display  = theme === 'dark'  ? '' : 'none';
    document.getElementById('icon-moon').style.display = theme === 'light' ? '' : 'none';
  }

  function _refreshDynamicText() {
    // Re-apply i18n to any dynamically set text
    document.getElementById('train-status-text').textContent = I18n.t('statusIdle');
  }

})();
