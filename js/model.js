/**
 * model.js — MobileNet V2 feature extractor + trainable dense head
 *
 * Architecture:
 *   MobileNet V2 (frozen) → [1280-dim embedding]
 *   → Dense(128, relu, L2) → Dropout(0.3) → Dense(N, softmax)
 */
const ModelManager = (() => {
  let backbone   = null;
  let classifier = null;
  let classNames = [];
  let _trained   = false;

  async function loadBackbone() {
    backbone = await mobilenet.load({ version: 2, alpha: 1.0 });
  }

  /** Extract 1280-dim feature vector from an image element */
  function extractFeatures(imgEl) {
    return tf.tidy(() => {
      const canvas  = imageToCanvas(imgEl, 224);
      const tensor  = tf.browser.fromPixels(canvas).toFloat().div(127.5).sub(1).expandDims(0);
      return backbone.infer(tensor, true).squeeze();
    });
  }

  /**
   * Train classifier head.
   * @param {Array<{name,images[]}>} classes
   * @param {Function} onProgress (epoch, total, loss, acc)
   */
  async function train(classes, onProgress) {
    classNames = classes.map((c, i) => c.name || `Class ${i + 1}`);
    const N = classes.length;

    // Extract all features
    const feats  = [];
    const labels = [];
    for (let ci = 0; ci < classes.length; ci++) {
      for (const img of classes[ci].images) {
        feats.push(extractFeatures(img));
        labels.push(ci);
      }
    }

    const dim = feats[0].shape[0];
    const xs  = tf.stack(feats);
    const ys  = tf.oneHot(tf.tensor1d(labels, 'int32'), N);
    feats.forEach(f => f.dispose());

    // Build head
    if (classifier) { classifier.dispose(); classifier = null; }
    classifier = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [dim], units: 128, activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 1e-4 })
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: N, activation: 'softmax' })
      ]
    });
    classifier.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    const EPOCHS = 40;
    await classifier.fit(xs, ys, {
      epochs: EPOCHS,
      batchSize: 16,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => onProgress(epoch + 1, EPOCHS, logs.loss, logs.acc)
      }
    });

    xs.dispose();
    ys.dispose();
    _trained = true;
  }

  /** Predict → sorted [{ className, probability }] */
  function predict(imgEl) {
    if (!classifier) throw new Error('Not trained');
    return tf.tidy(() => {
      const feat  = extractFeatures(imgEl).expandDims(0);
      const probs = classifier.predict(feat).squeeze();
      return Array.from(probs.dataSync())
        .map((p, i) => ({ className: classNames[i] || `Class ${i}`, probability: p }))
        .sort((a, b) => b.probability - a.probability);
    });
  }

  /** Export model weights as downloadable JSON */
  async function exportModel() {
    if (!classifier) throw new Error('No trained model');
    const weights = [];
    for (const w of classifier.getWeights()) {
      weights.push({ name: w.name, shape: w.shape, data: Array.from(w.dataSync()) });
    }
    const payload = JSON.stringify({ classNames, weights, version: 1 });
    const blob    = new Blob([payload], { type: 'application/json' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href = url; a.download = 'teachable-model.json'; a.click();
    URL.revokeObjectURL(url);
  }

  /** Import model from JSON file */
  async function importModel(file) {
    const text    = await file.text();
    const payload = JSON.parse(text);
    if (!payload.classNames || !payload.weights) throw new Error('Invalid model file');

    classNames = payload.classNames;
    const N    = classNames.length;
    const dim  = payload.weights[0].shape[0];

    if (classifier) { classifier.dispose(); classifier = null; }
    classifier = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [dim], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: N, activation: 'softmax' })
      ]
    });
    classifier.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });

    // Warm up to build weights
    const dummy = tf.zeros([1, dim]);
    classifier.predict(dummy).dispose();
    dummy.dispose();

    // Set weights
    const tensors = payload.weights.map(w => tf.tensor(w.data, w.shape));
    classifier.setWeights(tensors);
    tensors.forEach(t => t.dispose());
    _trained = true;
  }

  function isReady()   { return backbone !== null; }
  function isTrained() { return _trained; }
  function getClassNames() { return classNames; }

  return { loadBackbone, train, predict, exportModel, importModel, isReady, isTrained, getClassNames };
})();
