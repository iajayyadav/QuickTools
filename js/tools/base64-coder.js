// Base64 Encoder/Decoder Tool
import { showToast } from '../main.js';

class Base64Tool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scopeId = 'base64-' + Math.random().toString(36).substr(2, 9);
        this.container.setAttribute('data-scope', this.scopeId);
        
        this.state = {
            isEncoding: true,
            autoConvert: false,
            urlSafe: true,
            lineBreaks: false,
            binaryMode: false,
            autoDetect: true,
            history: [],
            maxHistory: 10,
            conversionStats: {
                startTime: 0,
                filesProcessed: 0,
                inputSize: 0,
                outputSize: 0,
                processingTime: 0
            }
        };

        this.render();
        this.initializeElements();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="base64-container">
                <div class="tool-header">
                    <div class="mode-selector">
                        <button id="${this.scopeId}-encode-btn" class="mode-btn active">
                            <i class="fas fa-lock"></i> Encode
                        </button>
                        <button id="${this.scopeId}-decode-btn" class="mode-btn">
                            <i class="fas fa-lock-open"></i> Decode
                        </button>
                    </div>
                    <div class="tool-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${this.scopeId}-url-safe" checked>
                            <span class="checkbox-text">URL Safe</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="${this.scopeId}-auto-convert">
                            <span class="checkbox-text">Auto Convert</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="${this.scopeId}-line-breaks">
                            <span class="checkbox-text">Line Breaks</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="${this.scopeId}-binary-mode">
                            <span class="checkbox-text">Binary Mode</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="${this.scopeId}-auto-detect" checked>
                            <span class="checkbox-text">Auto Detect</span>
                        </label>
                    </div>
                </div>

                <div class="conversion-area">
                    <div class="input-section">
                        <div class="input-header">
                            <div class="header-left">
                                <label for="${this.scopeId}-input">Input</label>
                                <span class="char-counter" id="${this.scopeId}-input-counter">0 characters</span>
                                <span class="format-indicator" id="${this.scopeId}-format-indicator"></span>
                            </div>
                            <div class="input-actions">
                                <button id="${this.scopeId}-paste-btn" class="action-btn" title="Paste from clipboard">
                                    <i class="fas fa-paste"></i>
                                </button>
                                <button id="${this.scopeId}-clear-btn" class="action-btn" title="Clear input">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button id="${this.scopeId}-upload-btn" class="action-btn" title="Upload file">
                                    <i class="fas fa-file-upload"></i>
                                </button>
                                <input type="file" id="${this.scopeId}-file-input" style="display: none;" multiple>
                            </div>
                        </div>
                        <div class="input-area" id="${this.scopeId}-input-area">
                            <textarea id="${this.scopeId}-input" 
                                    placeholder="Enter text to encode or decode...&#10;Or drag and drop files here"
                                    spellcheck="false"></textarea>
                            <div class="drag-overlay" id="${this.scopeId}-drag-overlay">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Drop files here</span>
                            </div>
                        </div>
                    </div>

                    <div class="conversion-controls">
                        <button id="${this.scopeId}-swap-btn" class="control-btn" title="Swap input/output">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button id="${this.scopeId}-convert-btn" class="control-btn primary" title="Convert">
                            <i class="fas fa-sync-alt"></i> Convert
                        </button>
                    </div>

                    <div class="output-section">
                        <div class="output-header">
                            <div class="header-left">
                                <label for="${this.scopeId}-output">Output</label>
                                <span class="char-counter" id="${this.scopeId}-output-counter">0 characters</span>
                            </div>
                            <div class="output-actions">
                                <button id="${this.scopeId}-copy-btn" class="action-btn" title="Copy to clipboard">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button id="${this.scopeId}-download-btn" class="action-btn" title="Download as file">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                        <textarea id="${this.scopeId}-output" readonly spellcheck="false"></textarea>
                    </div>

                    <div class="stats-panel" id="${this.scopeId}-stats-panel">
                        <div class="stat-item">
                            <span class="stat-label">Size Change:</span>
                            <span class="stat-value" id="${this.scopeId}-size-change">0%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Processing Time:</span>
                            <span class="stat-value" id="${this.scopeId}-processing-time">0ms</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Files Processed:</span>
                            <span class="stat-value" id="${this.scopeId}-files-processed">0</span>
                        </div>
                    </div>
                </div>

                <div class="history-section">
                    <h4><i class="fas fa-history"></i> Recent Conversions</h4>
                    <div id="${this.scopeId}-history-list" class="history-list"></div>
                </div>
            </div>

            <style>
                [data-scope="${this.scopeId}"] .base64-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: var(--tool-card-bg);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--soft-box-shadow);
                }

                [data-scope="${this.scopeId}"] .tool-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: var(--bg-color);
                    border-radius: var(--border-radius-lg);
                    border: 2px solid var(--border-color);
                }

                [data-scope="${this.scopeId}"] .mode-selector {
                    display: flex;
                    gap: 0.5rem;
                }

                [data-scope="${this.scopeId}"] .tool-options {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                [data-scope="${this.scopeId}"] .mode-btn,
                [data-scope="${this.scopeId}"] .control-btn {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius-lg);
                    background: var(--bg-color);
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                [data-scope="${this.scopeId}"] .mode-btn.active,
                [data-scope="${this.scopeId}"] .control-btn.primary {
                    background: var(--accent-color);
                    color: white;
                    border-color: var(--accent-color);
                }

                [data-scope="${this.scopeId}"] .mode-btn:hover,
                [data-scope="${this.scopeId}"] .control-btn:hover {
                    background: var(--accent-color);
                    color: white;
                    border-color: var(--accent-color);
                }

                [data-scope="${this.scopeId}"] .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }

                [data-scope="${this.scopeId}"] .checkbox-text {
                    font-size: 0.9rem;
                }

                [data-scope="${this.scopeId}"] .conversion-area {
                    margin: 2rem 0;
                }

                [data-scope="${this.scopeId}"] .input-section,
                [data-scope="${this.scopeId}"] .output-section {
                    margin-bottom: 1.5rem;
                }

                [data-scope="${this.scopeId}"] .input-header,
                [data-scope="${this.scopeId}"] .output-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                [data-scope="${this.scopeId}"] .header-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                [data-scope="${this.scopeId}"] .char-counter {
                    font-size: 0.9rem;
                    color: var(--text-color-light);
                }

                [data-scope="${this.scopeId}"] .format-indicator {
                    font-size: 0.9rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: var(--border-radius-sm);
                    background: var(--accent-color);
                    color: white;
                    display: none;
                }

                [data-scope="${this.scopeId}"] .format-indicator.valid {
                    background: var(--success-color);
                }

                [data-scope="${this.scopeId}"] .format-indicator.invalid {
                    background: var(--error-color);
                }

                [data-scope="${this.scopeId}"] .input-actions,
                [data-scope="${this.scopeId}"] .output-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                [data-scope="${this.scopeId}"] .action-btn {
                    padding: 0.5rem;
                    border: none;
                    background: transparent;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-radius: var(--border-radius-sm);
                }

                [data-scope="${this.scopeId}"] .action-btn:hover {
                    color: var(--accent-color);
                    background: var(--bg-color);
                }

                [data-scope="${this.scopeId}"] .input-area {
                    position: relative;
                }

                [data-scope="${this.scopeId}"] textarea {
                    width: 100%;
                    min-height: 120px;
                    padding: 1rem;
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius-lg);
                    background: var(--bg-color);
                    color: var(--text-color);
                    font-size: 1rem;
                    line-height: 1.5;
                    font-family: monospace;
                    resize: vertical;
                    transition: all 0.3s ease;
                }

                [data-scope="${this.scopeId}"] textarea:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.1);
                }

                [data-scope="${this.scopeId}"] .drag-overlay {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(var(--accent-color-rgb), 0.1);
                    border: 2px dashed var(--accent-color);
                    border-radius: var(--border-radius-lg);
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    gap: 1rem;
                    font-size: 1.2rem;
                    color: var(--accent-color);
                    z-index: 10;
                }

                [data-scope="${this.scopeId}"] .drag-overlay.active {
                    display: flex;
                }

                [data-scope="${this.scopeId}"] .drag-overlay i {
                    font-size: 2rem;
                }

                [data-scope="${this.scopeId}"] .conversion-controls {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin: 1.5rem 0;
                }

                [data-scope="${this.scopeId}"] .stats-panel {
                    display: flex;
                    gap: 1rem;
                    padding: 0.5rem;
                    background: var(--bg-color);
                    border-radius: var(--border-radius-lg);
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                }

                [data-scope="${this.scopeId}"] .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                [data-scope="${this.scopeId}"] .stat-label {
                    color: var(--text-color-light);
                }

                [data-scope="${this.scopeId}"] .stat-value {
                    font-weight: 500;
                    color: var(--accent-color);
                }

                [data-scope="${this.scopeId}"] .history-section {
                    margin-top: 2rem;
                    padding: 1rem;
                    background: var(--bg-color);
                    border-radius: var(--border-radius-lg);
                    border: 2px solid var(--border-color);
                }

                [data-scope="${this.scopeId}"] .history-list {
                    margin-top: 1rem;
                    max-height: 200px;
                    overflow-y: auto;
                }

                [data-scope="${this.scopeId}"] .history-item {
                    padding: 0.5rem;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                [data-scope="${this.scopeId}"] .history-item:hover {
                    background: var(--tool-card-bg);
                }

                @media (max-width: 768px) {
                    [data-scope="${this.scopeId}"] .base64-container {
                        padding: 1rem;
                    }

                    [data-scope="${this.scopeId}"] .tool-header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    [data-scope="${this.scopeId}"] .tool-options {
                        justify-content: center;
                    }

                    [data-scope="${this.scopeId}"] .stats-panel {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            </style>
        `;
    }

    initializeElements() {
        this.elements = {
            input: document.getElementById(`${this.scopeId}-input`),
            output: document.getElementById(`${this.scopeId}-output`),
            encodeBtn: document.getElementById(`${this.scopeId}-encode-btn`),
            decodeBtn: document.getElementById(`${this.scopeId}-decode-btn`),
            convertBtn: document.getElementById(`${this.scopeId}-convert-btn`),
            swapBtn: document.getElementById(`${this.scopeId}-swap-btn`),
            pasteBtn: document.getElementById(`${this.scopeId}-paste-btn`),
            clearBtn: document.getElementById(`${this.scopeId}-clear-btn`),
            copyBtn: document.getElementById(`${this.scopeId}-copy-btn`),
            uploadBtn: document.getElementById(`${this.scopeId}-upload-btn`),
            downloadBtn: document.getElementById(`${this.scopeId}-download-btn`),
            fileInput: document.getElementById(`${this.scopeId}-file-input`),
            inputArea: document.getElementById(`${this.scopeId}-input-area`),
            dragOverlay: document.getElementById(`${this.scopeId}-drag-overlay`),
            formatIndicator: document.getElementById(`${this.scopeId}-format-indicator`),
            inputCounter: document.getElementById(`${this.scopeId}-input-counter`),
            outputCounter: document.getElementById(`${this.scopeId}-output-counter`),
            historyList: document.getElementById(`${this.scopeId}-history-list`),
            sizeChange: document.getElementById(`${this.scopeId}-size-change`),
            processingTime: document.getElementById(`${this.scopeId}-processing-time`),
            filesProcessed: document.getElementById(`${this.scopeId}-files-processed`),
            urlSafe: document.getElementById(`${this.scopeId}-url-safe`),
            autoConvert: document.getElementById(`${this.scopeId}-auto-convert`),
            lineBreaks: document.getElementById(`${this.scopeId}-line-breaks`),
            binaryMode: document.getElementById(`${this.scopeId}-binary-mode`),
            autoDetect: document.getElementById(`${this.scopeId}-auto-detect`)
        };
    }

    attachEventListeners() {
        // Mode switching
        this.elements.encodeBtn.addEventListener('click', () => this.setMode(true));
        this.elements.decodeBtn.addEventListener('click', () => this.setMode(false));

        // Input handling
        this.elements.input.addEventListener('input', () => this.handleInput());
        this.elements.convertBtn.addEventListener('click', () => this.convert());
        this.elements.swapBtn.addEventListener('click', () => this.swapInputOutput());

        // File handling
        this.elements.uploadBtn.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.setupDragAndDrop();

        // Clipboard operations
        this.elements.pasteBtn.addEventListener('click', () => this.handlePaste());
        this.elements.copyBtn.addEventListener('click', () => this.handleCopy());
        this.elements.clearBtn.addEventListener('click', () => this.handleClear());
        this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());

        // Options
        [this.elements.urlSafe, this.elements.lineBreaks, this.elements.binaryMode].forEach(element => {
            element.addEventListener('change', () => {
                if (this.elements.autoConvert.checked && this.elements.input.value) {
                    this.convert();
                }
            });
        });
    }

    setMode(isEncoding) {
        this.state.isEncoding = isEncoding;
        this.elements.encodeBtn.classList.toggle('active', isEncoding);
        this.elements.decodeBtn.classList.toggle('active', !isEncoding);
        if (this.elements.autoConvert.checked && this.elements.input.value) {
            this.convert();
        }
    }

    setupDragAndDrop() {
        this.elements.inputArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            this.elements.dragOverlay.classList.add('active');
        });

        this.elements.inputArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.elements.dragOverlay.classList.remove('active');
        });

        this.elements.inputArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.elements.inputArea.addEventListener('drop', (e) => this.handleDrop(e));
    }

    async handleDrop(e) {
        e.preventDefault();
        this.elements.dragOverlay.classList.remove('active');

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        try {
            if (files.length === 1) {
                await this.processSingleFile(files[0]);
            } else {
                await this.processBatchFiles(files);
            }
        } catch (error) {
            console.error('File processing error:', error);
            showToast('Error processing files', 'error');
        }
    }

    async processSingleFile(file) {
        this.resetStats(1);
        try {
            if (this.elements.binaryMode.checked) {
                const buffer = await file.arrayBuffer();
                this.elements.input.value = `Binary file: ${file.name} (${file.size} bytes)`;
                if (this.elements.autoConvert.checked) {
                    const result = this.encode(buffer);
                    this.elements.output.value = result;
                    this.updateStats(file.size, result.length);
                }
            } else {
                const text = await file.text();
                this.elements.input.value = text;
                this.updateCharCounter(text, this.elements.inputCounter);
                if (this.elements.autoDetect.checked) this.detectFormat(text);
                if (this.elements.autoConvert.checked) {
                    this.convert();
                }
            }
            showToast('File loaded successfully');
        } catch (error) {
            console.error('File read error:', error);
            showToast('Error reading file', 'error');
        }
    }

    async processBatchFiles(files) {
        this.resetStats(files.length);
        try {
            const results = await Promise.all(files.map(async (file) => {
                if (this.elements.binaryMode.checked) {
                    const buffer = await file.arrayBuffer();
                    return {
                        name: file.name,
                        size: file.size,
                        result: this.encode(buffer)
                    };
                } else {
                    const text = await file.text();
                    return {
                        name: file.name,
                        size: file.size,
                        result: this.state.isEncoding ? this.encode(text) : this.decode(text)
                    };
                }
            }));

            const totalInputSize = results.reduce((sum, r) => sum + r.size, 0);
            const output = results.map(r => `// ${r.name}\n${r.result}`).join('\n\n');
            const totalOutputSize = output.length;

            this.elements.input.value = files.map(f => f.name).join(', ');
            this.elements.output.value = output;
            this.updateCharCounter(this.elements.input.value, this.elements.inputCounter);
            this.updateCharCounter(output, this.elements.outputCounter);
            this.updateStats(totalInputSize, totalOutputSize);

            showToast(`Processed ${files.length} files successfully`);
        } catch (error) {
            console.error('Batch processing error:', error);
            showToast('Error processing files', 'error');
        }
    }

    async handleFileUpload(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (files.length === 1) {
            await this.processSingleFile(files[0]);
        } else {
            await this.processBatchFiles(files);
        }
    }

    async handlePaste() {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                this.elements.input.value = text;
                this.updateCharCounter(text, this.elements.inputCounter);
                if (this.elements.autoDetect.checked) this.detectFormat(text);
                if (this.elements.autoConvert.checked) this.convert();
                showToast('Text pasted from clipboard');
            }
        } catch (error) {
            console.error('Paste error:', error);
            showToast('Failed to paste from clipboard', 'error');
        }
    }

    async handleCopy() {
        const output = this.elements.output.value;
        if (!output) {
            showToast('No text to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            showToast('Output copied to clipboard');
        } catch (error) {
            console.error('Copy error:', error);
            showToast('Failed to copy to clipboard', 'error');
        }
    }

    handleClear() {
        this.elements.input.value = '';
        this.elements.output.value = '';
        this.updateCharCounter('', this.elements.inputCounter);
        this.updateCharCounter('', this.elements.outputCounter);
        this.resetStats(0);
        showToast('Input cleared');
    }

    handleDownload() {
        const output = this.elements.output.value;
        if (!output) {
            showToast('No output to download', 'error');
            return;
        }

        try {
            let blob;
            if (this.elements.binaryMode.checked && !this.state.isEncoding) {
                const bytes = new Uint8Array(this.decode(this.elements.input.value));
                blob = new Blob([bytes], { type: 'application/octet-stream' });
            } else {
                blob = new Blob([output], { type: 'text/plain' });
            }
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.state.isEncoding ? 'encoded' : 'decoded'}_output${this.elements.binaryMode.checked ? '.bin' : '.txt'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('File downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            showToast('Error downloading file', 'error');
        }
    }

    handleInput() {
        const input = this.elements.input.value;
        this.updateCharCounter(input, this.elements.inputCounter);
        if (this.elements.autoDetect.checked) this.detectFormat(input);
        if (this.elements.autoConvert.checked) this.convert();
    }

    swapInputOutput() {
        const inputValue = this.elements.input.value;
        this.elements.input.value = this.elements.output.value;
        this.elements.output.value = inputValue;
        this.updateCharCounter(this.elements.input.value, this.elements.inputCounter);
        this.updateCharCounter(this.elements.output.value, this.elements.outputCounter);
        if (this.elements.autoDetect.checked) this.detectFormat(this.elements.input.value);
    }

    convert() {
        const input = this.elements.input.value;
        if (!input) {
            this.elements.output.value = '';
            this.updateCharCounter('', this.elements.outputCounter);
            return;
        }

        try {
            this.resetStats(1);
            this.elements.convertBtn.disabled = true;
            this.elements.convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';

            const result = this.state.isEncoding ? this.encode(input) : this.decode(input);
            
            if (result !== '') {
                if (this.elements.binaryMode.checked && !this.state.isEncoding) {
                    const bytes = new Uint8Array(result);
                    this.elements.output.value = `Binary data (${bytes.length} bytes)`;
                } else {
                    this.elements.output.value = result;
                }
                
                this.updateCharCounter(this.elements.output.value, this.elements.outputCounter);
                this.updateStats(input.length, this.elements.output.value.length);
                this.addToHistory(input, this.elements.output.value);
                showToast(`Text ${this.state.isEncoding ? 'encoded' : 'decoded'} successfully`);
            }
        } catch (error) {
            console.error('Conversion error:', error);
            showToast(`Error ${this.state.isEncoding ? 'encoding' : 'decoding'} text`, 'error');
            this.elements.output.value = '';
            this.updateCharCounter('', this.elements.outputCounter);
        } finally {
            this.elements.convertBtn.disabled = false;
            this.elements.convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Convert';
        }
    }

    encode(input) {
        if (!input) return '';
        
        try {
            let result;
            
            if (this.elements.binaryMode.checked && input instanceof ArrayBuffer) {
                const bytes = new Uint8Array(input);
                const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
                result = btoa(binString);
            } else {
                const bytes = new TextEncoder().encode(input);
                const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
                result = btoa(binString);
            }
            
            if (this.elements.urlSafe.checked) {
                result = result.replace(/\+/g, '-')
                               .replace(/\//g, '_')
                               .replace(/=+$/, '');
            }
            
            if (this.elements.lineBreaks.checked) {
                result = result.match(/.{1,76}/g).join('\n');
            }
            
            return result;
        } catch (error) {
            console.error('Encoding error:', error);
            showToast('Error encoding: ' + error.message, 'error');
            return '';
        }
    }

    decode(input) {
        if (!input) return '';
        
        try {
            let processedInput = input.trim();
            
            if (this.elements.urlSafe.checked) {
                processedInput = processedInput.replace(/-/g, '+').replace(/_/g, '/');
                while (processedInput.length % 4) processedInput += '=';
            }
            
            if (this.elements.lineBreaks.checked) {
                processedInput = processedInput.replace(/\n/g, '');
            }
            
            const binString = atob(processedInput);
            
            if (this.elements.binaryMode.checked) {
                const bytes = Uint8Array.from(binString, char => char.charCodeAt(0));
                return bytes.buffer;
            } else {
                const bytes = Uint8Array.from(binString, char => char.charCodeAt(0));
                return new TextDecoder().decode(bytes);
            }
        } catch (error) {
            console.error('Decoding error:', error);
            showToast('Error decoding. Make sure the input is valid Base64.', 'error');
            return '';
        }
    }

    detectFormat(input) {
        if (!input) {
            this.elements.formatIndicator.style.display = 'none';
            return;
        }

        const isBase64 = this.isValidBase64(input);
        this.elements.formatIndicator.style.display = 'inline-block';
        
        if (isBase64) {
            this.elements.formatIndicator.textContent = 'Valid Base64';
            this.elements.formatIndicator.classList.add('valid');
            this.elements.formatIndicator.classList.remove('invalid');
            
            if (this.elements.autoDetect.checked) {
                this.setMode(false);
            }
        } else {
            this.elements.formatIndicator.textContent = 'Not Base64';
            this.elements.formatIndicator.classList.add('invalid');
            this.elements.formatIndicator.classList.remove('valid');
            
            if (this.elements.autoDetect.checked) {
                this.setMode(true);
            }
        }
    }

    isValidBase64(str) {
        if (!str) return false;
        try {
            const regex = /^[A-Za-z0-9+/]*={0,2}$/;
            const urlSafeRegex = /^[A-Za-z0-9_-]*$/;
            
            str = str.replace(/[\s\n\r]/g, '');
            
            if (str.length % 4 !== 0 && !urlSafeRegex.test(str)) {
                return false;
            }
            
            return regex.test(str) || urlSafeRegex.test(str);
        } catch (error) {
            return false;
        }
    }

    updateCharCounter(text, counter) {
        const count = text.length;
        counter.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
    }

    resetStats(filesCount) {
        this.state.conversionStats = {
            startTime: performance.now(),
            filesProcessed: filesCount,
            inputSize: 0,
            outputSize: 0,
            processingTime: 0
        };
    }

    updateStats(inputSize, outputSize) {
        const endTime = performance.now();
        const stats = this.state.conversionStats;
        stats.inputSize = inputSize;
        stats.outputSize = outputSize;
        stats.processingTime = endTime - stats.startTime;

        const sizeChange = ((outputSize - inputSize) / inputSize * 100).toFixed(1);
        this.elements.sizeChange.textContent = `${sizeChange}%`;
        this.elements.processingTime.textContent = `${stats.processingTime.toFixed(1)}ms`;
        this.elements.filesProcessed.textContent = stats.filesProcessed;
    }

    addToHistory(input, output) {
        const item = {
            input,
            output,
            mode: this.state.isEncoding ? 'Encoded' : 'Decoded',
            timestamp: new Date()
        };

        this.state.history.unshift(item);
        this.state.history = this.state.history.slice(0, this.state.maxHistory);
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        this.elements.historyList.innerHTML = this.state.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <small>${item.timestamp.toLocaleTimeString()}</small>
                <div><strong>${item.mode}</strong>: ${item.input.substring(0, 30)}${item.input.length > 30 ? '...' : ''}</div>
            </div>
        `).join('');

        this.elements.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                const historyItem = this.state.history[index];
                this.elements.input.value = historyItem.input;
                this.updateCharCounter(historyItem.input, this.elements.inputCounter);
                if (this.elements.autoDetect.checked) this.detectFormat(historyItem.input);
                this.convert();
            });
        });
    }
}

export function init() {
    new Base64Tool('base64-coder-content');
} 