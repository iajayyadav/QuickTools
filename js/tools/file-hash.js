// File Hash Calculator Tool
import { showToast, setLoading } from '../main.js';

export function init() {
    const container = document.getElementById('file-hash-content');
    if (!container) return;

    // Add CryptoJS library for MD5 support
    const cryptoJsScript = document.createElement('script');
    cryptoJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(cryptoJsScript);

    // Wait for CryptoJS to load
    cryptoJsScript.onload = () => {
        initializeHashCalculator();
    };

    function initializeHashCalculator() {
        container.innerHTML = `
            <div class="hash-calculator-container">
                <div class="file-input-section">
                    <div class="drag-drop-area" id="dragDropArea">
                        <i class="fas fa-file-upload"></i>
                        <p>Drag & drop files here or click to select</p>
                        <input type="file" id="fileInput" multiple>
                    </div>
                </div>

                <div class="hash-options">
                    <label><input type="checkbox" id="md5Check" checked> MD5</label>
                    <label><input type="checkbox" id="sha1Check" checked> SHA-1</label>
                    <label><input type="checkbox" id="sha256Check" checked> SHA-256</label>
                </div>

                <div class="results-container">
                    <div class="file-list" id="fileList"></div>
                </div>

                <button id="copyAllBtn" class="btn" style="display: none;">
                    <i class="fas fa-copy"></i> Copy All Results
                </button>
            </div>

            <style>
                .hash-calculator-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .drag-drop-area {
                    border: 2px dashed var(--border-color);
                    border-radius: var(--border-radius-lg);
                    padding: 40px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: var(--bg-color);
                }

                .drag-drop-area:hover, .drag-drop-area.dragover {
                    border-color: var(--accent-color);
                    background: var(--tool-card-bg);
                }

                .drag-drop-area i {
                    font-size: 48px;
                    color: var(--accent-color);
                    margin-bottom: 15px;
                }

                .drag-drop-area input[type="file"] {
                    display: none;
                }

                .hash-options {
                    margin: 20px 0;
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                }

                .hash-options label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .results-container {
                    margin-top: 20px;
                }

                .file-result {
                    background: var(--tool-card-bg);
                    border-radius: var(--border-radius-lg);
                    padding: 15px;
                    margin-bottom: 15px;
                }

                .file-name {
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: var(--accent-color);
                }

                .hash-result {
                    margin: 10px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .hash-type {
                    min-width: 80px;
                    font-weight: 500;
                }

                .hash-value {
                    font-family: monospace;
                    background: var(--bg-color);
                    padding: 5px 10px;
                    border-radius: var(--border-radius-lg);
                    flex-grow: 1;
                    word-break: break-all;
                }

                .copy-btn {
                    background: none;
                    border: none;
                    color: var(--accent-color);
                    cursor: pointer;
                    padding: 5px;
                    border-radius: var(--border-radius-lg);
                    transition: all 0.3s ease;
                }

                .copy-btn:hover {
                    background: var(--bg-color);
                }

                #copyAllBtn {
                    margin-top: 20px;
                    width: 100%;
                }

                .file-size {
                    font-size: 0.9em;
                    color: var(--text-color);
                    opacity: 0.8;
                    margin-bottom: 10px;
                }
            </style>
        `;

        const dragDropArea = document.getElementById('dragDropArea');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        const copyAllBtn = document.getElementById('copyAllBtn');
        const md5Check = document.getElementById('md5Check');
        const sha1Check = document.getElementById('sha1Check');
        const sha256Check = document.getElementById('sha256Check');

        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dragDropArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dragDropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dragDropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dragDropArea.classList.add('dragover');
        }

        function unhighlight() {
            dragDropArea.classList.remove('dragover');
        }

        // Handle file selection
        dragDropArea.addEventListener('drop', handleDrop, false);
        dragDropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFileSelect(e) {
            const files = e.target.files;
            handleFiles(files);
        }

        async function handleFiles(files) {
            if (files.length === 0) return;
            
            fileList.innerHTML = '';
            copyAllBtn.style.display = 'none';
            setLoading('file-hash', true);

            try {
                for (const file of files) {
                    const fileResult = document.createElement('div');
                    fileResult.className = 'file-result';
                    fileResult.innerHTML = `
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                        <div class="hash-results"></div>
                        <div class="hash-loading">
                            <i class="fas fa-spinner fa-spin"></i> Calculating hashes...
                        </div>
                    `;
                    fileList.appendChild(fileResult);

                    const hashResults = fileResult.querySelector('.hash-results');
                    const hashLoading = fileResult.querySelector('.hash-loading');
                    const selectedHashes = getSelectedHashes();

                    try {
                        for (const hashType of selectedHashes) {
                            try {
                                const hash = await calculateHash(file, hashType);
                                const hashResult = document.createElement('div');
                                hashResult.className = 'hash-result';
                                hashResult.innerHTML = `
                                    <span class="hash-type">${hashType.toUpperCase()}:</span>
                                    <span class="hash-value">${hash}</span>
                                    <button class="copy-btn" title="Copy hash">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                `;
                                hashResults.appendChild(hashResult);

                                // Add copy button functionality
                                const copyBtn = hashResult.querySelector('.copy-btn');
                                copyBtn.addEventListener('click', () => {
                                    const hashValue = hashResult.querySelector('.hash-value').textContent;
                                    navigator.clipboard.writeText(hashValue)
                                        .then(() => showToast('Hash copied to clipboard!'))
                                        .catch(() => showToast('Failed to copy hash', 'error'));
                                });
                            } catch (hashError) {
                                const hashResult = document.createElement('div');
                                hashResult.className = 'hash-result error';
                                hashResult.innerHTML = `
                                    <span class="hash-type">${hashType.toUpperCase()}:</span>
                                    <span class="hash-value error">Error calculating hash: ${hashError.message}</span>
                                `;
                                hashResults.appendChild(hashResult);
                            }
                        }
                    } finally {
                        hashLoading.style.display = 'none';
                    }
                }

                if (files.length > 0) {
                    copyAllBtn.style.display = 'block';
                }
            } catch (error) {
                showToast('Error processing files: ' + error.message, 'error');
            } finally {
                setLoading('file-hash', false);
            }
        }

        // Copy all results
        copyAllBtn.addEventListener('click', () => {
            const results = [];
            document.querySelectorAll('.file-result').forEach(fileResult => {
                const fileName = fileResult.querySelector('.file-name').textContent;
                results.push(`File: ${fileName}`);
                
                fileResult.querySelectorAll('.hash-result').forEach(hashResult => {
                    const hashType = hashResult.querySelector('.hash-type').textContent;
                    const hashValue = hashResult.querySelector('.hash-value').textContent;
                    results.push(`${hashType} ${hashValue}`);
                });
                results.push(''); // Empty line between files
            });

            navigator.clipboard.writeText(results.join('\n'))
                .then(() => showToast('All results copied to clipboard!'))
                .catch(() => showToast('Failed to copy results', 'error'));
        });

        // Handle hash type changes
        [md5Check, sha1Check, sha256Check].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const files = fileInput.files;
                if (files.length > 0) {
                    handleFiles(files);
                }
            });
        });

        function getSelectedHashes() {
            const hashes = [];
            if (md5Check.checked) hashes.push('md5');
            if (sha1Check.checked) hashes.push('sha1');
            if (sha256Check.checked) hashes.push('sha256');
            return hashes.length > 0 ? hashes : ['sha256']; // Default to SHA-256 if none selected
        }

        async function calculateHash(file, hashType) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async (event) => {
                    try {
                        const arrayBuffer = event.target.result;
                        let hash;

                        if (hashType.toLowerCase() === 'md5') {
                            // Use CryptoJS for MD5
                            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
                            hash = CryptoJS.MD5(wordArray).toString();
                        } else {
                            // Use Web Crypto API for SHA-1 and SHA-256
                            const hashBuffer = await crypto.subtle.digest(getHashAlgorithm(hashType), arrayBuffer);
                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                            hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                        }
                        
                        resolve(hash);
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = () => reject(new Error('Error reading file'));
                reader.readAsArrayBuffer(file);
            });
        }

        function getHashAlgorithm(hashType) {
            switch (hashType.toLowerCase()) {
                case 'sha1': return 'SHA-1';
                case 'sha256': return 'SHA-256';
                default: throw new Error('Unsupported hash type');
            }
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Add styles for loading and error states
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            .hash-loading {
                text-align: center;
                padding: 10px;
                color: var(--text-color);
                opacity: 0.8;
            }
            
            .hash-result.error .hash-value {
                color: #ff6b6b;
                font-style: italic;
            }
            
            .hash-value.error {
                color: #ff6b6b;
                font-style: italic;
                font-family: inherit;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(additionalStyles);
    }
} 