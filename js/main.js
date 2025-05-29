// main.js
import { initializeComponents } from './loadComponents.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize components first
    await initializeComponents();

    const toolsGrid = document.getElementById('tools-grid');
    const toolViewContainer = document.getElementById('tool-view-container');
    const heroSection = document.getElementById('hero');
    const toolsGridSection = document.getElementById('tools-grid-section');
    const ctaButton = document.getElementById('cta-button');

    const tools = [
        { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes from text or URLs.', icon: '📷' },
        { id: 'password-generator', name: 'Password Generator', description: 'Create strong, secure passwords.', icon: '🔒' },
        { id: 'image-converter', name: 'Image Converter', description: 'Convert images between JPG, PNG, WEBP.', icon: '🖼️' },
        { id: 'image-compressor', name: 'Image Compressor', description: 'Reduce image file size (JPG/WEBP).', icon: '📦' },
        { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images (basic implementation).', icon: '✂️' },
        { id: 'video-converter', name: 'Video Converter', description: 'Browser limitations apply. Can record.', icon: '🎬' },
        { id: 'audio-converter', name: 'Audio Converter', description: 'Convert audio (e.g., MP3 to WAV).', icon: '🎵' },
        { id: 'audio-trimmer', name: 'Audio Trimmer', description: 'Trim audio clips (WAV output).', icon: '🎧' },
        { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from date of birth.', icon: '🎂' },
        { id: 'emi-calculator', name: 'EMI Calculator', description: 'Calculate Equated Monthly Installments.', icon: '📈' },
        { id: 'sip-calculator', name: 'SIP Calculator', description: 'Estimate returns on Systematic Investments.', icon: '💰' },
        { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, reading time.', icon: '📝' },
        { id: 'base64-coder', name: 'Base64 Encoder/Decoder', description: 'Encode to or decode from Base64.', icon: '🔄' },
        { id: 'color-picker', name: 'Color Picker', description: 'Pick colors and get HEX, RGB, HSL values.', icon: '🎨' },
        { id: 'text-to-speech', name: 'Text to Speech', description: 'Convert text into spoken audio.', icon: '🗣️' },
        { id: 'speech-to-text', name: 'Speech to Text', description: 'Convert spoken words into text.', icon: '🎤' },
        { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate, and beautify JSON.', icon: '📄' },
        { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temperature.', icon: '📏' },
        { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index.', icon: '💪' },
        { id: 'timer-stopwatch', name: 'Timer/Stopwatch', description: 'Simple timer and stopwatch.', icon: '⏱️' }
    ];

    // --- Navigation and View Management ---
    function showView(viewId) {
        // Hide all sections first
        heroSection.style.display = 'none';
        toolsGridSection.style.display = 'none';
        toolViewContainer.style.display = 'none';
        document.querySelectorAll('.tool-view').forEach(view => view.classList.remove('active'));
        
        if (viewId === 'home' || !viewId) {
            // Show home page with tool cards
            heroSection.style.display = 'flex';
            toolsGridSection.style.display = 'block';
            document.title = 'QuickTools Hub - Your One-Stop Utility Platform';
        } else {
            // Show specific tool
            const targetView = document.getElementById(viewId);
            if (targetView) {
                toolViewContainer.style.display = 'block';
                targetView.classList.add('active');
                const tool = tools.find(t => t.id === viewId);
                document.title = `${tool?.name || 'Tool'} | QuickTools Hub`;
                window.scrollTo(0, 0);
            }
        }
    }
    
    // Event Listeners
    ctaButton.addEventListener('click', () => {
        toolsGridSection.scrollIntoView({ behavior: 'smooth' });
    });

    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        showView(hash || 'home');
    }
    window.addEventListener('hashchange', handleHashChange);

    // --- Populate Tool Cards and Tool Views ---
    if (toolsGrid) {
        tools.forEach(tool => {
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
                window.location.hash = tool.id;
            });
            
            toolsGrid.appendChild(card);

            const toolView = document.createElement('div');
            toolView.id = tool.id;
            toolView.className = 'tool-view';
            toolView.innerHTML = `
                <button class="btn back-to-home" style="margin-bottom: 20px; background-color: var(--tool-card-bg); color: var(--text-color); border: 1px solid var(--accent-color);">← Back to Tools</button>
                <h2>${tool.icon} ${tool.name}</h2>
                <div id="${tool.id}-content"></div>
                <div class="loading-indicator" id="${tool.id}-loading">Processing...</div>
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
            import(`/js/tools/${tool.id}.js`)
                .then(module => {
                    if (module.init) {
                        module.init();
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