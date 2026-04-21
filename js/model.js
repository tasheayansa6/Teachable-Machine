/**
 * model.js — MobileNet feature extraction + KNN classifier
 *
 * Strategy: use MobileNet as a frozen feature extractor, then train a
 * simple dense head (softmax) on top of the extracted embeddings.
 * This keeps training fast and entirely in-browser.
 */

const ModelManager = (() => {
  let mobileNet = null;   // MobileNet feature extractor
  let classifier = null;  // Trained tf.LayersModel head
  let classNames  = [];

  /** Load MobileNet (called once on startup). */
  async function loadBackbone() {
    mobileNet = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log('MobileNet loaded');
  }

  /**
   * Extract a 1D embedding from an image element.
   * @param {HTMLImageElement} imgEl
   * @returns {tf.Tensor1D}
   */
  function extractFeatures(imgEl) {
    return tf.tidy(() => {
      const canvas = imageToCanvas(imgEl, 224);
      const tensor = tf.browser.fromPixels(canvas)
        .toFloat()
        .div(127.5)
        .sub(1)
        .expandDims(0); // [1, 224, 224, 3]
      // infer returns the activation from the penultimate layer
      const activation = mobileNet.infer(tensor, true); // [1, 1280]
      return activation.squeeze(); // [1280]
    });
  }

  /**
   * Build and train a dense classifier head on top of MobileNet embeddings.
   * @param {Array<{name:string, images:HTMLImageElement[]}>} classes
   * @param {function} onProgress - called with (epoch, totalEpochs, loss)
   */
  async function train(classes, onProgress) {
    classNames = classes.map(c => c.name || `Class ${c.index + 1}`);
    const numClasses = classes.length;

    // --- Build feature matrix ---
    const allFeatures = [];
    const allLabels   = [];

    for (let ci = 0; ci < classes.length; ci++) {
      for (const img of classes[ci].images) {
        const feat = extractFeatures(img);
        allFeatures.push(feat);
        allLabels.push(ci);
      }
    }

    const featureDim = allFeatures[0].shape[0];
    const xs = tf.stack(allFeatures);                          // [N, featureDim]
    const ys = tf.oneHot(tf.tensor1d(allLabels, 'int32'), numClasses); // [N, C]

    // Dispose individual feature tensors
    allFeatures.forEach(f => f.dispose());

    // --- Build head model ---
    classifier = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [featureDim], units: 128, activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 1e-4 }) }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: numClasses, activation: 'softmax' }),
      ]
    });

    classifier.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    const EPOCHS = 30;

    await classifier.fit(xs, ys, {
      epochs: EPOCHS,
      batchSize: 16,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          onProgress(epoch + 1, EPOCHS, logs.loss, logs.acc);
        }
      }
    });

    xs.dispose();
    ys.dispose();
  }

  /**
   * Predict class probabilities for an image.
   * @param {HTMLImageElement} imgEl
   * @returns {{ className: string, probability: number }[]}
   */
  function predict(imgEl) {
    if (!classifier) throw new Error('Model not trained yet.');
    return tf.tidy(() => {
      const feat  = extractFeatures(imgEl).expandDims(0); // [1, featureDim]
      const probs = classifier.predict(feat).squeeze();   // [numClasses]
      const arr   = Array.from(probs.dataSync());
      return arr.map((p, i) => ({ className: classNames[i] || `Class ${i+1}`, probability: p }))
                .sort((a, b) => b.probability - a.probability);
    });
  }

  function isReady() {
    return mobileNet !== null;
  }

  function isTrained() {
    return classifier !== null;
  }

  return { loadBackbone, train, predict, isReady, isTrained };
})();
