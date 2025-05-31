// main.js
import { initializeComponents } from './loadComponents.js';
import { createHomeContent, initHomeContent } from './homeContent.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize components first
    await initializeComponents();

    const toolsGrid = document.getElementById('tools-grid');
    const toolViewContainer = document.getElementById('tool-view-container');
    const heroSection = document.getElementById('hero');
    const toolsGridSection = document.getElementById('tools-grid-section');
    const ctaButton = document.getElementById('cta-button');
    const homeContentContainer = document.getElementById('home-content-container');

    const tools = [
        // Most used document & text tools
        { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes from text or URLs.', icon: '<i class="fas fa-qrcode"></i>' },
        { id: 'barcode-generator', name: 'Barcode Generator', description: 'Create barcodes for products, ISBN, UPC, EAN-13, Code 128, and more.', icon: '<i class="fas fa-barcode"></i>', externalUrl: 'https://qrcodegeneratorpro.netlify.app/barcode' },
        
        { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, reading time.', icon: '<i class="fas fa-font"></i>' },
        { id: 'text-case-converter', name: 'Text Case Converter', description: 'Convert text between different cases.', icon: '<i class="fas fa-text-height"></i>' },
        { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate, and beautify JSON.', icon: '<i class="fas fa-code"></i>' },
        { id: 'csv-to-json-converter', name: 'CSV to JSON', description: 'Convert CSV data to JSON format.', icon: '<i class="fas fa-file-code"></i>' },
        { id: 'markdown-editor', name: 'Markdown Editor', description: 'Write and preview markdown with live preview.', icon: '<i class="fas fa-edit"></i>' },
        { id: 'regex-tester', name: 'Regex Tester', description: 'Test and validate regular expressions.', icon: '<i class="fas fa-search"></i>' },
        
        
        // Image & media tools
        { id: 'image-converter', name: 'Image Converter', description: 'Convert images between JPG, PNG, WEBP.', icon: '<i class="fas fa-images"></i>' },
        { id: 'image-compressor', name: 'Image Compressor', description: 'Reduce image file size (JPG/WEBP).', icon: '<i class="fas fa-compress-arrows-alt"></i>' },
        { id: 'image-metadata-remover', name: 'Image Metadata Remover', description: 'Remove EXIF data and preview image.', icon: '<i class="fas fa-user-shield"></i>' },
        { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images (basic implementation).', icon: '<i class="fas fa-crop-alt"></i>' },
        { id: 'video-converter', name: 'Video Converter', description: 'Browser limitations apply. Can record.', icon: '<i class="fas fa-video"></i>' },
        { id: 'audio-converter', name: 'Audio Converter', description: 'Convert audio (e.g., MP3 to WAV).', icon: '<i class="fas fa-file-audio"></i>' },
        { id: 'audio-trimmer', name: 'Audio Trimmer', description: 'Trim audio clips (WAV output).', icon: '<i class="fas fa-cut"></i>' },
        
        // Calculators & converters
        { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temperature.', icon: '<i class="fas fa-ruler-combined"></i>' },
        { id: 'gratuity-calculator', name: 'Gratuity Calculator', description: 'Calculate tips and split bills easily.', icon: '<i class="fas fa-hand-holding-usd"></i>' },
        { id: 'emi-calculator', name: 'EMI Calculator', description: 'Calculate Equated Monthly Installments.', icon: '<i class="fas fa-calculator"></i>' },
        { id: 'sip-calculator', name: 'SIP Calculator', description: 'Estimate returns on Systematic Investments.', icon: '<i class="fas fa-chart-line"></i>' },
        { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from date of birth.', icon: '<i class="fas fa-calendar-alt"></i>' },
        { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index.', icon: '<i class="fas fa-weight"></i>' },
        { id: 'calorie-calculator', name: 'Calorie Calculator', description: 'Calculate daily calorie needs and macros.', icon: '<i class="fas fa-utensils"></i>' },
        { id: 'gst-calculator', name: 'GST Calculator', description: 'Calculate GST, CGST, and SGST amounts.', icon: '<i class="fas fa-receipt"></i>' },
        { id: 'freelance-calculator', name: 'Freelance Calculator', description: 'Calculate daily and hourly income rates.', icon: '<i class="fas fa-money-bill-wave"></i>' },
        
        // Security & utility tools
        { id: 'password-generator', name: 'Password Generator', description: 'Create strong, secure passwords.', icon: '<i class="fas fa-key"></i>' },
        { id: 'base64-coder', name: 'Base64 Encoder/Decoder', description: 'Encode to or decode from Base64.', icon: '<i class="fas fa-exchange-alt"></i>' },
        { id: 'color-picker', name: 'Color Picker', description: 'Pick colors and get HEX, RGB, HSL values.', icon: '<i class="fas fa-palette"></i>' },
        { id: 'color-contrast-checker', name: 'Color Contrast Checker', description: 'Check color contrast for accessibility (WCAG).', icon: '<i class="fas fa-adjust"></i>' },
        { id: 'timer-stopwatch', name: 'Timer/Stopwatch', description: 'Simple timer and stopwatch.', icon: '<i class="fas fa-stopwatch"></i>' },
        
        // Speech tools
        { id: 'text-to-speech', name: 'Text to Speech', description: 'Convert text into spoken audio.', icon: '<i class="fas fa-volume-up"></i>' },
        { id: 'speech-to-text', name: 'Speech to Text', description: 'Convert spoken words into text.', icon: '<i class="fas fa-microphone"></i>' },
        { id: 'advanced-qr-generator', name: 'Advanced QR Code Generator', description: 'Create QR codes with custom logos, colors, and advanced styling options.', icon: '<i class="fas fa-qrcode"></i>', externalUrl: 'https://qrcodegeneratorpro.netlify.app/' }
    ];

    // --- Navigation and View Management ---
    async function showView(viewId) {
        console.log('Showing view:', viewId);
        // Hide all sections first
        heroSection.style.display = 'none';
        toolsGridSection.style.display = 'none';
        toolViewContainer.style.display = 'none';
        homeContentContainer.style.display = 'none';

        document.querySelectorAll('.tool-view').forEach(view => {
            console.log('Removing active from view:', view.id);
            view.classList.remove('active');
        });
        
        if (viewId === 'home' || !viewId) {
            console.log('Showing home view');
            // Show home page with tool cards
            heroSection.style.display = 'flex';
            toolsGridSection.style.display = 'block';
            homeContentContainer.style.display = 'block';
            document.title = 'QuickTools Hub - Your One-Stop Utility Platform';

            // Load home content if not already loaded
            if (!homeContentContainer.querySelector('#home-content')) {
                try {
                    const homeContent = createHomeContent();
                    homeContentContainer.innerHTML = '';
                    homeContentContainer.appendChild(homeContent);
                    initHomeContent();
                } catch (error) {
                    console.error('Error loading home content:', error);
                    homeContentContainer.innerHTML = '<p>Error loading content. Please refresh the page.</p>';
                }
            }
        } else {
            // Show specific tool
            console.log('Looking for tool view:', viewId);
            const targetView = document.getElementById(viewId);
            console.log('Found target view:', targetView);
            if (targetView) {
                console.log('Showing tool view:', viewId);
                toolViewContainer.style.display = 'block';
                targetView.classList.add('active');
                const tool = tools.find(t => t.id === viewId);
                document.title = `${tool?.name || 'Tool'} | QuickTools Hub`;
                window.scrollTo(0, 0);
            } else {
                console.error('Tool view not found:', viewId);
            }
        }
    }
    
    // Event Listeners
    ctaButton.addEventListener('click', () => {
        toolsGridSection.scrollIntoView({ behavior: 'smooth' });
    });

    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        console.log('Hash changed to:', hash);
        showView(hash || 'home');
    }
    window.addEventListener('hashchange', handleHashChange);

    // --- Populate Tool Cards and Tool Views ---
    if (toolsGrid) {
        tools.forEach(tool => {
            console.log('Creating card for tool:', tool.id);
            const card = document.createElement('div');
            card.className = 'tool-card fade-in-scroll';
            card.innerHTML = `
                <h3>${tool.icon} ${tool.name}</h3>
                <p>${tool.description}</p>
                <button class="btn open-tool-btn" data-toolid="${tool.id}">Open Tool</button>
            `;
            
            // Only trigger navigation when the button is clicked
            const openButton = card.querySelector('.open-tool-btn');
            openButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                console.log('Tool button clicked:', tool.id);
                if (tool.externalUrl) {
                    window.open(tool.externalUrl, '_blank');
                } else {
                    window.location.hash = tool.id;
                }
            });
            
            toolsGrid.appendChild(card);

            console.log('Creating view for tool:', tool.id);
            const toolView = document.createElement('div');
            toolView.id = tool.id;
            toolView.className = 'tool-view';
            toolView.innerHTML = `
                <button class="btn back-to-home" style="margin-bottom: 20px; background-color: var(--tool-card-bg); color: var(--text-color); border: 1px solid var(--accent-color);">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
                <h2>${tool.icon} ${tool.name}</h2>
                <div id="${tool.id}-content"></div>
                <div class="loading-indicator" id="${tool.id}-loading">
                    <i class="fas fa-spinner fa-spin"></i> Processing...
                </div>
            `;
            toolView.querySelector('.back-to-home').addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = 'home';
            });
            toolViewContainer.appendChild(toolView);
        });
    }

    // --- Initialize All Tools ---
    function initAllTools() {
        // Each tool's init function will be imported from its respective file
        tools.forEach(tool => {
            console.log('Loading tool:', tool.id);
            import(`./tools/${tool.id}.js`)
                .then(module => {
                    console.log('Tool loaded:', tool.id);
                    if (module.init) {
                        console.log('Initializing tool:', tool.id);
                        module.init();
                    } else {
                        console.error('No init function found for tool:', tool.id);
                    }
                })
                .catch(err => console.error(`Error loading ${tool.id}:`, err));
        });
    }

    initAllTools();
    handleHashChange(); // Initial page load based on hash

    // Fade-in on scroll for tool cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('#tools-grid .tool-card').forEach(el => {
        observer.observe(el);
    });
});

// Utility functions that will be used across tools
export function showToast(message, type = 'success', duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if(existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500); 
    }, duration);
}

export function setLoading(toolId, isLoading) {
    const loadingIndicator = document.getElementById(`${toolId}-loading`);
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}

export function createFileDownloadLink(blob, filename, linkText = 'Download File') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.textContent = linkText;
    link.className = 'btn';
    link.style.display = 'inline-block';
    link.style.marginTop = '1rem';
    
    link.addEventListener('click', () => {
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });
    return link;
} 