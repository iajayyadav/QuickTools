import { showToast } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('password-generator-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="pg-length">Password Length: <span id="pg-length-val">12</span></label>
            <input type="range" id="pg-length" value="12" min="4" max="128" style="width:100%;">
        </div>
        <div class="form-group">
            <label><input type="checkbox" id="pg-uppercase" checked> Include Uppercase (A-Z)</label><br>
            <label><input type="checkbox" id="pg-lowercase" checked> Include Lowercase (a-z)</label><br>
            <label><input type="checkbox" id="pg-numbers" checked> Include Numbers (0-9)</label><br>
            <label><input type="checkbox" id="pg-symbols" checked> Include Symbols (!@#...)</label>
        </div>
        <button id="pg-generate-btn" class="btn">Generate Password</button>
        <div class="form-group" style="margin-top: 1rem;">
            <label for="pg-result">Generated Password:</label>
            <input type="text" id="pg-result" readonly placeholder="Your password will appear here" 
                   style="background-color: var(--bg-color); border: 1px solid var(--header-bg);">
            <button id="pg-copy-btn" class="btn" style="margin-top: 0.5rem;">Copy to Clipboard</button>
        </div>
    `;

    const lengthInput = document.getElementById('pg-length');
    const lengthVal = document.getElementById('pg-length-val');
    const uppercaseCheck = document.getElementById('pg-uppercase');
    const lowercaseCheck = document.getElementById('pg-lowercase');
    const numbersCheck = document.getElementById('pg-numbers');
    const symbolsCheck = document.getElementById('pg-symbols');
    const generateBtn = document.getElementById('pg-generate-btn');
    const resultInput = document.getElementById('pg-result');
    const copyBtn = document.getElementById('pg-copy-btn');

    lengthInput.addEventListener('input', () => {
        lengthVal.textContent = lengthInput.value;
    });

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthInput.value);
        let charset = '';
        if (uppercaseCheck.checked) charset += charSets.uppercase;
        if (lowercaseCheck.checked) charset += charSets.lowercase;
        if (numbersCheck.checked) charset += charSets.numbers;
        if (symbolsCheck.checked) charset += charSets.symbols;

        if (charset === '') {
            showToast('Please select at least one character type.', 'error');
            resultInput.value = '';
            return;
        }

        let password = '';
        // Ensure at least one of each selected type
        const ensureChars = [];
        if (uppercaseCheck.checked) ensureChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
        if (lowercaseCheck.checked) ensureChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
        if (numbersCheck.checked) ensureChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
        if (symbolsCheck.checked) ensureChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);

        if (length < ensureChars.length) {
            showToast(`Password length must be at least ${ensureChars.length} to include all selected types.`, 'error');
            return;
        }

        // Add required characters
        password = ensureChars.join('');

        // Fill the rest with random characters
        for (let i = ensureChars.length; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Shuffle the password
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        resultInput.value = password;
        showToast('Password generated successfully!');
    });

    copyBtn.addEventListener('click', () => {
        if (!resultInput.value) {
            showToast('Generate a password first.', 'error');
            return;
        }

        navigator.clipboard.writeText(resultInput.value)
            .then(() => showToast('Password copied to clipboard!'))
            .catch(() => showToast('Failed to copy password.', 'error'));
    });
} 