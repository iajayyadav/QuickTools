import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('password-generator-content');
    if (!container) return;

    // Create a unique ID for scoped styling
    const scopeId = 'password-generator-' + Math.random().toString(36).substr(2, 9);
    container.setAttribute('data-scope', scopeId);

    container.innerHTML = `
        <div class="pg-container">
            <div class="pg-generator-section">
                <div class="pg-password-display">
                    <input type="text" id="passwordOutput" readonly>
                    <button id="copyBtn" class="pg-icon-btn" title="Copy password">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button id="regenerateBtn" class="pg-icon-btn" title="Generate new password">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>

                <div class="pg-strength-meter">
                    <div class="pg-strength-bar">
                        <div id="strengthIndicator" class="pg-strength-indicator"></div>
                    </div>
                    <span id="strengthText" class="pg-strength-text">Password Strength</span>
                </div>

                <div class="pg-options-section">
                    <div class="pg-length-control">
                        <label for="passwordLength">Password Length: <span id="lengthValue">16</span></label>
                        <div class="pg-slider-container">
                            <input type="range" id="passwordLength" min="8" max="64" value="16">
                            <div class="pg-slider-markers">
                                <span>8</span>
                                <span>24</span>
                                <span>40</span>
                                <span>64</span>
                            </div>
                        </div>
                    </div>

                    <div class="pg-character-options">
                        <label class="pg-checkbox-label">
                            <input type="checkbox" id="uppercase" checked>
                            <span class="pg-checkbox-text">Uppercase Letters (A-Z)</span>
                        </label>
                        <label class="pg-checkbox-label">
                            <input type="checkbox" id="lowercase" checked>
                            <span class="pg-checkbox-text">Lowercase Letters (a-z)</span>
                        </label>
                        <label class="pg-checkbox-label">
                            <input type="checkbox" id="numbers" checked>
                            <span class="pg-checkbox-text">Numbers (0-9)</span>
                        </label>
                        <label class="pg-checkbox-label">
                            <input type="checkbox" id="symbols" checked>
                            <span class="pg-checkbox-text">Special Characters (!@#$%^&*)</span>
                        </label>
                        <label class="pg-checkbox-label">
                            <input type="checkbox" id="excludeSimilar">
                            <span class="pg-checkbox-text">Exclude Similar Characters (l, 1, I, 0, O)</span>
                        </label>
                        <label class="pg-checkbox-label">
                            <input type="checkbox" id="excludeAmbiguous">
                            <span class="pg-checkbox-text">Exclude Ambiguous Characters ({}, [], (), /\\)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="pg-info-section">
                <h3><i class="fas fa-shield-alt"></i> Password Security Tips</h3>
                <ul class="pg-security-tips">
                    <li>Use a minimum of 12 characters for better security</li>
                    <li>Mix uppercase, lowercase, numbers, and symbols</li>
                    <li>Avoid using personal information</li>
                    <li>Use different passwords for different accounts</li>
                    <li>Consider using a password manager</li>
                </ul>
            </div>
        </div>

        <style>
            [data-scope="${scopeId}"] .pg-container {
                max-width: 800px;
                margin: 0 auto;
                display: grid;
                gap: 2rem;
            }

            [data-scope="${scopeId}"] .pg-generator-section {
                background: var(--tool-card-bg);
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
                box-shadow: var(--soft-box-shadow);
            }

            [data-scope="${scopeId}"] .pg-password-display {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }

            [data-scope="${scopeId}"] .pg-password-display input {
                flex: 1;
                padding: 1rem;
                font-family: monospace;
                font-size: 1.2rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .pg-password-display input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            [data-scope="${scopeId}"] .pg-icon-btn {
                padding: 0.5rem;
                width: 42px;
                height: 42px;
                border: none;
                border-radius: var(--border-radius-lg);
                background: var(--accent-color);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .pg-icon-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 184, 148, 0.2);
            }

            [data-scope="${scopeId}"] .pg-strength-meter {
                margin-bottom: 2rem;
            }

            [data-scope="${scopeId}"] .pg-strength-bar {
                height: 8px;
                background: var(--border-color);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            [data-scope="${scopeId}"] .pg-strength-indicator {
                height: 100%;
                width: 0;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] .pg-strength-indicator.very-weak { width: 20%; background: #e74c3c; }
            [data-scope="${scopeId}"] .pg-strength-indicator.weak { width: 40%; background: #f39c12; }
            [data-scope="${scopeId}"] .pg-strength-indicator.medium { width: 60%; background: #f1c40f; }
            [data-scope="${scopeId}"] .pg-strength-indicator.strong { width: 80%; background: #2ecc71; }
            [data-scope="${scopeId}"] .pg-strength-indicator.very-strong { width: 100%; background: #27ae60; }

            [data-scope="${scopeId}"] .pg-strength-text {
                font-size: 0.9rem;
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .pg-length-control {
                margin-bottom: 2rem;
            }

            [data-scope="${scopeId}"] .pg-slider-container {
                position: relative;
                padding: 1rem 0;
            }

            [data-scope="${scopeId}"] input[type="range"] {
                width: 100%;
                height: 6px;
                -webkit-appearance: none;
                background: var(--border-color);
                border-radius: 3px;
                outline: none;
            }

            [data-scope="${scopeId}"] input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: var(--accent-color);
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            [data-scope="${scopeId}"] input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            [data-scope="${scopeId}"] .pg-slider-markers {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                color: var(--text-color);
                font-size: 0.8rem;
            }

            [data-scope="${scopeId}"] .pg-character-options {
                display: grid;
                gap: 1rem;
            }

            [data-scope="${scopeId}"] .pg-checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
            }

            [data-scope="${scopeId}"] .pg-checkbox-label input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: var(--accent-color);
            }

            [data-scope="${scopeId}"] .pg-checkbox-text {
                color: var(--text-color);
                font-size: 0.95rem;
            }

            [data-scope="${scopeId}"] .pg-info-section {
                background: var(--tool-card-bg);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: var(--card-border);
            }

            [data-scope="${scopeId}"] .pg-info-section h3 {
                color: var(--accent-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            [data-scope="${scopeId}"] .pg-security-tips {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            [data-scope="${scopeId}"] .pg-security-tips li {
                padding: 0.5rem 0;
                color: var(--text-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            [data-scope="${scopeId}"] .pg-security-tips li::before {
                content: '•';
                color: var(--accent-color);
            }

            @media (max-width: 768px) {
                [data-scope="${scopeId}"] .pg-generator-section {
                    padding: 1.5rem;
                }

                [data-scope="${scopeId}"] .pg-password-display {
                    flex-direction: column;
                }

                [data-scope="${scopeId}"] .pg-icon-btn {
                    width: 100%;
                }
            }
        </style>
    `;

    // Get DOM elements
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');

    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
        similar: 'il1IoO0',
        ambiguous: '{}[]()/\\\'"`,.'
    };

    // Generate password function
    function generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const useUppercase = document.getElementById('uppercase').checked;
        const useLowercase = document.getElementById('lowercase').checked;
        const useNumbers = document.getElementById('numbers').checked;
        const useSymbols = document.getElementById('symbols').checked;
        const excludeSimilar = document.getElementById('excludeSimilar').checked;
        const excludeAmbiguous = document.getElementById('excludeAmbiguous').checked;

        let charset = '';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (excludeSimilar) {
            charset = charset.replace(/[Il1O0]/g, '');
        }
        if (excludeAmbiguous) {
            charset = charset.replace(/[{}[\]()\/\\]/g, '');
        }

        if (!charset) {
            showToast('Please select at least one character type', 'error');
            return '';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return password;
    }

    // Update strength meter
    function updateStrengthMeter(password) {
        const strengthIndicator = document.getElementById('strengthIndicator');
        const strengthText = document.getElementById('strengthText');

        if (!password) {
            strengthIndicator.className = 'pg-strength-indicator';
            strengthText.textContent = 'Password Strength';
            return;
        }

        let strength = 0;
        let variety = 0;

        // Length check
        if (password.length >= 12) strength++;
        if (password.length >= 16) strength++;

        // Character variety check
        if (/[A-Z]/.test(password)) variety++;
        if (/[a-z]/.test(password)) variety++;
        if (/[0-9]/.test(password)) variety++;
        if (/[^A-Za-z0-9]/.test(password)) variety++;

        strength += variety;

        strengthIndicator.className = 'pg-strength-indicator';
        switch(strength) {
            case 1:
                strengthIndicator.classList.add('very-weak');
                strengthText.textContent = 'Very Weak';
                break;
            case 2:
                strengthIndicator.classList.add('weak');
                strengthText.textContent = 'Weak';
                break;
            case 3:
                strengthIndicator.classList.add('medium');
                strengthText.textContent = 'Medium';
                break;
            case 4:
                strengthIndicator.classList.add('strong');
                strengthText.textContent = 'Strong';
                break;
            case 5:
            case 6:
                strengthIndicator.classList.add('very-strong');
                strengthText.textContent = 'Very Strong';
                break;
        }
    }

    // Copy password
    function copyPassword() {
        const passwordOutput = document.getElementById('passwordOutput');
        if (!passwordOutput.value) {
            showToast('Generate a password first', 'error');
            return;
        }

        navigator.clipboard.writeText(passwordOutput.value)
            .then(() => showToast('Password copied to clipboard'))
            .catch(() => showToast('Failed to copy password', 'error'));
    }

    // Event listeners
    document.getElementById('passwordLength').addEventListener('input', (e) => {
        document.getElementById('lengthValue').textContent = e.target.value;
        const password = generatePassword();
        document.getElementById('passwordOutput').value = password;
        updateStrengthMeter(password);
    });

    document.getElementById('copyBtn').addEventListener('click', copyPassword);

    document.getElementById('regenerateBtn').addEventListener('click', () => {
        const password = generatePassword();
        document.getElementById('passwordOutput').value = password;
        updateStrengthMeter(password);
    });

    // Add event listeners to all checkboxes
    const checkboxes = document.querySelectorAll('.pg-checkbox-label input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const password = generatePassword();
            document.getElementById('passwordOutput').value = password;
            updateStrengthMeter(password);
        });
    });

    // Generate initial password
    const initialPassword = generatePassword();
    document.getElementById('passwordOutput').value = initialPassword;
    updateStrengthMeter(initialPassword);
} 