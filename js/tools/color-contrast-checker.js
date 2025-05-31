// Color Contrast Checker Tool
import { showToast } from '../main.js';

export function init() {
    const container = document.getElementById('color-contrast-checker-content');
    if (!container) return;

    container.innerHTML = `
        <div class="contrast-checker-container">
            <div class="input-section">
                <h3>Color Selection</h3>
                <div class="color-inputs">
                    <div class="color-input-group">
                        <label for="foreground-color">Text Color</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="foreground-color" value="#000000">
                            <input type="text" id="foreground-hex" value="#000000" 
                                placeholder="e.g., #000000">
                        </div>
                    </div>
                    <div class="color-input-group">
                        <label for="background-color">Background Color</label>
                        <div class="color-input-wrapper">
                            <input type="color" id="background-color" value="#FFFFFF">
                            <input type="text" id="background-hex" value="#FFFFFF" 
                                placeholder="e.g., #FFFFFF">
                        </div>
                    </div>
                </div>

                <div class="preview-section">
                    <h4>Preview</h4>
                    <div class="preview-box" id="preview-box">
                        <p class="preview-text-large">Large Text Preview</p>
                        <p class="preview-text-small">This is a preview of smaller text to check readability</p>
                    </div>
                </div>
            </div>

            <div class="results-section">
                <h3>Contrast Results</h3>
                <div class="contrast-ratio-display">
                    <span class="ratio-label">Contrast Ratio</span>
                    <span class="ratio-value" id="contrast-ratio">21:1</span>
                </div>

                <div class="wcag-results">
                    <h4>WCAG 2.1 Compliance</h4>
                    <div class="compliance-grid">
                        <div class="compliance-item">
                            <span class="level">Level AA</span>
                            <div class="compliance-checks">
                                <div class="check-item">
                                    <span class="check-label">Normal Text</span>
                                    <span class="check-result" id="aa-normal">
                                        <i class="fas fa-check"></i> Pass
                                    </span>
                                </div>
                                <div class="check-item">
                                    <span class="check-label">Large Text</span>
                                    <span class="check-result" id="aa-large">
                                        <i class="fas fa-check"></i> Pass
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="compliance-item">
                            <span class="level">Level AAA</span>
                            <div class="compliance-checks">
                                <div class="check-item">
                                    <span class="check-label">Normal Text</span>
                                    <span class="check-result" id="aaa-normal">
                                        <i class="fas fa-check"></i> Pass
                                    </span>
                                </div>
                                <div class="check-item">
                                    <span class="check-label">Large Text</span>
                                    <span class="check-result" id="aaa-large">
                                        <i class="fas fa-check"></i> Pass
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="color-info">
                    <div class="color-values">
                        <h4>Color Values</h4>
                        <div class="color-formats" id="foreground-formats">
                            <h5>Text Color</h5>
                            <div class="format-grid">
                                <div class="format-item">
                                    <span class="format-label">HEX</span>
                                    <span class="format-value" id="fg-hex">#000000</span>
                                </div>
                                <div class="format-item">
                                    <span class="format-label">RGB</span>
                                    <span class="format-value" id="fg-rgb">rgb(0, 0, 0)</span>
                                </div>
                                <div class="format-item">
                                    <span class="format-label">HSL</span>
                                    <span class="format-value" id="fg-hsl">hsl(0, 0%, 0%)</span>
                                </div>
                            </div>
                        </div>
                        <div class="color-formats" id="background-formats">
                            <h5>Background Color</h5>
                            <div class="format-grid">
                                <div class="format-item">
                                    <span class="format-label">HEX</span>
                                    <span class="format-value" id="bg-hex">#FFFFFF</span>
                                </div>
                                <div class="format-item">
                                    <span class="format-label">RGB</span>
                                    <span class="format-value" id="bg-rgb">rgb(255, 255, 255)</span>
                                </div>
                                <div class="format-item">
                                    <span class="format-label">HSL</span>
                                    <span class="format-value" id="bg-hsl">hsl(0, 0%, 100%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box">
                    <h4><i class="fas fa-info-circle"></i> About WCAG Contrast Requirements</h4>
                    <div class="requirements-grid">
                        <div class="requirement-item">
                            <h5>Level AA Requirements:</h5>
                            <ul>
                                <li>Normal text: 4.5:1 minimum</li>
                                <li>Large text: 3:1 minimum</li>
                            </ul>
                        </div>
                        <div class="requirement-item">
                            <h5>Level AAA Requirements:</h5>
                            <ul>
                                <li>Normal text: 7:1 minimum</li>
                                <li>Large text: 4.5:1 minimum</li>
                            </ul>
                        </div>
                    </div>
                    <p class="info-note">Note: Large text is defined as 18pt+ or 14pt+ bold</p>
                </div>
            </div>
        </div>

        <style>
            .contrast-checker-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--soft-box-shadow);
            }

            @media (max-width: 768px) {
                .contrast-checker-container {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
            }

            .input-section, .results-section {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .color-inputs {
                display: grid;
                gap: 1.5rem;
            }

            .color-input-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .color-input-group label {
                color: var(--text-color);
                font-weight: 500;
            }

            .color-input-wrapper {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            input[type="color"] {
                width: 60px;
                height: 40px;
                padding: 0;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                cursor: pointer;
            }

            input[type="text"] {
                flex: 1;
                padding: 0.75rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                background: var(--bg-color);
                color: var(--text-color);
                font-family: monospace;
                font-size: 1rem;
            }

            input[type="text"]:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
            }

            .preview-section {
                margin-top: 1.5rem;
            }

            .preview-box {
                margin-top: 1rem;
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                text-align: center;
            }

            .preview-text-large {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 1rem;
            }

            .preview-text-small {
                font-size: 16px;
            }

            .contrast-ratio-display {
                background: var(--bg-color);
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                text-align: center;
                border: 2px solid var(--border-color);
            }

            .ratio-label {
                display: block;
                font-size: 1.1rem;
                color: var(--text-color);
                margin-bottom: 0.5rem;
            }

            .ratio-value {
                display: block;
                font-size: 2.5rem;
                font-weight: bold;
                color: var(--accent-color);
            }

            .wcag-results {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .compliance-grid {
                display: grid;
                gap: 1.5rem;
                margin-top: 1rem;
            }

            .compliance-item {
                padding: 1rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                border: 1px solid var(--border-color);
            }

            .level {
                display: block;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 0.75rem;
            }

            .compliance-checks {
                display: grid;
                gap: 0.5rem;
            }

            .check-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
            }

            .check-label {
                color: var(--text-color);
            }

            .check-result {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
            }

            .check-result.pass {
                color: #2ecc71;
            }

            .check-result.fail {
                color: #e74c3c;
            }

            .color-info {
                background: var(--bg-color);
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
            }

            .color-formats {
                margin-top: 1rem;
            }

            .color-formats h5 {
                color: var(--text-color);
                margin-bottom: 0.75rem;
            }

            .format-grid {
                display: grid;
                gap: 0.5rem;
            }

            .format-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                background: var(--tool-card-bg);
                border-radius: var(--border-radius-lg);
                border: 1px solid var(--border-color);
            }

            .format-label {
                color: var(--text-color);
                font-weight: 500;
            }

            .format-value {
                font-family: monospace;
                color: var(--accent-color);
            }

            .info-box {
                margin-top: 1.5rem;
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

            .requirements-grid {
                display: grid;
                gap: 1rem;
                margin: 1rem 0;
            }

            .requirement-item h5 {
                color: var(--text-color);
                margin-bottom: 0.5rem;
            }

            .requirement-item ul {
                list-style: none;
                padding-left: 1.5rem;
            }

            .requirement-item ul li {
                margin-bottom: 0.5rem;
                position: relative;
            }

            .requirement-item ul li::before {
                content: "•";
                color: var(--accent-color);
                position: absolute;
                left: -1.5rem;
            }

            .info-note {
                margin-top: 1rem;
                font-size: 0.9rem;
                color: var(--text-color);
                opacity: 0.8;
                font-style: italic;
            }
        </style>
    `;

    // Get all input elements
    const inputs = {
        foregroundColor: document.getElementById('foreground-color'),
        foregroundHex: document.getElementById('foreground-hex'),
        backgroundColor: document.getElementById('background-color'),
        backgroundHex: document.getElementById('background-hex')
    };

    // Get all display elements
    const elements = {
        previewBox: document.getElementById('preview-box'),
        contrastRatio: document.getElementById('contrast-ratio'),
        aaNormal: document.getElementById('aa-normal'),
        aaLarge: document.getElementById('aa-large'),
        aaaNormal: document.getElementById('aaa-normal'),
        aaaLarge: document.getElementById('aaa-large'),
        fgHex: document.getElementById('fg-hex'),
        fgRgb: document.getElementById('fg-rgb'),
        fgHsl: document.getElementById('fg-hsl'),
        bgHex: document.getElementById('bg-hex'),
        bgRgb: document.getElementById('bg-rgb'),
        bgHsl: document.getElementById('bg-hsl')
    };

    // Convert hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // Calculate relative luminance
    function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Calculate contrast ratio
    function getContrastRatio(l1, l2) {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    // Update color formats display
    function updateColorFormats(rgb, elements) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        elements.rgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        elements.hsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    // Check WCAG compliance
    function checkCompliance(ratio) {
        const results = {
            aaLarge: ratio >= 3,
            aaaNormal: ratio >= 7,
            aaaNormal: ratio >= 4.5,
            aaaLarge: ratio >= 4.5
        };

        Object.entries(results).forEach(([level, passes]) => {
            const element = elements[level];
            element.innerHTML = passes ? 
                '<i class="fas fa-check"></i> Pass' :
                '<i class="fas fa-times"></i> Fail';
            element.className = `check-result ${passes ? 'pass' : 'fail'}`;
        });
    }

    // Update all displays
    function updateDisplay() {
        // Get colors
        const fgColor = inputs.foregroundColor.value;
        const bgColor = inputs.backgroundColor.value;

        // Update hex inputs
        inputs.foregroundHex.value = fgColor;
        inputs.backgroundHex.value = bgColor;

        // Update preview
        elements.previewBox.style.color = fgColor;
        elements.previewBox.style.backgroundColor = bgColor;

        // Update hex displays
        elements.fgHex.textContent = fgColor;
        elements.bgHex.textContent = bgColor;

        // Calculate and update RGB and HSL
        const fgRgb = hexToRgb(fgColor);
        const bgRgb = hexToRgb(bgColor);

        updateColorFormats(fgRgb, {
            rgb: elements.fgRgb,
            hsl: elements.fgHsl
        });

        updateColorFormats(bgRgb, {
            rgb: elements.bgRgb,
            hsl: elements.bgHsl
        });

        // Calculate contrast ratio
        const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
        const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        const ratio = getContrastRatio(fgLuminance, bgLuminance);

        // Update contrast ratio display
        elements.contrastRatio.textContent = ratio.toFixed(2) + ':1';

        // Check and update compliance
        checkCompliance(ratio);
    }

    // Event listeners for color inputs
    inputs.foregroundColor.addEventListener('input', updateDisplay);
    inputs.backgroundColor.addEventListener('input', updateDisplay);

    // Event listeners for hex inputs
    inputs.foregroundHex.addEventListener('input', (e) => {
        const hex = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            inputs.foregroundColor.value = hex;
            updateDisplay();
        }
    });

    inputs.backgroundHex.addEventListener('input', (e) => {
        const hex = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            inputs.backgroundColor.value = hex;
            updateDisplay();
        }
    });

    // Initial display update
    updateDisplay();
} 