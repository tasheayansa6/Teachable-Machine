/**
 * webcam.js — Webcam capture + live prediction loop
 */
const Webcam = (() => {
  let stream      = null;
  let liveLoop    = null;
  let onPredict   = null;
  const video     = document.getElementById('webcam-video');
  const snapBtn   = document.getElementById('webcam-snap-btn');
  const liveBtn   = document.getElementById('webcam-live-btn');
  const stopBtn   = document.getElementById('webcam-stop-btn');
  const startBtn  = document.getElementById('webcam-start-btn');

  async function start(predictCallback) {
    onPredict = predictCallback;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      video.srcObject = stream;
      await video.play();
      startBtn.style.display = 'none';
      snapBtn.style.display  = '';
      liveBtn.style.display  = '';
      stopBtn.style.display  = '';
    } catch (e) {
      showToast(I18n.t('toastCamFail'), 'error');
      console.error(e);
    }
  }

  function snap() {
    if (!stream) return;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const img = new Image();
    img.onload = () => onPredict && onPredict(img, canvas.toDataURL());
    img.src = canvas.toDataURL();
  }

  function startLive() {
    if (liveLoop) return;
    liveBtn.textContent = I18n.t('stopLive') || 'Stop Live';
    liveLoop = setInterval(() => snap(), 600);
  }

  function stopLive() {
    clearInterval(liveLoop);
    liveLoop = null;
    liveBtn.textContent = I18n.t('livePrediction');
  }

  function stop() {
    stopLive();
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    video.srcObject = null;
    startBtn.style.display = '';
    snapBtn.style.display  = 'none';
    liveBtn.style.display  = 'none';
    stopBtn.style.display  = 'none';
  }

  function bindButtons(predictCallback) {
    onPredict = predictCallback;
    startBtn.addEventListener('click', () => start(predictCallback));
    snapBtn.addEventListener('click',  snap);
    liveBtn.addEventListener('click',  () => liveLoop ? stopLive() : startLive());
    stopBtn.addEventListener('click',  stop);
  }

  return { bindButtons, stop };
})();
