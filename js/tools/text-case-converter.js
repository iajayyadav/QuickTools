// Text Case Converter Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('text-case-converter-content');
    if (!container) return;

    container.innerHTML = `
        <div class="case-converter-container">
            <div class="input-section">
                <div class="input-group">
                    <label for="input-text">Enter Text</label>
                    <textarea id="input-text" placeholder="Type or paste your text here..." rows="6"></textarea>
                </div>

                <div class="actions-grid">
                    <button class="case-btn" data-case="upper">
                        <i class="fas fa-arrow-up"></i>
                        UPPERCASE
                    </button>
                    <button class="case-btn" data-case="lower">
                        <i class="fas fa-arrow-down"></i>
                        lowercase
                    </button>
                    <button class="case-btn" data-case="title">
                        <i class="fas fa-font"></i>
                        Title Case
                    </button>
                    <button class="case-btn" data-case="sentence">
                        <i class="fas fa-paragraph"></i>
                        Sentence case
                    </button>
                    <button class="case-btn" data-case="camel">
                        <i class="fas fa-code"></i>
                        camelCase
                    </button>
                    <button class="case-btn" data-case="pascal">
                        <i class="fas fa-code"></i>
                        PascalCase
                    </button>
                    <button class="case-btn" data-case="snake">
                        <i class="fas fa-minus"></i>
                        snake_case
                    </button>
                    <button class="case-btn" data-case="kebab">
                        <i class="fas fa-minus"></i>
                        kebab-case
                    </button>
                </div>
            </div>

            <div class="output-section">
                <div class="output-group">
                    <div class="output-header">
                        <label for="output-text">Converted Text</label>
                        <button id="copy-btn" class="copy-btn" title="Copy to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <textarea id="output-text" readonly rows="6"></textarea>
                </div>
            </div>

            <div class="info-box">
                <h4><i class="fas fa-info-circle"></i> About Text Case Converter</h4>
                <p>Convert your text between different cases:</p>
                <ul>
                    <li><strong>UPPERCASE:</strong> All characters in upper case</li>
                    <li><strong>lowercase:</strong> All characters in lower case</li>
                    <li><strong>Title Case:</strong> First Letter Of Each Word Capitalized</li>
                    <li><strong>Sentence case:</strong> First letter of each sentence capitalized</li>
                    <li><strong>camelCase:</strong> First word lowercase, following words capitalized</li>
                    <li><strong>PascalCase:</strong> All words capitalized without spaces</li>
                    <li><strong>snake_case:</strong> All lowercase with underscores</li>
                    <li><strong>kebab-case:</strong> All lowercase with hyphens</li>
                </ul>
            </div>
        </div>

        <style>
            .case-converter-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--soft-box-shadow);
            }

            .input-section, .output-section {
                margin-bottom: 2rem;
            }

            .input-group, .output-group {
                margin-bottom: 1.5rem;
            }

            label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--text-color);
                font-weight: 500;
            }

            textarea {
                width: 100%;
                padding: 1rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 1rem;
                line-height: 1.5;
                resize: vertical;
                transition: all 0.3s ease;
            }

            textarea:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            .actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }

            .case-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .case-btn:hover {
                background: var(--accent-color);
                color: white;
                border-color: var(--accent-color);
                transform: translateY(-2px);
            }

            .output-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .copy-btn {
                padding: 0.5rem;
                border: none;
                background: transparent;
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .copy-btn:hover {
                color: var(--accent-color);
                transform: scale(1.1);
            }

            .info-box {
                padding: 1.5rem;
                background: var(--bg-color);
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .info-box h4 {
                color: var(--accent-color);
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .info-box ul {
                list-style: none;
                padding-left: 1.5rem;
                margin: 0.5rem 0;
            }

            .info-box ul li {
                margin-bottom: 0.5rem;
                position: relative;
            }

            .info-box ul li::before {
                content: "•";
                color: var(--accent-color);
                position: absolute;
                left: -1.5rem;
            }

            @media (max-width: 768px) {
                .case-converter-container {
                    padding: 1rem;
                }

                .actions-grid {
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                }
            }
        </style>
    `;

    // Get DOM elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const copyBtn = document.getElementById('copy-btn');
    const caseButtons = document.querySelectorAll('.case-btn');

    // Case conversion functions
    const caseConverters = {
        upper: (text) => text.toUpperCase(),
        lower: (text) => text.toLowerCase(),
        title: (text) => {
            return text.replace(/\w\S*/g, (word) => {
                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            });
        },
        sentence: (text) => {
            return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
        },
        camel: (text) => {
            return text.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                .replace(/^[A-Z]/, chr => chr.toLowerCase());
        },
        pascal: (text) => {
            return text.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                .replace(/^[a-z]/, chr => chr.toUpperCase());
        },
        snake: (text) => {
            return text.toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '');
        },
        kebab: (text) => {
            return text.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-]/g, '');
        }
    };

    // Event listeners
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const caseType = button.dataset.case;
            const converter = caseConverters[caseType];
            
            if (converter && inputText.value) {
                outputText.value = converter(inputText.value);
                showToast('Text converted successfully');
            } else if (!inputText.value) {
                showToast('Please enter some text first', 'error');
            }
        });
    });

    copyBtn.addEventListener('click', () => {
        if (outputText.value) {
            navigator.clipboard.writeText(outputText.value)
                .then(() => showToast('Text copied to clipboard'))
                .catch(() => showToast('Failed to copy text', 'error'));
        } else {
            showToast('No text to copy', 'error');
        }
    });

    // Auto-resize textareas
    [inputText, outputText].forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
} 