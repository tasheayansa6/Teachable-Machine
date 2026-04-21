/**
 * app.js — Main application logic
 */

(async () => {
  // --- Init ---
  UI.setTrainStatus('Loading MobileNet backbone...');
  await ModelManager.loadBackbone();
  UI.setTrainStatus('Ready. Add at least 2 classes with images, then train.');

  // Start with 2 default empty classes
  addNewClass();
  addNewClass();

  // --- Buttons ---
  document.getElementById('add-class-btn').addEventListener('click', addNewClass);
  document.getElementById('train-btn').addEventListener('click', trainModel);
  document.getElementById('demo-btn').addEventListener('click', loadDemo);

  // --- Predict input ---
  UI.bindPredictInput(runPrediction);

  // ── Helpers ────────────────────────────────────────────────────

  function addNewClass() {
    const classIndex = DataStore.addClass('');
    UI.addClassCard(
      (cardIdx, images) => { DataStore.addImages(cardIdx, images); refreshTrainBtn(); },
      (cardIdx)         => { DataStore.removeClass(cardIdx);       refreshTrainBtn(); },
      (cardIdx, name)   =>   DataStore.setClassName(cardIdx, name)
    );
    refreshTrainBtn();
  }

  function refreshTrainBtn() {
    UI.setTrainBtnEnabled(DataStore.isReady(1));
  }

  // ── Demo loader ────────────────────────────────────────────────

  async function loadDemo() {
    const btn = document.getElementById('demo-btn');
    btn.disabled = true;
    btn.textContent = 'Loading demo…';

    // Clear existing state
    DataStore.clear();
    document.getElementById('classes-container').innerHTML = '';

    UI.setTrainStatus('Generating demo images…');

    const demoData = await Demo.loadAll((done, total) => {
      UI.setTrainStatus(`Generating demo images… ${done}/${total}`);
    });

    // Populate DataStore + UI cards
    for (const cls of demoData) {
      const idx = DataStore.addClass(cls.name);
      DataStore.addImages(idx, cls.images);
      UI.addClassCard(
        (cardIdx, images) => { DataStore.addImages(cardIdx, images); refreshTrainBtn(); },
        (cardIdx)         => { DataStore.removeClass(cardIdx);       refreshTrainBtn(); },
        (cardIdx, name)   =>   DataStore.setClassName(cardIdx, name),
        { name: cls.name, images: cls.images }   // pre-fill
      );
    }

    UI.setTrainStatus('Demo loaded! Click "Train Model" to train.');
    btn.disabled = false;
    btn.textContent = '⚡ Load Demo';
    refreshTrainBtn();
    showToast('Demo images loaded — hit Train Model!');
  }

  // ── Training ───────────────────────────────────────────────────

  async function trainModel() {
    if (!DataStore.isReady(1)) {
      showToast('Add at least 1 image to each of 2+ classes first.');
      return;
    }

    document.getElementById('train-btn').disabled = true;
    UI.setTrainStatus('Training…');
    UI.showProgress(true);

    try {
      await ModelManager.train(DataStore.getClasses(), (epoch, total, loss, acc) => {
        UI.updateProgress(epoch, total, loss, acc);
      });

      UI.showProgress(false);
      UI.setTrainStatus('✅ Training complete!');
      showToast('Model trained! Upload an image below to classify it.');
      UI.showPredictSection();

      // Show demo predict buttons if demo was loaded
      await showDemoPredictButtons();

    } catch (err) {
      console.error(err);
      UI.setTrainStatus('❌ Training failed. Check the console.');
      showToast('Training failed. See console for details.');
    } finally {
      document.getElementById('train-btn').disabled = false;
    }
  }

  async function showDemoPredictButtons() {
    const container = document.getElementById('demo-predict-btns');
    container.innerHTML = '';
    const tests = await Demo.loadTestImages();
    tests.forEach(({ name, emoji, img }) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-demo-predict';
      btn.textContent = `${emoji} Test ${name}`;
      btn.addEventListener('click', () => {
        document.getElementById('predict-preview').src = img.src;
        document.getElementById('predict-preview-container').style.display = 'flex';
        runPrediction(img);
      });
      container.appendChild(btn);
    });
    container.style.display = 'flex';
  }

  // ── Prediction ─────────────────────────────────────────────────

  function runPrediction(imgEl) {
    if (!ModelManager.isTrained()) {
      showToast('Please train the model first.');
      return;
    }
    try {
      UI.showResults(ModelManager.predict(imgEl));
    } catch (err) {
      console.error(err);
      showToast('Prediction failed. See console for details.');
    }
  }
})();
