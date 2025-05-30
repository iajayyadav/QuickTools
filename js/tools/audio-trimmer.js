import { showToast } from '../main.js';

// Create a link element for CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '../../css/tools/audio-trimmer.css';
link.onload = () => console.log('Audio Trimmer: CSS loaded successfully');
link.onerror = (err) => console.error('Audio Trimmer: Failed to load CSS:', err);
document.head.appendChild(link);

export function init() {
    const contentDiv = document.getElementById('audio-trimmer-content');
    if (!contentDiv) return;

    contentDiv.innerHTML = `
        <div class="audio-trimmer-container">
            <div class="audio-trimmer-drop-zone">
                <div class="icon">🎵</div>
                <div class="text">
                    <span class="primary-text">Choose an audio file</span>
                    <span class="secondary-text">or drag and drop here</span>
                </div>
            </div>
            <input type="file" id="audio-trimmer-file-input" accept="audio/*" style="display:none;" />
            <div class="audio-trimmer-controls">
                <div class="audio-trimmer-player-container">
                    <audio id="audio-trimmer-player" controls></audio>
                    </div>
                <div class="audio-trimmer-time-controls">
                    <label>
                        Start Time
                        <input type="range" id="audio-trimmer-start-time" min="0" value="0" step="0.1">
                        <span id="audio-trimmer-start-display" class="audio-trimmer-time-display">0:00</span>
                    </label>
                    <label>
                        End Time
                        <input type="range" id="audio-trimmer-end-time" min="0" value="0" step="0.1">
                        <span id="audio-trimmer-end-display" class="audio-trimmer-time-display">0:00</span>
                    </label>
                    </div>
                <div class="audio-trimmer-button-group">
                    <button id="audio-trimmer-preview-btn" class="audio-trimmer-button secondary">
                        <span class="icon">👂</span> Preview
                    </button>
                    <button id="audio-trimmer-trim-btn" class="audio-trimmer-button">
                        <span class="icon">✂️</span> Trim & Download
                    </button>
                </div>
            </div>
            <div class="audio-trimmer-loading">
                <div class="audio-trimmer-spinner"></div>
            </div>
        </div>
    `;

    const dropZone = contentDiv.querySelector(".audio-trimmer-drop-zone");
    const fileInput = contentDiv.querySelector("#audio-trimmer-file-input");
    const audio = contentDiv.querySelector("#audio-trimmer-player");
    const startTime = contentDiv.querySelector("#audio-trimmer-start-time");
    const endTime = contentDiv.querySelector("#audio-trimmer-end-time");
    const startDisplay = contentDiv.querySelector("#audio-trimmer-start-display");
    const endDisplay = contentDiv.querySelector("#audio-trimmer-end-display");
    const audioControls = contentDiv.querySelector(".audio-trimmer-controls");
    const previewBtn = contentDiv.querySelector("#audio-trimmer-preview-btn");
    const trimBtn = contentDiv.querySelector("#audio-trimmer-trim-btn");
    const loading = contentDiv.querySelector(".audio-trimmer-loading");

    // Format time in MM:SS format
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Update time displays when sliders change
    startTime.addEventListener("input", () => {
        const time = parseFloat(startTime.value);
        startDisplay.textContent = formatTime(time);
    });

    endTime.addEventListener("input", () => {
        const time = parseFloat(endTime.value);
        endDisplay.textContent = formatTime(time);
    });

    // Drag & Drop logic
    dropZone.addEventListener("click", () => fileInput.click());
    
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });
    
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });
    
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file || !file.type.startsWith("audio/")) {
            showToast("Please upload a valid audio file!", "error");
            return;
        }
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.load();
        audioControls.style.display = "flex";

        audio.addEventListener("loadedmetadata", () => {
            startTime.max = endTime.max = audio.duration;
            endTime.value = audio.duration;
            endDisplay.textContent = formatTime(audio.duration);
        });
    }

    // Preview trimmed audio
    previewBtn.addEventListener("click", () => {
        const start = parseFloat(startTime.value);
        const end = parseFloat(endTime.value);

        if (start >= end) {
            showToast("Start time must be less than end time.", "error");
                    return;
                }

        audio.currentTime = start;
        audio.play();
        
        const stopPreview = () => {
            if (audio.currentTime >= end) {
                audio.pause();
                audio.removeEventListener("timeupdate", stopPreview);
            }
        };
        
        audio.addEventListener("timeupdate", stopPreview);
    });

    trimBtn.addEventListener("click", async () => {
        const start = parseFloat(startTime.value);
        const end = parseFloat(endTime.value);

        if (start >= end) {
            showToast("Start time must be less than end time.", "error");
            return;
        }

        loading.classList.add("show");
        try {
            await trimAudio(audio.src, start, end);
            showToast("Audio trimmed successfully!", "success");
        } catch (err) {
            showToast("Failed to trim audio.", "error");
            console.error(err);
        } finally {
            loading.classList.remove("show");
        }
    });

    function trimAudio(url, start, end) {
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                return ctx.decodeAudioData(arrayBuffer);
            })
            .then(audioBuffer => {
                const sampleRate = audioBuffer.sampleRate;
                const startSample = Math.floor(start * sampleRate);
                const endSample = Math.floor(end * sampleRate);
                const trimmedBuffer = audioBuffer.getChannelData(0).slice(startSample, endSample);

                const newBuffer = new AudioBuffer({
                    length: trimmedBuffer.length,
                    numberOfChannels: 1,
                    sampleRate: sampleRate
                });
                newBuffer.copyToChannel(trimmedBuffer, 0);

                exportWav(newBuffer, sampleRate);
            })
            .catch(err => {
                console.error("Error:", err);
                showToast("Trimming failed!", "error");
            });
    }

    function exportWav(audioBuffer, sampleRate) {
        const numSamples = audioBuffer.length;
        const buffer = new ArrayBuffer(44 + numSamples * 2);
        const view = new DataView(buffer);

        function writeString(view, offset, string) {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + numSamples * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, numSamples * 2, true);

        const samples = audioBuffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < samples.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }

        const blob = new Blob([view], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trimmed_audio.wav';
        a.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
} 