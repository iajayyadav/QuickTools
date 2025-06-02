// Lorem Ipsum Generator Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('lorem-ipsum-content');
    if (!container) return;

    // Create a unique scope ID for styles
    const scopeId = 'lorem-' + Math.random().toString(36).substr(2, 9);
    container.setAttribute('data-scope', scopeId);

    container.innerHTML = `
        <div class="lorem-generator">
            <div class="options-panel">
                <div class="option-group">
                    <label>Output Type</label>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="type" value="paragraphs" checked>
                            Paragraphs
                        </label>
                        <label>
                            <input type="radio" name="type" value="sentences">
                            Sentences
                        </label>
                        <label>
                            <input type="radio" name="type" value="words">
                            Words
                        </label>
                    </div>
                </div>

                <div class="option-group">
                    <label for="amount">Amount</label>
                    <input type="number" id="amount" value="3" min="1" max="100">
                </div>

                <div class="option-group">
                    <label>Options</label>
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="startWithLorem" checked>
                            Start with "Lorem ipsum"
                        </label>
                        <label>
                            <input type="checkbox" id="randomize" checked>
                            Randomize words
                        </label>
                    </div>
                </div>

                <button id="generate" class="btn">Generate Text</button>
            </div>

            <div class="output-panel">
                <div class="output-header">
                    <h3>Generated Text</h3>
                    <div class="output-actions">
                        <button id="copy" class="btn-icon" title="Copy to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button id="download" class="btn-icon" title="Download as TXT">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                <div id="output" class="output-text"></div>
            </div>
        </div>

        <style>
            [data-scope="${scopeId}"] .lorem-generator {
                display: grid;
                grid-template-columns: 300px 1fr;
                gap: 2rem;
                max-width: 1200px;
                margin: 0 auto;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                padding: 2rem;
                box-shadow: var(--soft-box-shadow);
            }

            @media (max-width: 768px) {
                [data-scope="${scopeId}"] .lorem-generator {
                    grid-template-columns: 1fr;
                }
            }

            [data-scope="${scopeId}"] .options-panel {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            [data-scope="${scopeId}"] .option-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            [data-scope="${scopeId}"] .option-group > label {
                font-weight: 500;
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .radio-group,
            [data-scope="${scopeId}"] .checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            [data-scope="${scopeId}"] .radio-group label,
            [data-scope="${scopeId}"] .checkbox-group label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }

            [data-scope="${scopeId}"] input[type="number"] {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .output-panel {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            [data-scope="${scopeId}"] .output-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            [data-scope="${scopeId}"] .output-header h3 {
                margin: 0;
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .output-actions {
                display: flex;
                gap: 0.5rem;
            }

            [data-scope="${scopeId}"] .btn-icon {
                background: none;
                border: none;
                color: var(--accent-color);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: var(--border-radius-lg);
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .btn-icon:hover {
                background: var(--tool-card-bg);
            }

            [data-scope="${scopeId}"] .output-text {
                background: var(--tool-card-bg);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                min-height: 200px;
                max-height: 600px;
                overflow-y: auto;
                white-space: pre-wrap;
                line-height: 1.6;
            }
        </style>
    `;

    // Lorem Ipsum word bank
    const words = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
        'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
        'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur',
        'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
        'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    // Get DOM elements
    const generateBtn = container.querySelector('#generate');
    const copyBtn = container.querySelector('#copy');
    const downloadBtn = container.querySelector('#download');
    const outputDiv = container.querySelector('#output');
    const amountInput = container.querySelector('#amount');
    const startWithLoremCheck = container.querySelector('#startWithLorem');
    const randomizeCheck = container.querySelector('#randomize');
    const typeInputs = container.querySelectorAll('input[name="type"]');

    // Helper functions
    function getRandomWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function capitalizeFirst(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function generateWords(count, startWithLorem = false) {
        let result = [];
        if (startWithLorem) {
            result.push('lorem', 'ipsum');
            count -= 2;
        }
        for (let i = 0; i < count; i++) {
            result.push(getRandomWord());
        }
        return result;
    }

    function generateSentence(wordCount, startWithLorem = false) {
        const words = generateWords(wordCount, startWithLorem);
        return capitalizeFirst(words.join(' ')) + '.';
    }

    function generateParagraph(sentenceCount, startWithLorem = false) {
        const sentences = [];
        for (let i = 0; i < sentenceCount; i++) {
            const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
            sentences.push(generateSentence(wordCount, i === 0 && startWithLorem));
        }
        return sentences.join(' ');
    }

    function generateText() {
        const amount = parseInt(amountInput.value) || 1;
        const type = Array.from(typeInputs).find(input => input.checked).value;
        const startWithLorem = startWithLoremCheck.checked;
        const randomize = randomizeCheck.checked;

        let result = '';

        switch (type) {
            case 'words':
                result = generateWords(amount, startWithLorem).join(' ');
                break;
            case 'sentences':
                for (let i = 0; i < amount; i++) {
                    const wordCount = Math.floor(Math.random() * 10) + 5;
                    result += generateSentence(wordCount, i === 0 && startWithLorem) + ' ';
                }
                break;
            case 'paragraphs':
                for (let i = 0; i < amount; i++) {
                    const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-6 sentences per paragraph
                    result += generateParagraph(sentenceCount, i === 0 && startWithLorem) + '\n\n';
                }
                break;
        }

        if (randomize) {
            result = result.split(' ')
                .sort(() => Math.random() - 0.5)
                .join(' ');
        }

        outputDiv.textContent = result.trim();
    }

    // Event listeners
    generateBtn.addEventListener('click', generateText);

    copyBtn.addEventListener('click', () => {
        const text = outputDiv.textContent;
        if (!text) {
            showToast('No text to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => showToast('Text copied to clipboard!'))
            .catch(() => showToast('Failed to copy text', 'error'));
    });

    downloadBtn.addEventListener('click', () => {
        const text = outputDiv.textContent;
        if (!text) {
            showToast('No text to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lorem-ipsum.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Text downloaded!');
    });

    // Generate initial text
    generateText();
} 