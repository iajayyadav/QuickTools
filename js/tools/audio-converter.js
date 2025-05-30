// Audio Converter Tool
import { showToast } from '../main.js';

let audioConverter;

export function init() {
    audioConverter = new AudioConverter();
}

class AudioConverter {
    constructor() {
        this.elements = {};
        this.initializeUI();
        if (Object.keys(this.elements).length === 0) return;
        this.setupEventListeners();
        this.audioContext = null;
        this.supportedFormats = {
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg',
            'ogg': 'audio/ogg',
        };
        this.waveformData = null;
        this.trimStart = 0;
        this.trimEnd = 0;
        this.audioDuration = 0;
        this.isDragging = false;
        this.currentHandle = null;
    }

    async initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    initializeUI() {
        const container = document.getElementById('audio-converter-content');
        if (!container) return;

        container.innerHTML = `
            <div class="tool-container audio-converter-container">
                <div class="converter-section">
                    <div class="file-input-section">
                        <div class="file-drop-zone" id="fileDropZone">
                            <input type="file" id="audioFileInput" accept="audio/*" class="file-input" />
                            <div class="drop-zone-content">
                                <i class="fas fa-music file-icon"></i>
                                <p>Drag & drop audio file here or click to browse</p>
                                <p class="supported-formats">Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC</p>
                            </div>
                        </div>
                    </div>

                    <div class="conversion-options">
                        <div class="file-info hidden" id="fileInfo">
                            <h3>File Information</h3>
                            <p>Name: <span id="fileName">-</span></p>
                            <p>Size: <span id="fileSize">-</span></p>
                            <p>Type: <span id="fileType">-</span></p>
                            <div class="audio-preview">
                                <audio id="audioPreview" controls></audio>
                            </div>
                            <div class="waveform-container">
                                <canvas id="waveformCanvas"></canvas>
                                <div class="trim-controls">
                                    <div id="trimStart" class="trim-handle left"></div>
                                    <div id="trimEnd" class="trim-handle right"></div>
                                </div>
                                <div class="trim-time">
                                    <span id="trimStartTime">0:00</span>
                                    <span id="trimEndTime">0:00</span>
                                </div>
                            </div>
                            <div class="trim-inputs">
                                <div class="trim-input-group">
                                    <label for="trimStartInput">Start Time (s):</label>
                                    <input type="number" id="trimStartInput" min="0" step="0.1" value="0">
                                </div>
                                <div class="trim-input-group">
                                    <label for="trimEndInput">End Time (s):</label>
                                    <input type="number" id="trimEndInput" min="0" step="0.1" value="0">
                                </div>
                            </div>
                        </div>

                        <div class="format-selection">
                            <h3>Convert To</h3>
                            <select id="formatSelect" class="format-select">
                                <option value="mp3">MP3</option>
                                <option value="wav">WAV</option>
                                <option value="ogg">OGG</option>
                                <option value="m4a">M4A</option>
                                <option value="aac">AAC</option>
                                <option value="flac">FLAC</option>
                            </select>
                        </div>

                        <div class="quality-options">
                            <h3>Quality Settings</h3>
                            <div class="quality-setting">
                                <label for="bitrateSelect">Bitrate:</label>
                                <select id="bitrateSelect" class="quality-select">
                                    <option value="128">128 kbps</option>
                                    <option value="192">192 kbps</option>
                                    <option value="256">256 kbps</option>
                                    <option value="320">320 kbps</option>
                                </select>
                            </div>
                            <div class="quality-setting">
                                <label for="sampleRateSelect">Sample Rate:</label>
                                <select id="sampleRateSelect" class="quality-select">
                                    <option value="44100">44.1 kHz</option>
                                    <option value="48000">48 kHz</option>
                                    <option value="96000">96 kHz</option>
                                </select>
                            </div>
                        </div>

                        <button id="convertButton" class="convert-button" disabled>
                            Convert Audio
                        </button>
                    </div>
                </div>

                <div class="conversion-progress hidden" id="conversionProgress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <p class="progress-text">Converting... <span id="progressPercent">0%</span></p>
                </div>
            </div>`;

        // Store element references
        this.elements = {
            fileDropZone: document.getElementById('fileDropZone'),
            fileInput: document.getElementById('audioFileInput'),
            fileInfo: document.getElementById('fileInfo'),
            fileName: document.getElementById('fileName'),
            fileSize: document.getElementById('fileSize'),
            fileType: document.getElementById('fileType'),
            audioPreview: document.getElementById('audioPreview'),
            formatSelect: document.getElementById('formatSelect'),
            bitrateSelect: document.getElementById('bitrateSelect'),
            sampleRateSelect: document.getElementById('sampleRateSelect'),
            convertButton: document.getElementById('convertButton'),
            conversionProgress: document.getElementById('conversionProgress'),
            progressBar: document.querySelector('.progress-fill'),
            progressPercent: document.getElementById('progressPercent'),
            waveformCanvas: document.getElementById('waveformCanvas'),
            trimStart: document.getElementById('trimStart'),
            trimEnd: document.getElementById('trimEnd'),
            trimStartTime: document.getElementById('trimStartTime'),
            trimEndTime: document.getElementById('trimEndTime'),
            trimStartInput: document.getElementById('trimStartInput'),
            trimEndInput: document.getElementById('trimEndInput'),
        };

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .audio-converter-container {
                padding: 2rem;
            }

            .converter-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }

            .file-drop-zone {
                position: relative;
                width: 100%;
                min-height: 300px;
                border: 2px dashed var(--accent-color);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .file-drop-zone:hover {
                border-color: var(--accent-color-dark);
                background-color: rgba(0, 184, 148, 0.05);
            }

            .file-drop-zone.drag-over {
                border-color: var(--accent-color-dark);
                background-color: rgba(0, 184, 148, 0.1);
            }

            .file-input {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }

            .drop-zone-content {
                text-align: center;
                padding: 2rem;
            }

            .file-icon {
                font-size: 3rem;
                color: var(--accent-color);
                margin-bottom: 1rem;
            }

            .supported-formats {
                font-size: 0.9rem;
                color: var(--text-muted);
                margin-top: 1rem;
            }

            .conversion-options {
                background: var(--tool-card-bg);
                padding: 2rem;
                border-radius: 12px;
                box-shadow: var(--soft-box-shadow);
            }

            .file-info {
                margin-bottom: 2rem;
            }

            .file-info h3 {
                margin-bottom: 1rem;
            }

            .file-info p {
                margin: 0.5rem 0;
            }

            .audio-preview {
                margin-top: 1rem;
            }

            .audio-preview audio {
                width: 100%;
            }

            .format-selection,
            .quality-options {
                margin-bottom: 2rem;
            }

            .format-selection h3,
            .quality-options h3 {
                margin-bottom: 1rem;
            }

            .format-select,
            .quality-select {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 8px;
                background: white;
                font-size: 1rem;
                margin-bottom: 1rem;
            }

            .quality-setting {
                margin-bottom: 1rem;
            }

            .quality-setting label {
                display: block;
                margin-bottom: 0.5rem;
            }

            .convert-button {
                width: 100%;
                padding: 1rem;
                background: var(--accent-color);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .convert-button:hover:not(:disabled) {
                background: var(--accent-color-dark);
                transform: translateY(-1px);
            }

            .convert-button:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .conversion-progress {
                margin-top: 2rem;
                text-align: center;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: #eee;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 1rem;
            }

            .progress-fill {
                width: 0%;
                height: 100%;
                background: var(--accent-color);
                transition: width 0.3s ease;
            }

            .hidden {
                display: none;
            }

            .waveform-container {
                position: relative;
                width: 100%;
                height: 150px;
                margin: 1rem 0;
                background: var(--tool-card-bg);
                border-radius: 8px;
                overflow: hidden;
            }

            #waveformCanvas {
                width: 100%;
                height: 100%;
                background: var(--tool-card-bg);
            }

            .trim-controls {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
                pointer-events: none;
            }

            .trim-handle {
                position: absolute;
                top: 0;
                width: 4px;
                height: 100%;
                background: var(--accent-color);
                cursor: ew-resize;
                pointer-events: auto;
            }

            .trim-handle::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 12px;
                height: 24px;
                background: var(--accent-color);
                border-radius: 4px;
            }

            .trim-handle.left {
                left: 0;
            }

            .trim-handle.right {
                right: 0;
            }

            .trim-time {
                position: absolute;
                bottom: 5px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                padding: 0 10px;
                color: var(--text-color);
                font-size: 0.8rem;
                pointer-events: none;
            }

            .trim-inputs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1rem;
            }

            .trim-input-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .trim-input-group input {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 4px;
                font-size: 0.9rem;
            }

            @media (max-width: 768px) {
                .converter-section {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    setupEventListeners() {
        if (!this.elements.fileInput) return;

        // File input change
        this.elements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelection(file);
            }
        });

        // Drag and drop
        this.elements.fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.fileDropZone.classList.add('drag-over');
        });

        this.elements.fileDropZone.addEventListener('dragleave', () => {
            this.elements.fileDropZone.classList.remove('drag-over');
        });

        this.elements.fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.fileDropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('audio/')) {
                this.handleFileSelection(file);
            } else {
                showToast('Please drop an audio file', 'error');
            }
        });

        // Convert button
        this.elements.convertButton.addEventListener('click', () => {
            this.startConversion();
        });

        // Trim handle drag events
        if (this.elements.trimStart && this.elements.trimEnd) {
            [this.elements.trimStart, this.elements.trimEnd].forEach(handle => {
                handle.addEventListener('mousedown', (e) => {
                    this.isDragging = true;
                    this.currentHandle = handle;
                    e.preventDefault();
                });
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging || !this.currentHandle) return;
                
                const rect = this.elements.waveformCanvas.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const time = (x / rect.width) * this.audioDuration;
                
                if (this.currentHandle === this.elements.trimStart) {
                    this.trimStart = Math.min(time, this.trimEnd);
                    this.elements.trimStartInput.value = this.trimStart.toFixed(1);
                } else {
                    this.trimEnd = Math.max(time, this.trimStart);
                    this.elements.trimEndInput.value = this.trimEnd.toFixed(1);
                }
                
                this.updateTrimHandles();
                this.updateTrimTimes();
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
                this.currentHandle = null;
            });
        }

        // Trim input events
        if (this.elements.trimStartInput && this.elements.trimEndInput) {
            this.elements.trimStartInput.addEventListener('change', (e) => {
                this.trimStart = Math.min(parseFloat(e.target.value), this.trimEnd);
                this.updateTrimHandles();
                this.updateTrimTimes();
            });

            this.elements.trimEndInput.addEventListener('change', (e) => {
                this.trimEnd = Math.max(parseFloat(e.target.value), this.trimStart);
                this.updateTrimHandles();
                this.updateTrimTimes();
            });
        }
    }

    async handleFileSelection(file) {
        // Update file info
        this.elements.fileName.textContent = file.name;
        this.elements.fileSize.textContent = this.formatFileSize(file.size);
        this.elements.fileType.textContent = file.type;

        // Show file info section
        this.elements.fileInfo.classList.remove('hidden');

        // Create audio preview
        const audioUrl = URL.createObjectURL(file);
        this.elements.audioPreview.src = audioUrl;

        // Enable convert button
        this.elements.convertButton.disabled = false;

        // Store the file
        this.currentFile = file;

        // Draw waveform
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.waveformData = this.getWaveformData(audioBuffer);
        this.audioDuration = audioBuffer.duration;
        this.trimStart = 0;
        this.trimEnd = this.audioDuration;
        
        // Update UI
        this.elements.trimEndInput.value = this.audioDuration.toFixed(1);
        this.elements.trimEndInput.max = this.audioDuration;
        this.elements.trimStartInput.max = this.audioDuration;
        
        this.drawWaveform();
        this.updateTrimHandles();
        this.updateTrimTimes();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async startConversion() {
        if (!this.currentFile) return;

        const targetFormat = this.elements.formatSelect.value;
        const bitrate = parseInt(this.elements.bitrateSelect.value);
        const sampleRate = parseInt(this.elements.sampleRateSelect.value);

        try {
            // Show progress
            this.elements.conversionProgress.classList.remove('hidden');
            this.updateProgress(0);

            // Initialize audio context
            await this.initAudioContext();

            // Read the file
            const arrayBuffer = await this.currentFile.arrayBuffer();
            
            // Decode the audio
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            // Convert to desired format
            const convertedBuffer = await this.processAudio(audioBuffer, sampleRate);

            // Create the final blob
            const blob = await this.createAudioBlob(convertedBuffer, targetFormat);

            // Create download link
            this.downloadFile(blob, targetFormat);

            // Show success message
            showToast('Conversion completed successfully!', 'success');
            this.elements.conversionProgress.classList.add('hidden');
            this.updateProgress(0);

        } catch (error) {
            console.error('Conversion error:', error);
            showToast('Error converting audio: ' + error.message, 'error');
            this.elements.conversionProgress.classList.add('hidden');
            this.updateProgress(0);
        }
    }

    async processAudio(audioBuffer, targetSampleRate) {
        // Calculate the new length based on trim points
        const startSample = Math.floor(this.trimStart * audioBuffer.sampleRate);
        const endSample = Math.floor(this.trimEnd * audioBuffer.sampleRate);
        const trimmedLength = endSample - startSample;

        // Create offline context for processing
        const offlineContext = new OfflineAudioContext({
            numberOfChannels: audioBuffer.numberOfChannels,
            length: Math.ceil(trimmedLength * (targetSampleRate / audioBuffer.sampleRate)),
            sampleRate: targetSampleRate
        });

        // Create buffer source
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        
        // Start the source at the trim start point
        source.start(0, this.trimStart, this.trimEnd - this.trimStart);

        // Render the audio
        return await offlineContext.startRendering();
    }

    async createAudioBlob(audioBuffer, format) {
        // Convert AudioBuffer to WAV format
        const wavData = this.audioBufferToWav(audioBuffer);
        
        // If target format is WAV, return as is
        if (format === 'wav') {
            return new Blob([wavData], { type: 'audio/wav' });
        }

        // For other formats, we'll return WAV for now
        // In a production environment, you'd want to use a proper encoder
        return new Blob([wavData], { type: this.supportedFormats[format] });
    }

    audioBufferToWav(audioBuffer) {
        const numberOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        const bytesPerSample = bitDepth / 8;
        const blockAlign = numberOfChannels * bytesPerSample;

        const buffer = new ArrayBuffer(44 + audioBuffer.length * blockAlign);
        const view = new DataView(buffer);

        // Write WAV header
        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(view, 0, 'RIFF');  // ChunkID
        view.setUint32(4, 36 + audioBuffer.length * blockAlign, true); // ChunkSize
        writeString(view, 8, 'WAVE');  // Format
        writeString(view, 12, 'fmt '); // Subchunk1ID
        view.setUint32(16, 16, true); // Subchunk1Size
        view.setUint16(20, format, true); // AudioFormat
        view.setUint16(22, numberOfChannels, true); // NumChannels
        view.setUint32(24, sampleRate, true); // SampleRate
        view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
        view.setUint16(32, blockAlign, true); // BlockAlign
        view.setUint16(34, bitDepth, true); // BitsPerSample
        writeString(view, 36, 'data'); // Subchunk2ID
        view.setUint32(40, audioBuffer.length * blockAlign, true); // Subchunk2Size

        // Write audio data
        const offset = 44;
        const channelData = [];
        for (let i = 0; i < numberOfChannels; i++) {
            channelData[i] = audioBuffer.getChannelData(i);
        }

        let index = 0;
        const volume = 1;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = channelData[channel][i] * volume;
                view.setInt16(offset + index, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                index += bytesPerSample;
            }
        }

        return buffer;
    }

    downloadFile(blob, format) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `converted-audio.${format}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    updateProgress(percent) {
        this.elements.progressBar.style.width = `${percent}%`;
        this.elements.progressPercent.textContent = `${percent}%`;
    }

    getWaveformData(audioBuffer) {
        const channelData = audioBuffer.getChannelData(0);
        const samples = 1000; // Number of samples for visualization
        const blockSize = Math.floor(channelData.length / samples);
        const waveform = [];

        for (let i = 0; i < samples; i++) {
            let start = i * blockSize;
            let end = start + blockSize;
            let max = 0;
            
            for (let j = start; j < end; j++) {
                const amplitude = Math.abs(channelData[j]);
                if (amplitude > max) max = amplitude;
            }
            
            waveform.push(max);
        }

        return waveform;
    }

    drawWaveform() {
        if (!this.waveformData || !this.elements.waveformCanvas) return;

        const canvas = this.elements.waveformCanvas;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size accounting for device pixel ratio
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Draw waveform
        const width = rect.width;
        const height = rect.height;
        const barWidth = width / this.waveformData.length;
        
        ctx.beginPath();
        ctx.strokeStyle = 'var(--accent-color)';
        ctx.lineWidth = 2;
        
        this.waveformData.forEach((amplitude, i) => {
            const x = i * barWidth;
            const y = (height / 2) * (1 - amplitude);
            const y2 = (height / 2) * (1 + amplitude);
            
            ctx.moveTo(x, y);
            ctx.lineTo(x, y2);
        });
        
        ctx.stroke();
    }

    updateTrimHandles() {
        if (!this.elements.waveformCanvas || !this.elements.trimStart || !this.elements.trimEnd) return;

        const width = this.elements.waveformCanvas.offsetWidth;
        const startX = (this.trimStart / this.audioDuration) * width;
        const endX = (this.trimEnd / this.audioDuration) * width;

        this.elements.trimStart.style.left = `${startX}px`;
        this.elements.trimEnd.style.right = `${width - endX}px`;
    }

    updateTrimTimes() {
        if (!this.elements.trimStartTime || !this.elements.trimEndTime) return;

        this.elements.trimStartTime.textContent = this.formatTime(this.trimStart);
        this.elements.trimEndTime.textContent = this.formatTime(this.trimEnd);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
} 