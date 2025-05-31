// Color Picker Tool
import { showToast } from '../main.js';

let colorPicker;

export function init() {
    console.log('Color Picker Tool: Initializing...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initColorPicker);
    } else {
        initColorPicker();
    }
}

function initColorPicker() {
    try {
        console.log('Color Picker Tool: Creating instance...');
        colorPicker = new ColorPicker();
        
        // Verify initialization
        if (!colorPicker || Object.keys(colorPicker.elements).length === 0) {
            console.error('Color Picker Tool: Failed to initialize properly');
            showToast('Failed to initialize color picker', 'error');
            return;
        }
        
        console.log('Color Picker Tool: Successfully initialized');
    } catch (error) {
        console.error('Color Picker Tool: Initialization error:', error);
        showToast('Error initializing color picker', 'error');
    }
}

class ColorPicker {
    constructor() {
        this.elements = {};
        console.log('ColorPicker: Initializing...');
        this.initializeUI();
        
        // Debug log for element references
        console.log('ColorPicker: Elements after initialization:', {
            colorPicker: !!this.elements.colorPicker,
            colorPreview: !!this.elements.colorPreview,
            hexValue: !!this.elements.hexValue,
            rgbValue: !!this.elements.rgbValue,
            hslValue: !!this.elements.hslValue,
            hueSlider: !!this.elements.hueSlider,
            saturationSlider: !!this.elements.saturationSlider,
            lightnessSlider: !!this.elements.lightnessSlider,
            alphaSlider: !!this.elements.alphaSlider
        });

        if (Object.keys(this.elements).length === 0) {
            console.error('ColorPicker: UI initialization failed - no elements found');
            return;
        }
        
        this.setupEventListeners();
        this.loadSavedColors();
        
        // Initialize with default color
        this.setInitialColor('#00b894');
    }

    setInitialColor(color) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return;

        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Set initial values
        this.elements.colorPicker.value = color;
        this.elements.hueSlider.value = Math.round(hsl.h);
        this.elements.saturationSlider.value = Math.round(hsl.s);
        this.elements.lightnessSlider.value = Math.round(hsl.l);
        this.elements.alphaSlider.value = 100;

        // Update display
        this.updateFromSliders();
    }

    initializeUI() {
        // Get the tool-specific content container
        const container = document.getElementById('color-picker-content');
        if (!container) {
            console.error('ColorPicker: Could not find color-picker-content container');
            return;
        }

        // Create a unique ID for scoped styling
        const scopeId = 'color-picker-' + Math.random().toString(36).substr(2, 9);
        container.setAttribute('data-scope', scopeId);

        // Clear any existing content
        container.innerHTML = `
            <div class="cp-container">
                <div class="cp-grid">
                <!-- Color Preview Section -->
                    <div class="cp-preview-section">
                        <div class="cp-preview">
                            <div id="colorPreview" class="cp-preview-box"></div>
                        <input type="color" id="colorPicker" value="#00b894">
                    </div>
                        <div class="cp-adjustments">
                            <div class="cp-adjustment-group">
                            <label for="hueSlider">Hue</label>
                            <input type="range" id="hueSlider" min="0" max="360" value="0">
                                <span class="cp-value-display">0°</span>
                        </div>
                            <div class="cp-adjustment-group">
                            <label for="saturationSlider">Saturation</label>
                            <input type="range" id="saturationSlider" min="0" max="100" value="100">
                                <span class="cp-value-display">100%</span>
                        </div>
                            <div class="cp-adjustment-group">
                            <label for="lightnessSlider">Lightness</label>
                            <input type="range" id="lightnessSlider" min="0" max="100" value="50">
                                <span class="cp-value-display">50%</span>
                        </div>
                            <div class="cp-adjustment-group">
                            <label for="alphaSlider">Opacity</label>
                            <input type="range" id="alphaSlider" min="0" max="100" value="100">
                                <span class="cp-value-display">100%</span>
                        </div>
                    </div>
                </div>

                <!-- Color Values Section -->
                    <div class="cp-values-section">
                    <h3>Color Values</h3>
                        <div class="cp-values">
                            <div class="cp-value-group">
                            <label>HEX</label>
                                <div class="cp-copy-input">
                                <input type="text" id="hexValue" readonly>
                                    <button class="cp-copy-btn" data-clipboard="hexValue">
                                        <span class="cp-tooltip">Copy</span>
                                    📋
                                </button>
                            </div>
                        </div>
                            <div class="cp-value-group">
                            <label>RGB</label>
                                <div class="cp-copy-input">
                                <input type="text" id="rgbValue" readonly>
                                    <button class="cp-copy-btn" data-clipboard="rgbValue">
                                        <span class="cp-tooltip">Copy</span>
                                    📋
                                </button>
                            </div>
                        </div>
                            <div class="cp-value-group">
                            <label>HSL</label>
                                <div class="cp-copy-input">
                                <input type="text" id="hslValue" readonly>
                                    <button class="cp-copy-btn" data-clipboard="hslValue">
                                        <span class="cp-tooltip">Copy</span>
                                    📋
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Saved Colors -->
                        <div class="cp-palette">
                        <h3>Saved Colors</h3>
                            <div id="savedColors" class="cp-saved-colors"></div>
                            <button id="saveColor" class="cp-save-btn">Save Color</button>
                    </div>
                </div>
            </div>

            <!-- Color Harmonies -->
                <div class="cp-harmonies">
                <h3>Color Harmonies</h3>
                    <div class="cp-harmony-grid">
                        <div class="cp-harmony-group">
                         <h4>Complementary</h4>
                            <div id="complementaryColors" class="cp-harmony-colors"></div>
                     </div>
                        <div class="cp-harmony-group">
                         <h4>Analogous</h4>
                            <div id="analogousColors" class="cp-harmony-colors"></div>
                     </div>
                        <div class="cp-harmony-group">
                         <h4>Triadic</h4>
                            <div id="triadicColors" class="cp-harmony-colors"></div>
                        </div>
                     </div>
                 </div>
             </div>

            <style>
                [data-scope="${scopeId}"] .cp-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                [data-scope="${scopeId}"] .cp-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                [data-scope="${scopeId}"] .cp-preview-section {
                    background: var(--tool-card-bg);
                    padding: 1.5rem;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--soft-box-shadow);
                }

                [data-scope="${scopeId}"] .cp-preview {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                [data-scope="${scopeId}"] .cp-preview-box {
                    flex: 1;
                    height: 100px;
                    border-radius: var(--border-radius-lg);
                    border: 2px solid var(--border-color);
                    background: #00b894;
                }

                [data-scope="${scopeId}"] .cp-preview input[type="color"] {
                    width: 60px;
                    height: 100px;
                    padding: 0;
                    border: none;
                    border-radius: var(--border-radius-lg);
                    cursor: pointer;
                }

                [data-scope="${scopeId}"] .cp-adjustments {
                    display: grid;
                    gap: 1rem;
                }

                [data-scope="${scopeId}"] .cp-adjustment-group {
                    display: grid;
                    grid-template-columns: 80px 1fr 50px;
                    align-items: center;
                    gap: 1rem;
                }

                [data-scope="${scopeId}"] .cp-adjustment-group label {
                    color: var(--text-color);
                    font-size: 0.9rem;
                }

                [data-scope="${scopeId}"] .cp-adjustment-group input[type="range"] {
                    width: 100%;
                    height: 6px;
                    -webkit-appearance: none;
                    background: var(--border-color);
                    border-radius: 3px;
                    outline: none;
                }

                [data-scope="${scopeId}"] .cp-adjustment-group input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    background: var(--accent-color);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                [data-scope="${scopeId}"] .cp-adjustment-group input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                [data-scope="${scopeId}"] .cp-value-display {
                    color: var(--text-color);
                    font-size: 0.9rem;
                    text-align: right;
                }

                [data-scope="${scopeId}"] .cp-values-section {
                    background: var(--tool-card-bg);
                    padding: 1.5rem;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--soft-box-shadow);
                }

                [data-scope="${scopeId}"] .cp-values-section h3 {
                    color: var(--text-color);
                    margin-bottom: 1rem;
                }

                [data-scope="${scopeId}"] .cp-values {
                    display: grid;
                    gap: 1rem;
                }

                [data-scope="${scopeId}"] .cp-value-group {
                    display: grid;
                    gap: 0.5rem;
                }

                [data-scope="${scopeId}"] .cp-value-group label {
                    color: var(--text-color);
                    font-size: 0.9rem;
                }

                [data-scope="${scopeId}"] .cp-copy-input {
                    display: flex;
                    gap: 0.5rem;
                }

                [data-scope="${scopeId}"] .cp-copy-input input {
                    flex: 1;
                    padding: 0.5rem;
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius-lg);
                    background: var(--bg-color);
                    color: var(--text-color);
                    font-family: monospace;
                }

                [data-scope="${scopeId}"] .cp-copy-btn {
                    padding: 0.5rem;
                    border: none;
                    border-radius: var(--border-radius-lg);
                    background: var(--accent-color);
                    color: white;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                }

                [data-scope="${scopeId}"] .cp-copy-btn:hover {
                    transform: translateY(-2px);
                }

                [data-scope="${scopeId}"] .cp-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 0.25rem 0.5rem;
                    background: var(--text-color);
                    color: var(--bg-color);
                    font-size: 0.8rem;
                    border-radius: var(--border-radius-lg);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                [data-scope="${scopeId}"] .cp-copy-btn:hover .cp-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(-5px);
                }

                [data-scope="${scopeId}"] .cp-palette {
                    margin-top: 2rem;
                }

                [data-scope="${scopeId}"] .cp-saved-colors {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    min-height: 40px;
                    padding: 0.5rem;
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius-lg);
                }

                [data-scope="${scopeId}"] .cp-saved-color {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: var(--border-radius-lg);
                    border: 2px solid var(--border-color);
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                [data-scope="${scopeId}"] .cp-saved-color:hover {
                    transform: scale(1.1);
                }

                [data-scope="${scopeId}"] .cp-save-btn {
                    width: 100%;
                    padding: 0.75rem;
                    border: none;
                    border-radius: var(--border-radius-lg);
                    background: var(--accent-color);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                [data-scope="${scopeId}"] .cp-save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 184, 148, 0.2);
                }

                [data-scope="${scopeId}"] .cp-harmonies {
                    background: var(--tool-card-bg);
                    padding: 1.5rem;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--soft-box-shadow);
                }

                [data-scope="${scopeId}"] .cp-harmonies h3 {
                    color: var(--text-color);
                    margin-bottom: 1rem;
                }

                [data-scope="${scopeId}"] .cp-harmony-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                [data-scope="${scopeId}"] .cp-harmony-group h4 {
                    color: var(--text-color);
                    margin-bottom: 0.75rem;
                    font-size: 0.9rem;
                }

                [data-scope="${scopeId}"] .cp-harmony-colors {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
                    gap: 0.5rem;
            }

                [data-scope="${scopeId}"] .cp-harmony-color {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: var(--border-radius-lg);
                    border: 2px solid var(--border-color);
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                [data-scope="${scopeId}"] .cp-harmony-color:hover {
                    transform: scale(1.1);
                }

                @media (max-width: 768px) {
                    [data-scope="${scopeId}"] .cp-container {
                        padding: 1rem;
                    }

                    [data-scope="${scopeId}"] .cp-grid {
                        grid-template-columns: 1fr;
                    }

                    [data-scope="${scopeId}"] .cp-preview {
                        flex-direction: column;
                    }

                    [data-scope="${scopeId}"] .cp-preview input[type="color"] {
                        width: 100%;
                        height: 60px;
                    }

                    [data-scope="${scopeId}"] .cp-harmony-grid {
                        grid-template-columns: 1fr;
        }
                }
            </style>
        `;

        // Store elements
        this.elements = {
            colorPicker: document.getElementById('colorPicker'),
            colorPreview: document.getElementById('colorPreview'),
            hexValue: document.getElementById('hexValue'),
            rgbValue: document.getElementById('rgbValue'),
            hslValue: document.getElementById('hslValue'),
            hueSlider: document.getElementById('hueSlider'),
            saturationSlider: document.getElementById('saturationSlider'),
            lightnessSlider: document.getElementById('lightnessSlider'),
            alphaSlider: document.getElementById('alphaSlider'),
            savedColors: document.getElementById('savedColors'),
            saveColorBtn: document.getElementById('saveColor'),
            complementaryColors: document.getElementById('complementaryColors'),
            analogousColors: document.getElementById('analogousColors'),
            triadicColors: document.getElementById('triadicColors')
        };

        // Verify all elements exist
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`ColorPicker: Missing element: ${key}`);
            }
        }
    }

    setupEventListeners() {
        // Color picker input
        this.elements.colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            this.updateColor(color);
        });

        // Sliders
        const sliders = {
            hue: this.elements.hueSlider,
            saturation: this.elements.saturationSlider,
            lightness: this.elements.lightnessSlider,
            alpha: this.elements.alphaSlider
        };

        Object.entries(sliders).forEach(([type, slider]) => {
            slider.addEventListener('input', () => {
                this.updateFromSliders();
                });
        });

        // Copy buttons
        document.querySelectorAll('.cp-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById(btn.dataset.clipboard);
                input.select();
                document.execCommand('copy');
                
                const tooltip = btn.querySelector('.cp-tooltip');
                if (tooltip) {
                    const originalText = tooltip.textContent;
                    tooltip.textContent = 'Copied!';
                    setTimeout(() => {
                        tooltip.textContent = originalText;
                    }, 1000);
                }
                
                showToast('Color value copied to clipboard');
            });
        });

        // Save color button
            this.elements.saveColorBtn.addEventListener('click', () => {
            const color = this.elements.colorPicker.value;
            this.saveColor(color);
            });

        // Harmony and saved color clicks using event delegation
        document.addEventListener('click', (e) => {
            const colorElement = e.target.closest('.cp-harmony-color, .cp-saved-color');
            if (colorElement) {
                const color = colorElement.dataset.color;
                if (color) {
                    this.updateColor(color);
                    this.elements.colorPicker.value = color;
                }
            }
        });
    }

    updateColor(color) {
        // Update preview
        this.elements.colorPreview.style.backgroundColor = color;

        // Update values
        this.elements.hexValue.value = color.toUpperCase();

        // Convert to RGB
        const rgb = this.hexToRgb(color);
        if (!rgb) return;
        
        this.elements.rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        // Convert to HSL
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.elements.hslValue.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        
        // Update sliders
        this.elements.hueSlider.value = Math.round(hsl.h);
        this.elements.saturationSlider.value = Math.round(hsl.s);
        this.elements.lightnessSlider.value = Math.round(hsl.l);
        
        // Update value displays
        this.updateValueDisplays(hsl.h, hsl.s, hsl.l, 100);
        
        // Update harmonies
        this.updateHarmonies(hsl);
    }

    updateFromSliders() {
        const h = parseInt(this.elements.hueSlider.value);
        const s = parseInt(this.elements.saturationSlider.value);
        const l = parseInt(this.elements.lightnessSlider.value);
        const a = parseInt(this.elements.alphaSlider.value);

        // Convert HSL to RGB
        const rgb = this.hslToRgb(h, s, l);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

        // Update color picker and preview
            this.elements.colorPicker.value = hex;
        this.elements.colorPreview.style.backgroundColor = hex;
        
        // Update text values
        this.elements.hexValue.value = hex.toUpperCase();
        this.elements.rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.elements.hslValue.value = `hsl(${h}, ${s}%, ${l}%)`;

        // Update value displays
        this.updateValueDisplays(h, s, l, a);

        // Update harmonies
        this.updateHarmonies({ h, s, l });
    }

    updateValueDisplays(h, s, l, a) {
        const updateDisplay = (slider, value, unit) => {
            const display = slider.nextElementSibling;
            if (display && display.classList.contains('cp-value-display')) {
                display.textContent = value + unit;
            }
        };

        updateDisplay(this.elements.hueSlider, Math.round(h), '°');
        updateDisplay(this.elements.saturationSlider, Math.round(s), '%');
        updateDisplay(this.elements.lightnessSlider, Math.round(l), '%');
        updateDisplay(this.elements.alphaSlider, Math.round(a), '%');
    }

    updateHarmonies(hsl) {
        // Complementary
        const complementary = [(hsl.h + 180) % 360];
        this.elements.complementaryColors.innerHTML = this.createHarmonySwatches(complementary.map(h => ({ h, s: hsl.s, l: hsl.l })));

        // Analogous
        const analogous = [(hsl.h - 30 + 360) % 360, (hsl.h + 30) % 360];
        this.elements.analogousColors.innerHTML = this.createHarmonySwatches(analogous.map(h => ({ h, s: hsl.s, l: hsl.l })));

        // Triadic
        const triadic = [(hsl.h + 120) % 360, (hsl.h + 240) % 360];
        this.elements.triadicColors.innerHTML = this.createHarmonySwatches(triadic.map(h => ({ h, s: hsl.s, l: hsl.l })));
    }

    createHarmonySwatches(colors) {
        return colors.map(color => {
            const rgb = this.hslToRgb(color.h, color.s, color.l);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            return `<div class="cp-harmony-color" style="background-color: ${hex}" title="${hex}" data-color="${hex}"></div>`;
        }).join('');
    }

    saveColor(color) {
        const savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
        if (!savedColors.includes(color)) {
            savedColors.push(color);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            this.loadSavedColors();
            showToast('Color saved to palette');
        }
    }

    loadSavedColors() {
        const savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
        this.elements.savedColors.innerHTML = savedColors.map(color => 
            `<div class="cp-saved-color" style="background-color: ${color}" title="${color}" data-color="${color}"></div>`
        ).join('');
    }

    // Color conversion utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    rgbToHsl(r, g, b) {
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
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

// Initialize color picker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});