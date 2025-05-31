// CSV to JSON Converter Tool
import { showToast, createFileDownloadLink } from '../main.js';

export function init() {
    const container = document.getElementById('csv-to-json-converter-content');
    if (!container) return;

    container.innerHTML = `
        <div class="converter-container">
            <div class="input-section">
                <div class="input-group">
                    <label for="csv-input">CSV Input</label>
                    <div class="input-controls">
                        <button class="btn" id="paste-btn">
                            <i class="fas fa-paste"></i> Paste
                        </button>
                        <button class="btn" id="clear-btn">
                            <i class="fas fa-trash-alt"></i> Clear
                        </button>
                        <label class="btn file-input-label">
                            <i class="fas fa-file-upload"></i> Upload CSV
                            <input type="file" id="file-input" accept=".csv,text/csv" style="display: none;">
                        </label>
                    </div>
                    <textarea id="csv-input" placeholder="Paste your CSV data here or upload a file&#10;Example:&#10;name,age,city&#10;John,30,New York&#10;Jane,25,London"></textarea>
                </div>

                <div class="options-section">
                    <h3>Conversion Options</h3>
                    <div class="options-grid">
                        <div class="option-group">
                            <label for="delimiter">Delimiter</label>
                            <select id="delimiter">
                                <option value="," selected>Comma (,)</option>
                                <option value=";">Semicolon (;)</option>
                                <option value="\t">Tab</option>
                                <option value="|">Pipe (|)</option>
                                <option value="custom">Custom</option>
                            </select>
                            <input type="text" id="custom-delimiter" placeholder="Enter custom delimiter" style="display: none;" maxlength="1">
                        </div>
                        <div class="option-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="headers-included" checked>
                                First row contains headers
                            </label>
                        </div>
                        <div class="option-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="trim-values" checked>
                                Trim whitespace
                            </label>
                        </div>
                        <div class="option-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="parse-numbers">
                                Parse numbers
                            </label>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn primary-btn" id="convert-btn">
                        <i class="fas fa-sync-alt"></i> Convert to JSON
                    </button>
                </div>
            </div>

            <div class="output-section">
                <div class="output-group">
                    <label for="json-output">JSON Output</label>
                    <div class="output-controls">
                        <button class="btn" id="copy-btn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="btn" id="download-btn">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <select id="format-select">
                            <option value="2">Pretty (2 spaces)</option>
                            <option value="4">Pretty (4 spaces)</option>
                            <option value="0">Minified</option>
                        </select>
                    </div>
                    <div class="output-wrapper">
                        <pre id="json-output"></pre>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .converter-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--soft-box-shadow);
            }

            @media (max-width: 768px) {
                .converter-container {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
            }

            .input-section, .output-section {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .input-group, .output-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            label {
                color: var(--text-color);
                font-weight: 500;
            }

            .input-controls, .output-controls {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            textarea, .output-wrapper {
                width: 100%;
                min-height: 300px;
                padding: 1rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-family: monospace;
                font-size: 0.9rem;
                resize: vertical;
            }

            .output-wrapper {
                overflow: auto;
            }

            textarea:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            pre {
                margin: 0;
                white-space: pre-wrap;
                word-wrap: break-word;
            }

            .options-section {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .options-section h3 {
                color: var(--text-color);
                margin-bottom: 1rem;
            }

            .options-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .option-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            select, input[type="text"] {
                padding: 0.5rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 0.9rem;
            }

            select:focus, input[type="text"]:focus {
                outline: none;
                border-color: var(--accent-color);
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }

            .action-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1rem;
            }

            .primary-btn {
                background: var(--accent-color);
                color: white;
                padding: 0.75rem 1.5rem;
                font-weight: 500;
            }

            .primary-btn:hover {
                background: var(--accent-color-dark);
            }

            .file-input-label {
                cursor: pointer;
            }

            .error {
                border-color: #e74c3c !important;
            }

            .error-message {
                color: #e74c3c;
                font-size: 0.9rem;
                margin-top: 0.5rem;
            }
        </style>
    `;

    // Get DOM elements
    const elements = {
        csvInput: document.getElementById('csv-input'),
        jsonOutput: document.getElementById('json-output'),
        delimiter: document.getElementById('delimiter'),
        customDelimiter: document.getElementById('custom-delimiter'),
        headersIncluded: document.getElementById('headers-included'),
        trimValues: document.getElementById('trim-values'),
        parseNumbers: document.getElementById('parse-numbers'),
        formatSelect: document.getElementById('format-select'),
        fileInput: document.getElementById('file-input'),
        convertBtn: document.getElementById('convert-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        pasteBtn: document.getElementById('paste-btn'),
        clearBtn: document.getElementById('clear-btn')
    };

    // Parse CSV to JSON
    function parseCSV(csv, options) {
        const lines = csv.split(/\r?\n/).filter(line => line.trim());
        if (lines.length === 0) {
            throw new Error('CSV input is empty');
        }

        const delimiter = options.delimiter === '\\t' ? '\t' : options.delimiter;
        let result = [];

        // Get headers
        const headers = options.headersIncluded
            ? lines[0].split(delimiter).map(header => 
                options.trimValues ? header.trim() : header)
            : null;

        // Process data rows
        const startIndex = options.headersIncluded ? 1 : 0;
        for (let i = startIndex; i < lines.length; i++) {
            const values = lines[i].split(delimiter).map(value => {
                // Remove surrounding quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                return value;
            });
            
            if (options.headersIncluded) {
                const row = {};
                headers.forEach((header, index) => {
                    let value = index < values.length ? values[index] : '';
                    if (options.trimValues) {
                        value = value.trim();
                    }
                    if (options.parseNumbers && !isNaN(value) && value !== '') {
                        value = Number(value);
                    }
                    row[header] = value;
                });
                result.push(row);
            } else {
                result.push(values.map(value => {
                    if (options.trimValues) {
                        value = value.trim();
                    }
                    if (options.parseNumbers && !isNaN(value) && value !== '') {
                        value = Number(value);
                    }
                    return value;
                }));
            }
        }

        return result;
    }

    // Convert CSV to JSON
    function convertToJSON() {
        try {
            const csv = elements.csvInput.value;
            if (!csv.trim()) {
                throw new Error('Please enter CSV data');
            }

            const options = {
                delimiter: elements.delimiter.value === 'custom' 
                    ? elements.customDelimiter.value 
                    : elements.delimiter.value,
                headersIncluded: elements.headersIncluded.checked,
                trimValues: elements.trimValues.checked,
                parseNumbers: elements.parseNumbers.checked
            };

            if (options.delimiter === '') {
                throw new Error('Please enter a delimiter');
            }

            const jsonData = parseCSV(csv, options);
            const spaces = parseInt(elements.formatSelect.value);
            const jsonString = JSON.stringify(jsonData, null, spaces);
            
            elements.jsonOutput.textContent = jsonString;
            elements.csvInput.classList.remove('error');
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();

        } catch (error) {
            elements.csvInput.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = error.message;
            elements.csvInput.parentElement.appendChild(errorMsg);
            elements.jsonOutput.textContent = '';
        }
    }

    // Event Listeners
    elements.delimiter.addEventListener('change', () => {
        elements.customDelimiter.style.display = 
            elements.delimiter.value === 'custom' ? 'block' : 'none';
    });

    elements.convertBtn.addEventListener('click', convertToJSON);

    elements.copyBtn.addEventListener('click', async () => {
        const json = elements.jsonOutput.textContent;
        if (!json) return;

        try {
            await navigator.clipboard.writeText(json);
            showToast('JSON copied to clipboard');
        } catch (err) {
            showToast('Failed to copy to clipboard', 'error');
        }
    });

    elements.downloadBtn.addEventListener('click', () => {
        const json = elements.jsonOutput.textContent;
        if (!json) return;

        const blob = new Blob([json], { type: 'application/json' });
        const link = createFileDownloadLink(blob, 'converted.json', 'Download JSON');
        link.click();
    });

    elements.pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            elements.csvInput.value = text;
        } catch (err) {
            showToast('Failed to paste from clipboard', 'error');
        }
    });

    elements.clearBtn.addEventListener('click', () => {
        elements.csvInput.value = '';
        elements.jsonOutput.textContent = '';
    });

    elements.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            elements.csvInput.value = e.target.result;
        };
        reader.readAsText(file);
    });

    elements.formatSelect.addEventListener('change', () => {
        if (elements.jsonOutput.textContent) {
            try {
                const data = JSON.parse(elements.jsonOutput.textContent);
                const spaces = parseInt(elements.formatSelect.value);
                elements.jsonOutput.textContent = JSON.stringify(data, null, spaces);
            } catch (err) {
                // Ignore parsing errors
            }
        }
    });
} 