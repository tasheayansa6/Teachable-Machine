/**
 * i18n.js — English (en) + Malayalam (ml) translations
 */
const I18n = (() => {
  const translations = {
    en: {
      brand:         'Teachable Machine',
      loadDemo:      '⚡ Load Demo',
      heroBadge:     '100% In-Browser · No Server · No Code',
      heroTitle:     'Train Your Own AI Model',
      heroSub:       'Upload images, train a real neural network, and classify new images — all inside your browser using TensorFlow.js.',
      step1:         'Add Classes',
      step2:         'Upload Images',
      step3:         'Train Model',
      step4:         'Predict',
      loadingModel:  'Loading MobileNet backbone…',
      loadingSub:    'This may take a few seconds on first load.',
      classesTitle:  'Image Classes',
      classesDesc:   'Create at least 2 classes and upload images for each. More images = better accuracy.',
      addClass:      'Add Class',
      emptyClasses:  'No classes yet. Click "Add Class" or load the demo.',
      uploadHint:    'Drop images or click',
      clearImages:   'Clear',
      trainTitle:    'Train Model',
      trainDesc:     'MobileNet extracts features; a dense classifier head is trained on top.',
      trainBtn:      'Train Model',
      resetBtn:      'Reset',
      statusIdle:    'Add images to all classes to begin.',
      loss:          'Loss',
      accuracy:      'Accuracy',
      statEpochs:    'Epochs',
      statSamples:   'Samples',
      statAcc:       'Final Acc.',
      statLoss:      'Final Loss',
      exportModel:   'Export Model',
      importModel:   'Import Model',
      predictTitle:  'Make a Prediction',
      predictDesc:   'Upload an image or use your webcam to classify it with the trained model.',
      tabUpload:     'Upload',
      tabWebcam:     'Webcam',
      dropZoneText:  'Drag & drop an image here',
      or:            'or',
      chooseFile:    'Choose File',
      startCam:      'Start Camera',
      snapPredict:   'Snap & Predict',
      livePrediction:'Live Prediction',
      stopCam:       'Stop Camera',
      aboutTitle:    'How It Works',
      about1Title:   'Feature Extraction',
      about1Desc:    'MobileNet V2 (pre-trained on ImageNet) converts every image into a 1280-dimensional feature vector — capturing shapes, textures, and patterns.',
      about2Title:   'Transfer Learning',
      about2Desc:    'A small dense classifier head is trained on top of those features using your images. Training takes seconds, not hours.',
      about3Title:   '100% In-Browser',
      about3Desc:    'TensorFlow.js runs the entire pipeline — feature extraction, training, and inference — directly in your browser. Your images never leave your device.',
      about4Title:   'Export & Reuse',
      about4Desc:    'Export your trained model as a JSON file and import it later — no need to retrain. Share it with others or embed it in your own projects.',
      footerText:    'Built with TensorFlow.js · Final Year Project · All processing happens in your browser.',
      toastDemoLoaded:   'Demo images loaded — hit Train Model!',
      toastTrained:      '🎉 Model trained successfully!',
      toastTrainFail:    '❌ Training failed. Check the console.',
      toastNeedClasses:  'Add at least 1 image to each of 2+ classes first.',
      toastExported:     '✅ Model exported!',
      toastImported:     '✅ Model imported!',
      toastImportFail:   '❌ Import failed. Invalid model file.',
      toastCamFail:      '❌ Could not access camera.',
      toastTrainFirst:   'Please train the model first.',
      statusTraining:    'Training in progress…',
      statusDone:        '✅ Training complete!',
      statusError:       '❌ Training failed.',
      generatingDemo:    'Generating demo images…',
    },
    ml: {
      brand:         'ടീച്ചബിൾ മെഷീൻ',
      loadDemo:      '⚡ ഡെമോ ലോഡ് ചെയ്യുക',
      heroBadge:     '100% ബ്രൗസറിൽ · സെർവർ ഇല്ല · കോഡ് ഇല്ല',
      heroTitle:     'നിങ്ങളുടെ സ്വന്തം AI മോഡൽ ട്രെയിൻ ചെയ്യുക',
      heroSub:       'ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്ത്, ഒരു യഥാർത്ഥ ന്യൂറൽ നെറ്റ്‌വർക്ക് ട്രെയിൻ ചെയ്ത്, പുതിയ ചിത്രങ്ങൾ തരംതിരിക്കുക — TensorFlow.js ഉപയോഗിച്ച് ബ്രൗസറിൽ തന്നെ.',
      step1:         'ക്ലാസ്സുകൾ ചേർക്കുക',
      step2:         'ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക',
      step3:         'മോഡൽ ട്രെയിൻ ചെയ്യുക',
      step4:         'പ്രവചിക്കുക',
      loadingModel:  'MobileNet ലോഡ് ചെയ്യുന്നു…',
      loadingSub:    'ആദ്യ ലോഡിൽ കുറച്ച് സമയം എടുക്കാം.',
      classesTitle:  'ചിത്ര ക്ലാസ്സുകൾ',
      classesDesc:   'കുറഞ്ഞത് 2 ക്ലാസ്സുകൾ ഉണ്ടാക്കി ഓരോന്നിനും ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക. കൂടുതൽ ചിത്രങ്ങൾ = കൂടുതൽ കൃത്യത.',
      addClass:      'ക്ലാസ്സ് ചേർക്കുക',
      emptyClasses:  'ഇതുവരെ ക്ലാസ്സുകൾ ഇല്ല. "ക്ലാസ്സ് ചേർക്കുക" ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ ഡെമോ ലോഡ് ചെയ്യുക.',
      uploadHint:    'ചിത്രങ്ങൾ ഡ്രോപ്പ് ചെയ്യുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്യുക',
      clearImages:   'മായ്ക്കുക',
      trainTitle:    'മോഡൽ ട്രെയിൻ ചെയ്യുക',
      trainDesc:     'MobileNet ഫീച്ചറുകൾ എക്‌സ്‌ട്രാക്‌റ്റ് ചെയ്യുന്നു; ഒരു ഡെൻസ് ക്ലാസിഫയർ ഹെഡ് മുകളിൽ ട്രെയിൻ ചെയ്യുന്നു.',
      trainBtn:      'മോഡൽ ട്രെയിൻ ചെയ്യുക',
      resetBtn:      'റീസെറ്റ്',
      statusIdle:    'ആരംഭിക്കാൻ എല്ലാ ക്ലാസ്സുകളിലും ചിത്രങ്ങൾ ചേർക്കുക.',
      loss:          'ലോസ്',
      accuracy:      'കൃത്യത',
      statEpochs:    'എപ്പോക്കുകൾ',
      statSamples:   'സാമ്പിളുകൾ',
      statAcc:       'അന്തിമ കൃത്യത',
      statLoss:      'അന്തിമ ലോസ്',
      exportModel:   'മോഡൽ എക്‌സ്‌പോർട്ട്',
      importModel:   'മോഡൽ ഇംപോർട്ട്',
      predictTitle:  'പ്രവചനം നടത്തുക',
      predictDesc:   'ട്രെയിൻ ചെയ്ത മോഡൽ ഉപയോഗിച്ച് ഒരു ചിത്രം അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ വെബ്‌ക്യാം ഉപയോഗിക്കുക.',
      tabUpload:     'അപ്‌ലോഡ്',
      tabWebcam:     'വെബ്‌ക്യാം',
      dropZoneText:  'ഇവിടെ ഒരു ചിത്രം ഡ്രോപ്പ് ചെയ്യുക',
      or:            'അല്ലെങ്കിൽ',
      chooseFile:    'ഫയൽ തിരഞ്ഞെടുക്കുക',
      startCam:      'ക്യാമറ ആരംഭിക്കുക',
      snapPredict:   'ഫോട്ടോ എടുത്ത് പ്രവചിക്കുക',
      livePrediction:'തത്സമയ പ്രവചനം',
      stopCam:       'ക്യാമറ നിർത്തുക',
      aboutTitle:    'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
      about1Title:   'ഫീച്ചർ എക്‌സ്‌ട്രാക്ഷൻ',
      about1Desc:    'MobileNet V2 (ImageNet-ൽ പ്രീ-ട്രെയിൻ ചെയ്തത്) ഓരോ ചിത്രത്തെയും 1280-ഡൈമൻഷണൽ ഫീച്ചർ വെക്‌ടറാക്കി മാറ്റുന്നു.',
      about2Title:   'ട്രാൻസ്ഫർ ലേണിംഗ്',
      about2Desc:    'ആ ഫീച്ചറുകളുടെ മുകളിൽ ഒരു ചെറിയ ഡെൻസ് ക്ലാസിഫയർ ഹെഡ് ട്രെയിൻ ചെയ്യുന്നു. ട്രെയിനിംഗ് സെക്കൻഡുകൾ മാത്രം.',
      about3Title:   '100% ബ്രൗസറിൽ',
      about3Desc:    'TensorFlow.js ഫീച്ചർ എക്‌സ്‌ട്രാക്ഷൻ, ട്രെയിനിംഗ്, ഇൻഫറൻസ് — എല്ലാം ബ്രൗസറിൽ. നിങ്ങളുടെ ചിത്രങ്ങൾ ഡിവൈസ് വിടുന്നില്ല.',
      about4Title:   'എക്‌സ്‌പോർട്ട് & പുനരുപയോഗം',
      about4Desc:    'ട്രെയിൻ ചെയ്ത മോഡൽ JSON ഫയലായി എക്‌സ്‌പോർട്ട് ചെയ്ത് പിന്നീട് ഇംപോർട്ട് ചെയ്യാം — വീണ്ടും ട്രെയിൻ ചെയ്യേണ്ടതില്ല.',
      footerText:    'TensorFlow.js ഉപയോഗിച്ച് നിർമ്മിച്ചത് · ഫൈനൽ ഇയർ പ്രോജക്ട് · എല്ലാ പ്രോസസ്സിംഗും ബ്രൗസറിൽ.',
      toastDemoLoaded:   'ഡെമോ ചിത്രങ്ങൾ ലോഡ് ആയി — Train Model അമർത്തുക!',
      toastTrained:      '🎉 മോഡൽ വിജയകരമായി ട്രെയിൻ ചെയ്തു!',
      toastTrainFail:    '❌ ട്രെയിനിംഗ് പരാജയപ്പെട്ടു. കൺസോൾ പരിശോധിക്കുക.',
      toastNeedClasses:  'ആദ്യം 2+ ക്ലാസ്സുകളിൽ ഓരോ ചിത്രമെങ്കിലും ചേർക്കുക.',
      toastExported:     '✅ മോഡൽ എക്‌സ്‌പോർട്ട് ചെയ്തു!',
      toastImported:     '✅ മോഡൽ ഇംപോർട്ട് ചെയ്തു!',
      toastImportFail:   '❌ ഇംപോർട്ട് പരാജയപ്പെട്ടു. അസാധുവായ ഫയൽ.',
      toastCamFail:      '❌ ക്യാമറ ആക്‌സസ് ചെയ്യാൻ കഴിഞ്ഞില്ല.',
      toastTrainFirst:   'ആദ്യം മോഡൽ ട്രെയിൻ ചെയ്യുക.',
      statusTraining:    'ട്രെയിനിംഗ് നടക്കുന്നു…',
      statusDone:        '✅ ട്രെയിനിംഗ് പൂർത്തിയായി!',
      statusError:       '❌ ട്രെയിനിംഗ് പരാജയപ്പെട്ടു.',
      generatingDemo:    'ഡെമോ ചിത്രങ്ങൾ ഉണ്ടാക്കുന്നു…',
    }
  };

  let current = 'en';

  function t(key) {
    return (translations[current] && translations[current][key]) ||
           (translations['en'][key]) || key;
  }

  function setLang(lang) {
    current = lang;
    document.documentElement.lang = lang;
    applyAll();
  }

  function getLang() { return current; }

  function applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
  }

  return { t, setLang, getLang, applyAll };
})();
