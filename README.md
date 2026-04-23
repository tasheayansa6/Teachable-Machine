# 🧠 Teachable Machine Clone

> Final Year Project — Browser-based image classifier powered by TensorFlow.js

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1?style=flat-square)](https://tasheayansa6.github.io/Teachable-Machine)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.x-FF6F00?style=flat-square&logo=tensorflow)](https://www.tensorflow.org/js)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What It Does

Train a real image classifier entirely in your browser — no server, no code, no data leaves your device.

| Step | Action |
|------|--------|
| 1 | Create image classes (e.g. "Cat", "Dog") |
| 2 | Upload or drag-and-drop images for each class |
| 3 | Click **Train Model** — takes seconds |
| 4 | Upload or webcam-snap a new image to classify it |

---

## Features

- **Transfer Learning** — MobileNet V2 (frozen) + trainable dense head
- **Live Training Chart** — loss & accuracy curves update in real time
- **Webcam Support** — snap a photo or run live continuous prediction
- **Dark Mode** — persisted via localStorage
- **i18n** — English 🇬🇧 and Malayalam 🇮🇳 (toggle in navbar)
- **Export / Import Model** — save your trained model as JSON, reload anytime
- **Demo Mode** — procedurally generated images, no uploads needed
- **Fully Responsive** — works on mobile and desktop

---

## Tech Stack

| Library | Role |
|---------|------|
| TensorFlow.js 4.x | Tensor ops, model training, WebGL acceleration |
| MobileNet V2 | Pre-trained feature extractor (1280-dim embeddings) |
| Vanilla JS (ES6+) | No framework dependencies |
| Canvas API | Demo image generation, webcam capture |

---

## Architecture

```
Image Input
  └─ imageToCanvas(224×224)
       └─ MobileNet V2 .infer()  →  [1280-dim embedding]
            └─ Dense(128, ReLU, L2)
                 └─ Dropout(0.3)
                      └─ Dense(N, Softmax)  →  class probabilities
```

Training uses Adam (lr=0.001), categorical cross-entropy, 40 epochs, batch size 16.

---

## Running Locally

```bash
# Option 1 — just open the file
open teachable-machine-clone/index.html

# Option 2 — local server (avoids CORS on MobileNet CDN weights)
npx serve teachable-machine-clone
# or
python -m http.server 8080 --directory teachable-machine-clone
```

---

## Project Structure

```
teachable-machine-clone/
├── index.html
├── assets/
│   └── styles/style.css
└── js/
    ├── i18n.js      # English + Malayalam translations
    ├── utils.js     # Shared helpers (imageToCanvas, fileToImage, toast…)
    ├── demo.js      # Procedural demo image generator
    ├── data.js      # In-memory image store
    ├── model.js     # MobileNet + classifier head + export/import
    ├── chart.js     # Live training chart (Canvas, no deps)
    ├── webcam.js    # Webcam capture + live prediction loop
    ├── ui.js        # All DOM rendering
    └── app.js       # Orchestrator / event wiring
```

---

## GitHub Pages

Go to **Settings → Pages → Source: main / root** to publish at:
`https://tasheayansa6.github.io/Teachable-Machine`
