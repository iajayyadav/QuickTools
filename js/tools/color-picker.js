// Color Picker Tool
import { showToast } from '../main.js';

// Import styles
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'css/color-picker.css';
document.head.appendChild(link);

let colorPicker;

export function init() {
    console.log('Color Picker Tool: Initializing...');
    
    // Wait for DOM and styles to be ready
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
            // Try to find or create a fallback container
            const fallbackContainer = document.querySelector('.tool-container') || document.body;
            const newContainer = document.createElement('div');
            newContainer.id = 'color-picker-content';
            fallbackContainer.appendChild(newContainer);
            console.log('ColorPicker: Created fallback container');
            return this.initializeUI(); // Retry initialization
        }

        // Clear any existing content
        container.innerHTML = '';

        // Create the main container
        const toolContainer = document.createElement('div');
        toolContainer.className = 'tool-container color-picker-container';
        
        // Add the container structure
        toolContainer.innerHTML = `
            <div class="color-picker-grid">
                <!-- Color Preview Section -->
                <div class="color-preview-section">
                    <div class="color-preview">
                        <div id="colorPreview" class="preview-box"></div>
                        <input type="color" id="colorPicker" value="#00b894">
                    </div>
                    <div class="color-adjustments">
                        <div class="adjustment-group">
                            <label for="hueSlider">Hue</label>
                            <input type="range" id="hueSlider" min="0" max="360" value="0">
                            <span class="value-display">0°</span>
                        </div>
                        <div class="adjustment-group">
                            <label for="saturationSlider">Saturation</label>
                            <input type="range" id="saturationSlider" min="0" max="100" value="100">
                            <span class="value-display">100%</span>
                        </div>
                        <div class="adjustment-group">
                            <label for="lightnessSlider">Lightness</label>
                            <input type="range" id="lightnessSlider" min="0" max="100" value="50">
                            <span class="value-display">50%</span>
                        </div>
                        <div class="adjustment-group">
                            <label for="alphaSlider">Opacity</label>
                            <input type="range" id="alphaSlider" min="0" max="100" value="100">
                            <span class="value-display">100%</span>
                        </div>
                    </div>
                </div>

                <!-- Color Values Section -->
                <div class="color-values-section">
                    <h3>Color Values</h3>
                    <div class="color-values">
                        <div class="value-group">
                            <label>HEX</label>
                            <div class="copy-input">
                                <input type="text" id="hexValue" readonly>
                                <button class="copy-btn" data-clipboard="hexValue">
                                    <span class="tooltip">Copy</span>
                                    📋
                                </button>
                            </div>
                        </div>
                        <div class="value-group">
                            <label>RGB</label>
                            <div class="copy-input">
                                <input type="text" id="rgbValue" readonly>
                                <button class="copy-btn" data-clipboard="rgbValue">
                                    <span class="tooltip">Copy</span>
                                    📋
                                </button>
                            </div>
                        </div>
                        <div class="value-group">
                            <label>HSL</label>
                            <div class="copy-input">
                                <input type="text" id="hslValue" readonly>
                                <button class="copy-btn" data-clipboard="hslValue">
                                    <span class="tooltip">Copy</span>
                                    📋
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Saved Colors -->
                    <div class="color-palette">
                        <h3>Saved Colors</h3>
                        <div id="savedColors" class="saved-colors"></div>
                        <button id="saveColor" class="save-color-btn">Save Color</button>
                    </div>
                </div>
            </div>

            <!-- Color Harmonies -->
            <div class="color-harmonies">
                <h3>Color Harmonies</h3>
                 <div class="harmony-grid">
                     <div class="harmony-group">
                         <h4>Complementary</h4>
                         <div id="complementaryColors" class="harmony-colors"></div>
                     </div>
                     <div class="harmony-group">
                         <h4>Analogous</h4>
                         <div id="analogousColors" class="harmony-colors"></div>
                     </div>
                     <div class="harmony-group">
                         <h4>Triadic</h4>
                         <div id="triadicColors" class="harmony-colors"></div>
                     </div>
                 </div>
             </div>
         </div>`;

        // Add the container to the DOM
        container.appendChild(toolContainer);

        // Verify the structure was created properly
        const verifyElement = (id, type) => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`ColorPicker: Missing ${type} element with id: ${id}`);
                return false;
            }
            return true;
        };

        const requiredElements = {
            'colorPicker': 'color input',
            'colorPreview': 'preview box',
            'hexValue': 'HEX input',
            'rgbValue': 'RGB input',
            'hslValue': 'HSL input',
            'hueSlider': 'hue slider',
            'saturationSlider': 'saturation slider',
            'lightnessSlider': 'lightness slider',
            'alphaSlider': 'alpha slider'
        };

        let allElementsPresent = true;
        for (const [id, type] of Object.entries(requiredElements)) {
            if (!verifyElement(id, type)) {
                allElementsPresent = false;
            }
        }

        if (!allElementsPresent) {
            console.error('ColorPicker: Some required elements are missing');
            return;
        }

        // Store elements
        this.elements = {
            colorPicker: document.getElementById('colorPicker'),
            colorPreview: document.getElementById('colorPreview'),
            hueSlider: document.getElementById('hueSlider'),
            saturationSlider: document.getElementById('saturationSlider'),
            lightnessSlider: document.getElementById('lightnessSlider'),
            alphaSlider: document.getElementById('alphaSlider'),
            hexValue: document.getElementById('hexValue'),
            rgbValue: document.getElementById('rgbValue'),
            hslValue: document.getElementById('hslValue'),
            savedColors: document.getElementById('savedColors'),
            saveColorBtn: document.getElementById('saveColor'),
            complementaryColors: document.getElementById('complementaryColors'),
            analogousColors: document.getElementById('analogousColors'),
            triadicColors: document.getElementById('triadicColors')
        };

        console.log('ColorPicker: UI initialization completed');
    }

    setupEventListeners() {
        if (!this.elements.colorPicker) return;

        // Color picker input
        this.elements.colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            const rgb = this.hexToRgb(color);
            if (!rgb) return;
            
            const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            // Update sliders but preserve alpha value
            this.elements.hueSlider.value = Math.round(hsl.h);
            this.elements.saturationSlider.value = Math.round(hsl.s);
            this.elements.lightnessSlider.value = Math.round(hsl.l);
            
            // Update display
            this.updateFromSliders();
        });

        // Sliders
        const sliders = [
            this.elements.hueSlider,
            this.elements.saturationSlider,
            this.elements.lightnessSlider,
            this.elements.alphaSlider
        ];

        sliders.forEach(slider => {
            if (slider) {
                ['input', 'change'].forEach(event => {
                    slider.addEventListener(event, () => this.updateFromSliders());
                });
            }
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById(btn.dataset.clipboard);
                if (!input) return;
                
                input.select();
                document.execCommand('copy');
                
                const tooltip = btn.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.textContent = 'Copied!';
                    setTimeout(() => {
                        tooltip.textContent = 'Copy';
                    }, 1500);
                }
            });
        });

        // Save color button
        if (this.elements.saveColorBtn) {
            this.elements.saveColorBtn.addEventListener('click', () => {
                const currentColor = this.elements.colorPicker.value;
                if (currentColor) {
                    this.saveColor(currentColor);
                    showToast('Color saved!', 'info');
                }
            });
        }

        // Harmony and saved color clicks using event delegation
        document.addEventListener('click', (e) => {
            const colorElement = e.target.closest('.harmony-color, .saved-color');
            if (colorElement) {
                const color = colorElement.dataset.color;
                if (color) {
                    const rgb = this.hexToRgb(color);
                    if (!rgb) return;
                    
                    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
                    
                    // Update sliders
                    this.elements.hueSlider.value = Math.round(hsl.h);
                    this.elements.saturationSlider.value = Math.round(hsl.s);
                    this.elements.lightnessSlider.value = Math.round(hsl.l);
                    
                    // Update display
                    this.updateFromSliders();
                }
            }
        });
    }

    updateColor(color) {
        if (!color || !this.elements.colorPicker) return;

        const rgb = this.hexToRgb(color);
        if (!rgb) {
            showToast('Invalid color format', 'error');
            return;
        }

        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        if (!hsl) return;
        
        // Update color picker and sliders
        this.elements.colorPicker.value = color;
        this.elements.hueSlider.value = Math.round(hsl.h);
        this.elements.saturationSlider.value = Math.round(hsl.s);
        this.elements.lightnessSlider.value = Math.round(hsl.l);
        
        // Preserve current alpha value
        const currentAlpha = parseInt(this.elements.alphaSlider.value) || 100;
        this.elements.alphaSlider.value = currentAlpha;
        
        // Update all displays
        this.updateFromSliders();
        
        // Dispatch change event
        const event = new Event('change');
        this.elements.colorPicker.dispatchEvent(event);
    }

    updateFromSliders() {
        if (!this.elements.hueSlider || !this.elements.saturationSlider || 
            !this.elements.lightnessSlider || !this.elements.alphaSlider) {
            console.error('ColorPicker: Missing slider elements');
            return;
        }

        const h = parseInt(this.elements.hueSlider.value);
        const s = parseInt(this.elements.saturationSlider.value);
        const l = parseInt(this.elements.lightnessSlider.value);
        const a = parseInt(this.elements.alphaSlider.value);

        console.log('ColorPicker: Updating from sliders:', { h, s, l, a });

        const rgb = this.hslToRgb(h, s, l);
        if (!rgb) {
            console.error('ColorPicker: Failed to convert HSL to RGB');
            return;
        }

        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

        // Update color values with alpha
        if (this.elements.hexValue) {
            this.elements.hexValue.value = hex;
        }
        if (this.elements.rgbValue) {
            this.elements.rgbValue.value = a < 100 
                ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(a/100).toFixed(2)})`
                : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        if (this.elements.hslValue) {
            this.elements.hslValue.value = a < 100
                ? `hsla(${h}, ${s}%, ${l}%, ${(a/100).toFixed(2)})`
                : `hsl(${h}, ${s}%, ${l}%)`;
        }

        // Update preview with alpha
        if (this.elements.colorPreview) {
            // Create a semi-transparent background to show transparency
            const backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${a/100})`;
            this.elements.colorPreview.style.backgroundColor = backgroundColor;
        }

        // Update color picker (note: HTML color input doesn't support alpha)
        if (this.elements.colorPicker) {
            this.elements.colorPicker.value = hex;
        }

        // Update value displays
        this.updateValueDisplays(h, s, l, a);

        // Update harmonies
        this.updateHarmonies({h, s, l});

        // Notify about color change
        if (this.elements.colorPicker) {
            const event = new Event('colorchange');
            this.elements.colorPicker.dispatchEvent(event);
        }
    }

    updateValueDisplays(h, s, l, a) {
        const updateDisplay = (slider, value, unit) => {
            if (slider && slider.nextElementSibling) {
                slider.nextElementSibling.textContent = `${value}${unit}`;
            }
        };

        updateDisplay(this.elements.hueSlider, h, '°');
        updateDisplay(this.elements.saturationSlider, s, '%');
        updateDisplay(this.elements.lightnessSlider, l, '%');
        updateDisplay(this.elements.alphaSlider, a, '%');
    }

    updateHarmonies(hsl) {
        // Complementary
        const complementary = { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l };
        this.elements.complementaryColors.innerHTML = this.createHarmonySwatches([hsl, complementary]);

        // Analogous
        const analogous = [
            { h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l },
            hsl,
            { h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }
        ];
        this.elements.analogousColors.innerHTML = this.createHarmonySwatches(analogous);

        // Triadic
        const triadic = [
            hsl,
            { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l },
            { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }
        ];
        this.elements.triadicColors.innerHTML = this.createHarmonySwatches(triadic);
    }

    createHarmonySwatches(colors) {
        return colors.map(color => {
            const rgb = this.hslToRgb(color.h, color.s, color.l);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            return `<div class="harmony-color" style="background-color: ${hex}" title="${hex}" data-color="${hex}"></div>`;
        }).join('');
    }

    saveColor(color) {
        let savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
        if (!savedColors.includes(color)) {
            savedColors.push(color);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            this.loadSavedColors();
        }
    }

    loadSavedColors() {
        const savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
        this.elements.savedColors.innerHTML = savedColors.map(color => 
            `<div class="saved-color" style="background-color: ${color}" title="${color}" data-color="${color}"></div>`
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