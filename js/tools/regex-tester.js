// Regex Tester Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('regex-tester-content');
    if (!container) return;

    container.innerHTML = `
        <div class="regex-tester-container">
            <div class="input-section">
                <div class="regex-input-group">
                    <label for="regex-pattern">Regular Expression</label>
                    <div class="input-wrapper">
                        <span class="regex-delimiter">/</span>
                        <input type="text" id="regex-pattern" placeholder="Enter regex pattern">
                        <span class="regex-delimiter">/</span>
                        <input type="text" id="regex-flags" placeholder="flags" maxlength="5">
                    </div>
                    <div class="regex-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="multiline-input">
                            Multiline Input
                        </label>
                        <button class="btn" id="clear-btn">Clear All</button>
                    </div>
                </div>

                <div class="test-input-group">
                    <label for="test-input">Test String</label>
                    <textarea id="test-input" placeholder="Enter text to test against the regular expression"></textarea>
                </div>
            </div>

            <div class="results-section">
                <div class="matches-section">
                    <h3>Matches <span id="match-count">(0 found)</span></h3>
                    <div class="matches-container" id="matches-container">
                        <p class="no-matches">No matches found</p>
                    </div>
                </div>

                <div class="groups-section">
                    <h3>Capturing Groups</h3>
                    <div class="groups-container" id="groups-container">
                        <p class="no-groups">No capturing groups</p>
                    </div>
                </div>

                <div class="quick-reference">
                    <h3>Quick Reference</h3>
                    <div class="reference-grid">
                        <div class="reference-group">
                            <h4>Character Classes</h4>
                            <div class="reference-item">
                                <code>.</code>
                                <span>Any character except newline</span>
                            </div>
                            <div class="reference-item">
                                <code>\\w</code>
                                <span>Word character [A-Za-z0-9_]</span>
                            </div>
                            <div class="reference-item">
                                <code>\\d</code>
                                <span>Digit [0-9]</span>
                            </div>
                            <div class="reference-item">
                                <code>\\s</code>
                                <span>Whitespace character</span>
                            </div>
                        </div>
                        <div class="reference-group">
                            <h4>Quantifiers</h4>
                            <div class="reference-item">
                                <code>*</code>
                                <span>0 or more</span>
                            </div>
                            <div class="reference-item">
                                <code>+</code>
                                <span>1 or more</span>
                            </div>
                            <div class="reference-item">
                                <code>?</code>
                                <span>0 or 1</span>
                            </div>
                            <div class="reference-item">
                                <code>{n}</code>
                                <span>Exactly n times</span>
                            </div>
                        </div>
                        <div class="reference-group">
                            <h4>Groups & Ranges</h4>
                            <div class="reference-item">
                                <code>()</code>
                                <span>Capturing group</span>
                            </div>
                            <div class="reference-item">
                                <code>[]</code>
                                <span>Character class</span>
                            </div>
                            <div class="reference-item">
                                <code>|</code>
                                <span>Alternation</span>
                            </div>
                            <div class="reference-item">
                                <code>[^]</code>
                                <span>Negated character class</span>
                            </div>
                        </div>
                        <div class="reference-group">
                            <h4>Anchors</h4>
                            <div class="reference-item">
                                <code>^</code>
                                <span>Start of line</span>
                            </div>
                            <div class="reference-item">
                                <code>$</code>
                                <span>End of line</span>
                            </div>
                            <div class="reference-item">
                                <code>\\b</code>
                                <span>Word boundary</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .regex-tester-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--soft-box-shadow);
            }

            @media (max-width: 768px) {
                .regex-tester-container {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
            }

            .input-section, .results-section {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .regex-input-group, .test-input-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            label {
                color: var(--text-color);
                font-weight: 500;
            }

            .input-wrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: var(--bg-color);
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                padding: 0.5rem;
            }

            .regex-delimiter {
                color: var(--accent-color);
                font-weight: bold;
                font-size: 1.2rem;
            }

            #regex-pattern {
                flex: 1;
                border: none;
                background: transparent;
                color: var(--text-color);
                font-family: monospace;
                font-size: 1rem;
                padding: 0.25rem;
            }

            #regex-flags {
                width: 60px;
                border: none;
                background: transparent;
                color: var(--text-color);
                font-family: monospace;
                font-size: 1rem;
                padding: 0.25rem;
            }

            #regex-pattern:focus, #regex-flags:focus {
                outline: none;
            }

            .regex-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 0.5rem;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }

            #test-input {
                width: 100%;
                min-height: 150px;
                padding: 1rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-family: monospace;
                font-size: 1rem;
                resize: vertical;
            }

            #test-input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            .matches-section, .groups-section {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .matches-section h3, .groups-section h3 {
                color: var(--text-color);
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            #match-count {
                font-size: 0.9rem;
                color: var(--text-color);
                opacity: 0.7;
            }

            .matches-container, .groups-container {
                max-height: 200px;
                overflow-y: auto;
                padding: 0.5rem;
            }

            .match-item {
                padding: 0.75rem;
                background: var(--tool-card-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                margin-bottom: 0.5rem;
                font-family: monospace;
            }

            .match-item:last-child {
                margin-bottom: 0;
            }

            .group-item {
                display: flex;
                justify-content: space-between;
                padding: 0.75rem;
                background: var(--tool-card-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                margin-bottom: 0.5rem;
            }

            .group-name {
                font-weight: 500;
                color: var(--text-color);
            }

            .group-value {
                font-family: monospace;
                color: var(--accent-color);
            }

            .no-matches, .no-groups {
                color: var(--text-color);
                opacity: 0.7;
                text-align: center;
                padding: 1rem;
            }

            .quick-reference {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .quick-reference h3 {
                color: var(--text-color);
                margin-bottom: 1rem;
            }

            .reference-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
            }

            .reference-group h4 {
                color: var(--accent-color);
                margin-bottom: 0.75rem;
                font-size: 0.9rem;
            }

            .reference-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 0.5rem;
            }

            .reference-item code {
                background: var(--tool-card-bg);
                padding: 0.25rem 0.5rem;
                border-radius: var(--border-radius-lg);
                font-family: monospace;
                color: var(--accent-color);
                min-width: 40px;
                text-align: center;
            }

            .reference-item span {
                font-size: 0.9rem;
                color: var(--text-color);
            }

            .highlight {
                background-color: rgba(46, 204, 113, 0.2);
                border-bottom: 2px solid #2ecc71;
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
        pattern: document.getElementById('regex-pattern'),
        flags: document.getElementById('regex-flags'),
        multiline: document.getElementById('multiline-input'),
        testInput: document.getElementById('test-input'),
        clearBtn: document.getElementById('clear-btn'),
        matchCount: document.getElementById('match-count'),
        matchesContainer: document.getElementById('matches-container'),
        groupsContainer: document.getElementById('groups-container')
    };

    // Update matches and groups
    function updateResults() {
        try {
            const pattern = elements.pattern.value;
            const flags = elements.flags.value;
            const input = elements.testInput.value;

            if (!pattern) {
                elements.matchesContainer.innerHTML = '<p class="no-matches">No matches found</p>';
                elements.groupsContainer.innerHTML = '<p class="no-groups">No capturing groups</p>';
                elements.matchCount.textContent = '(0 found)';
                return;
            }

            const regex = new RegExp(pattern, flags);
            const matches = Array.from(input.matchAll(regex));
            
            if (matches.length === 0) {
                elements.matchesContainer.innerHTML = '<p class="no-matches">No matches found</p>';
                elements.groupsContainer.innerHTML = '<p class="no-groups">No capturing groups</p>';
                elements.matchCount.textContent = '(0 found)';
                return;
            }

            // Update matches
            elements.matchCount.textContent = `(${matches.length} found)`;
            elements.matchesContainer.innerHTML = matches
                .map((match, index) => `
                    <div class="match-item">
                        <strong>${index + 1}:</strong> ${match[0]}
                    </div>
                `)
                .join('');

            // Update groups
            if (matches[0].length > 1) {
                elements.groupsContainer.innerHTML = matches[0]
                    .slice(1)
                    .map((group, index) => `
                        <div class="group-item">
                            <span class="group-name">Group ${index + 1}</span>
                            <span class="group-value">${group}</span>
                        </div>
                    `)
                    .join('');
            } else {
                elements.groupsContainer.innerHTML = '<p class="no-groups">No capturing groups</p>';
            }

            // Remove error styling
            elements.pattern.parentElement.classList.remove('error');
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();

        } catch (error) {
            // Show error
            elements.pattern.parentElement.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = error.message;
            elements.pattern.parentElement.parentElement.appendChild(errorMsg);

            // Clear results
            elements.matchesContainer.innerHTML = '<p class="no-matches">Invalid regular expression</p>';
            elements.groupsContainer.innerHTML = '<p class="no-groups">No capturing groups</p>';
            elements.matchCount.textContent = '(0 found)';
        }
    }

    // Event listeners
    elements.pattern.addEventListener('input', updateResults);
    elements.flags.addEventListener('input', updateResults);
    elements.testInput.addEventListener('input', updateResults);
    elements.multiline.addEventListener('change', () => {
        elements.testInput.rows = elements.multiline.checked ? 10 : 5;
    });

    elements.clearBtn.addEventListener('click', () => {
        elements.pattern.value = '';
        elements.flags.value = '';
        elements.testInput.value = '';
        elements.multiline.checked = false;
        updateResults();
    });

    // Initial update
    updateResults();
} 