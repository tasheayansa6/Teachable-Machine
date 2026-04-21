# Teachable Machine Clone

A browser-based image classifier inspired by Google's Teachable Machine. No server required — everything runs client-side using TensorFlow.js and MobileNet.

## How it works

1. **Add classes** — click "Add Class" to create image categories (e.g. "Cat", "Dog").
2. **Upload images** — drag & drop or click to upload multiple images per class (aim for 10+ per class for better accuracy).
3. **Train** — click "Train Model". MobileNet extracts features from your images; a small dense network is trained on top in your browser.
4. **Predict** — once training is done, upload any image to see the model's classification with confidence scores.

## Tech stack

| Library | Purpose |
|---|---|
| TensorFlow.js 4.x | Tensor ops, model training |
| MobileNet v2 | Pre-trained feature extractor (loaded via CDN) |

## Running locally

Just open `index.html` in a browser. No build step needed.

> **Tip:** Use a local server (e.g. `npx serve .`) if you run into CORS issues loading the MobileNet weights.

```bash
npx serve .
```

## File structure

```
teachable-machine-clone/
├── index.html
├── assets/styles/style.css
└── js/
    ├── app.js      # orchestration
    ├── data.js     # image store
    ├── model.js    # MobileNet + classifier head
    ├── ui.js       # DOM / rendering
    └── utils.js    # helpers
```
