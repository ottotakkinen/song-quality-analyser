const margin = 10;
const chunkFactor = 600;

const dropArea = document.getElementById('drop-area');
const canvasLoader = document.getElementById('loading-spinner');
const canvasLoader2 = document.getElementById('loading-spinner2');
const meter = document.getElementById('meter');
const percentage = document.getElementById('percentage');

let loading = false;

const canvas = document.querySelector('canvas');
const canvas2 = document.querySelector('canvas2');
const ctx = canvas.getContext('2d');
const { width, height } = canvas;
const centerHeight = Math.ceil(height / 2);
const scaleFactor = (height - margin * 2) / 2;

const reader = new FileReader();
const offlineAudioContext = new OfflineAudioContext({
  length: 1,
  sampleRate: 44100,
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  const file = files[0];

  reader.readAsArrayBuffer(file);
}

reader.addEventListener('loadstart', () => {
  // canvasLoader.classList.add('loading');
  // canvasLoader2.classList.add('loading');
  canvas.classList.remove('ready');
  loading = true;
});

reader.addEventListener('load', () => {
  // console.log('loaded');
  const result = reader.result;
  handleAudioData(result);
});

const handleAudioData = async (arrayBuffer) => {
  const audioBuffer = await offlineAudioContext.decodeAudioData(arrayBuffer);
  const float32Array = audioBuffer.getChannelData(0);
  drawToCanvas(float32Array);
  analyseAudio(audioBuffer);
};

const analyseAudio = (audioBuffer) => {
  const signal = new Float32Array(512);

  let maximums = new Array(signal.length).fill(0);

  for (let i = 0; i < audioBuffer.sampleRate * 5; i += 512) {
    audioBuffer.copyFromChannel(signal, 0, i);

    const floatArray = Meyda.extract('amplitudeSpectrum', signal);

    for (let i = 0; i < floatArray.length; i++) {
      if (floatArray[i] > maximums[i]) {
        maximums[i] = floatArray[i];
      }
    }
  }

  const bandWidth = 43.06640625 * 2;

  const filteredMaximums = maximums
    .reverse()
    .map((amp) => (amp < 0.02 ? 0 : amp))
    .reverse();

  const highestFreq = filteredMaximums.indexOf(0) * bandWidth;

  meter.value = highestFreq / 22050;
  percentage.innerText = `${Math.round((highestFreq / 1000) * 100) / 100}kHz, ${
    (Math.round((highestFreq / 22050) * 100) / 100) * 100
  }%`;

  // console.log(highestFreq);
};

async function drawToCanvas(float32Array) {
  const chunkSize = float32Array.length / chunkFactor;
  const array = [];

  let i = 0;
  const length = float32Array.length;
  while (i < length) {
    array.push(
      float32Array.slice(i, (i += chunkSize)).reduce(function (total, value) {
        return Math.max(total, Math.abs(value));
      })
    );
  }

  canvas.width = Math.ceil(float32Array.length / chunkSize + margin * 2);

  for (let index in array) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(
      margin + Number(index),
      centerHeight - array[index] * scaleFactor
    );
    ctx.lineTo(
      margin + Number(index),
      centerHeight + array[index] * scaleFactor
    );
    ctx.stroke();
  }
  // canvasLoader.classList.remove('loading');
  // canvasLoader2.classList.remove('loading');
  canvas.classList.add('ready');
  loading = false;
}
