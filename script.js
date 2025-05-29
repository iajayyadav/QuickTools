// script.js
document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.getElementById('tools-grid');
    const toolViewContainer = document.getElementById('tool-view-container');
    const mainNav = document.getElementById('main-nav');
    const heroSection = document.getElementById('hero');
    const toolsGridSection = document.getElementById('tools-grid-section');
    const ctaButton = document.getElementById('cta-button');
    const homeLink = mainNav.querySelector('a[href="#home"]');
    document.getElementById('current-year').textContent = new Date().getFullYear();

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

        // Update navigation active state
        document.querySelectorAll('#main-nav .nav-link').forEach(link => link.classList.remove('active'));
        const activeNavLink = mainNav.querySelector(`a[href="#${viewId || 'home'}"]`);
        if (activeNavLink) activeNavLink.classList.add('active');
    }
    
    ctaButton.addEventListener('click', () => {
        toolsGridSection.scrollIntoView({ behavior: 'smooth' });
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#home');
        showView('home');
    });

    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        showView(hash || 'home');
    }
    window.addEventListener('hashchange', handleHashChange);
    

    // --- Populate Tool Cards and Tool Views ---
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


    // --- Utility Functions ---
    function showToast(message, type = 'success', duration = 3000) {
        const existingToast = document.querySelector('.toast');
        if(existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => { // Ensure element is in DOM before animating
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

    function setLoading(toolId, isLoading) {
        const loadingIndicator = document.getElementById(`${toolId}-loading`);
        if (loadingIndicator) {
            loadingIndicator.style.display = isLoading ? 'block' : 'none';
        }
    }
    
    function createFileDownloadLink(blob, filename, linkText = 'Download File') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.textContent = linkText;
        link.className = 'btn'; // Style as a button
        link.style.display = 'inline-block';
        link.style.marginTop = '1rem';
        
        // Clean up the object URL after download (important for memory)
        link.addEventListener('click', () => {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        });
        return link;
    }


    // --- Tool Implementations ---

    // 1. QR Code Generator
    function initQrGenerator() {
        const contentDiv = document.getElementById('qr-generator-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="qr-text">Text or URL:</label>
                <input type="text" id="qr-text" placeholder="Enter text or URL">
            </div>
            <button id="qr-generate-btn" class="btn">Generate QR Code</button>
            <div id="qr-code-result" class="output-area"></div>
            <div id="qr-download-container"></div>
        `;

        const textInput = document.getElementById('qr-text');
        const generateBtn = document.getElementById('qr-generate-btn');
        const resultDiv = document.getElementById('qr-code-result');
        const downloadContainer = document.getElementById('qr-download-container');
        
        generateBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (!text) {
                showToast('Please enter text or URL.', 'error');
                return;
            }
            resultDiv.innerHTML = ''; 
            downloadContainer.innerHTML = '';

            if (typeof QRCode === 'undefined') {
                showToast('QR Code library not loaded.', 'error');
                console.error('QRCode.js is not loaded.');
                return;
            }

            try {
                new QRCode(resultDiv, {
                    text: text,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                setTimeout(() => { 
                    const canvas = resultDiv.querySelector('canvas');
                    if (canvas) {
                        canvas.toBlob(function(blob) {
                            const downloadLink = createFileDownloadLink(blob, 'qrcode.png', 'Download QR');
                            downloadContainer.appendChild(downloadLink);
                        }, 'image/png');
                    }
                }, 200); // Ensure canvas is rendered

            } catch (err) {
                showToast('Error generating QR Code.', 'error');
                console.error(err);
            }
        });
    }

    // 2. Password Generator
    function initPasswordGenerator() {
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
                <input type="text" id="pg-result" readonly placeholder="Your password here" style="background-color: var(--bg-color); border: 1px solid var(--header-bg);">
                <button id="pg-copy-btn" class="btn" style="margin-top: 0.5rem;">Copy</button>
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

        lengthInput.addEventListener('input', () => lengthVal.textContent = lengthInput.value);

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

            if (charset === '' || length <= 0) {
                showToast('Please select character types and a valid length.', 'error');
                resultInput.value = '';
                return;
            }

            let password = '';
            // Ensure at least one of each selected type if possible and length allows
            const ensureChars = [];
            if (uppercaseCheck.checked) ensureChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
            if (lowercaseCheck.checked) ensureChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
            if (numbersCheck.checked) ensureChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
            if (symbolsCheck.checked) ensureChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);

            for (let i = 0; i < length; i++) {
                if (i < ensureChars.length) {
                    password += ensureChars[i];
                } else {
                    password += charset.charAt(Math.floor(Math.random() * charset.length));
                }
            }
            // Shuffle the password to ensure randomness of ensured characters
            resultInput.value = password.split('').sort(() => 0.5 - Math.random()).join('');
        });

        copyBtn.addEventListener('click', () => {
            if (resultInput.value) {
                navigator.clipboard.writeText(resultInput.value)
                    .then(() => showToast('Password copied to clipboard!'))
                    .catch(err => showToast('Failed to copy password.', 'error'));
            }
        });
    }
    
    // 3. Image Converter (also base for Compressor)
    function initImageConverterOrCompressor(toolId, isCompressor = false) {
        const contentDiv = document.getElementById(`${toolId}-content`);
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="${toolId}-file">Upload Image:</label>
                <input type="file" id="${toolId}-file" accept="image/jpeg, image/png, image/webp">
            </div>
            ${isCompressor ? '' : `
            <div class="form-group">
                <label for="${toolId}-format">Convert to:</label>
                <select id="${toolId}-format">
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                </select>
            </div>`}
            <div class="form-group" id="${toolId}-quality-group">
                <label for="${toolId}-quality">Quality (for JPEG/WEBP): <span id="${toolId}-quality-value">0.9</span></label>
                <input type="range" id="${toolId}-quality" min="0.1" max="1.0" step="0.05" value="0.9" style="width:100%;">
            </div>
            <button id="${toolId}-process-btn" class="btn" disabled>${isCompressor ? 'Compress' : 'Convert'} & Download</button>
            <div class="preview-area" style="text-align:center;">
                <img id="${toolId}-preview" class="image-preview" src="#" alt="Image Preview" style="display:none;">
                <p id="${toolId}-original-size" style="font-size:0.9em; margin-top:0.5em;"></p>
                <p id="${toolId}-processed-size" style="font-size:0.9em; margin-top:0.5em;"></p>
            </div>
            <div id="${toolId}-download-container" style="text-align:center;"></div>
        `;

        const fileInput = document.getElementById(`${toolId}-file`);
        const formatSelect = isCompressor ? null : document.getElementById(`${toolId}-format`);
        const qualityGroup = document.getElementById(`${toolId}-quality-group`);
        const qualityInput = document.getElementById(`${toolId}-quality`);
        const qualityValue = document.getElementById(`${toolId}-quality-value`);
        const processBtn = document.getElementById(`${toolId}-process-btn`);
        const previewImg = document.getElementById(`${toolId}-preview`);
        const downloadContainer = document.getElementById(`${toolId}-download-container`);
        const originalSizeEl = document.getElementById(`${toolId}-original-size`);
        const processedSizeEl = document.getElementById(`${toolId}-processed-size`);

        let originalFile = null;
        let originalType = '';

        fileInput.addEventListener('change', (e) => {
            originalFile = e.target.files[0];
            downloadContainer.innerHTML = ''; // Clear previous download link
            originalSizeEl.textContent = '';
            processedSizeEl.textContent = '';
            if (originalFile) {
                originalType = originalFile.type;
                originalSizeEl.textContent = `Original size: ${(originalFile.size / 1024).toFixed(2)} KB`;
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewImg.style.display = 'block';
                    processBtn.disabled = false;
                }
                reader.readAsDataURL(originalFile);
                
                const currentTargetFormat = isCompressor ? originalType : formatSelect.value;
                qualityGroup.style.display = (currentTargetFormat === 'image/jpeg' || currentTargetFormat === 'image/webp') ? 'block' : 'none';
            } else {
                previewImg.style.display = 'none';
                processBtn.disabled = true;
                originalFile = null;
            }
        });
        
        if (formatSelect) {
            formatSelect.addEventListener('change', () => {
                qualityGroup.style.display = (formatSelect.value === 'image/jpeg' || formatSelect.value === 'image/webp') ? 'block' : 'none';
            });
        }

        qualityInput.addEventListener('input', () => {
            qualityValue.textContent = qualityInput.value;
        });

        processBtn.addEventListener('click', () => {
            if (!originalFile) {
                showToast('Please upload an image first.', 'error');
                return;
            }
            setLoading(toolId, true);
            downloadContainer.innerHTML = ''; // Clear previous download link
            processedSizeEl.textContent = '';


            const targetFormat = isCompressor ? originalType : formatSelect.value;
            // For PNG compression, quality slider doesn't apply in canvas.toDataURL.
            // If original is PNG and target is PNG for compressor, we can't do much with canvas alone.
            // We'll show a message or simply re-save it.
            if (isCompressor && targetFormat === 'image/png') {
                showToast('PNG compression via browser canvas is lossless and may not significantly reduce size. For best PNG compression, specialized tools are needed.', 'info');
                 // We can still re-save it, sometimes this strips metadata.
            }

            const quality = (targetFormat === 'image/jpeg' || targetFormat === 'image/webp') ? parseFloat(qualityInput.value) : undefined;
            
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);

                canvas.toBlob(function(blob) {
                    if (blob) {
                        processedSizeEl.textContent = `${isCompressor ? 'Compressed' : 'Converted'} size: ${(blob.size / 1024).toFixed(2)} KB`;
                        const extension = targetFormat.split('/')[1];
                        const fileName = `${isCompressor ? 'compressed' : 'converted'}_image.${extension}`;
                        const downloadLink = createFileDownloadLink(blob, fileName, `Download ${extension.toUpperCase()}`);
                        downloadContainer.appendChild(downloadLink);
                        showToast(`Image ${isCompressor ? 'compressed' : 'converted'}!`);
                    } else {
                        showToast(`Error ${isCompressor ? 'compressing' : 'converting'} image.`, 'error');
                    }
                    setLoading(toolId, false);
                }, targetFormat, quality);
            };
            img.onerror = () => {
                showToast(`Error loading image for ${isCompressor ? 'compression' : 'conversion'}.`, 'error');
                setLoading(toolId, false);
            };
            img.src = URL.createObjectURL(originalFile);
        });
    }


    // 4. Word Counter
    function initWordCounter() {
        const contentDiv = document.getElementById('word-counter-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="wc-text">Enter Text:</label>
                <textarea id="wc-text" rows="10" placeholder="Paste your text here..."></textarea>
            </div>
            <div class="output-area" id="wc-results">
                <p>Words: <strong id="wc-words">0</strong></p>
                <p>Characters (with spaces): <strong id="wc-chars-spaces">0</strong></p>
                <p>Characters (no spaces): <strong id="wc-chars-nospaces">0</strong></p>
                <p>Spaces: <strong id="wc-spaces">0</strong></p>
                <p>Sentences: <strong id="wc-sentences">0</strong></p>
                <p>Paragraphs: <strong id="wc-paragraphs">0</strong></p>
                <p>Reading Time: <strong id="wc-reading-time">~0 min</strong></p>
            </div>
        `;

        const textarea = document.getElementById('wc-text');
        const wordsEl = document.getElementById('wc-words');
        const charsSpacesEl = document.getElementById('wc-chars-spaces');
        const charsNoSpacesEl = document.getElementById('wc-chars-nospaces');
        const spacesEl = document.getElementById('wc-spaces');
        const sentencesEl = document.getElementById('wc-sentences');
        const paragraphsEl = document.getElementById('wc-paragraphs');
        const readingTimeEl = document.getElementById('wc-reading-time');
        const AVG_WORDS_PER_MINUTE = 200;

        textarea.addEventListener('input', () => {
            const text = textarea.value;
            
            const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            wordsEl.textContent = words;

            charsSpacesEl.textContent = text.length;
            
            const textNoSpaces = text.replace(/\s/g, '');
            charsNoSpacesEl.textContent = textNoSpaces.length;

            spacesEl.textContent = (text.match(/ /g) || []).length;
            
            const sentences = text.trim() === '' ? 0 : (text.match(/[^\.!\?]+[\.!\?]+/g)?.length || (text.trim() ? 1 : 0)) ;
            sentencesEl.textContent = sentences;

            const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;
            paragraphsEl.textContent = paragraphs;

            const readingTimeMinutes = words / AVG_WORDS_PER_MINUTE;
            readingTimeEl.textContent = `~${Math.ceil(readingTimeMinutes)} min`;
        });
    }

    // 5. Base64 Encoder/Decoder
    function initBase64Coder() {
        const contentDiv = document.getElementById('base64-coder-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="b64-input">Input Text:</label>
                <textarea id="b64-input" rows="5" placeholder="Enter text to encode or Base64 to decode"></textarea>
            </div>
            <div class="btn-group">
                <button id="b64-encode-btn" class="btn">Encode to Base64</button>
                <button id="b64-decode-btn" class="btn">Decode from Base64</button>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label for="b64-output">Output:</label>
                <textarea id="b64-output" rows="5" readonly style="background-color: var(--bg-color); border: 1px solid var(--header-bg);"></textarea>
                 <button id="b64-copy-btn" class="btn" style="margin-top: 0.5rem;">Copy Output</button>
            </div>
        `;

        const inputArea = document.getElementById('b64-input');
        const outputArea = document.getElementById('b64-output');
        const encodeBtn = document.getElementById('b64-encode-btn');
        const decodeBtn = document.getElementById('b64-decode-btn');
        const copyBtn = document.getElementById('b64-copy-btn');

        encodeBtn.addEventListener('click', () => {
            try {
                // Handle UTF-8 characters correctly
                const utf8Bytes = new TextEncoder().encode(inputArea.value);
                let binaryString = '';
                utf8Bytes.forEach(byte => binaryString += String.fromCharCode(byte));
                outputArea.value = btoa(binaryString);
            } catch (e) {
                outputArea.value = 'Error: Could not encode input.';
                showToast('Encoding error. Invalid characters?', 'error');
            }
        });

        decodeBtn.addEventListener('click', () => {
            try {
                // Handle UTF-8 characters correctly
                const binaryString = atob(inputArea.value);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                outputArea.value = new TextDecoder().decode(bytes);
            } catch (e) {
                outputArea.value = 'Error: Invalid Base64 string.';
                showToast('Decoding error. Invalid Base64?', 'error');
            }
        });
        copyBtn.addEventListener('click', () => {
            if (outputArea.value && !outputArea.value.startsWith('Error:')) {
                navigator.clipboard.writeText(outputArea.value)
                    .then(() => showToast('Output copied to clipboard!'))
                    .catch(err => showToast('Failed to copy output.', 'error'));
            }
        });
    }
    
    // 6. Color Picker
    function initColorPicker() {
        const contentDiv = document.getElementById('color-picker-content');
        contentDiv.innerHTML = `
            <div class="form-group" style="text-align: center;">
                <label for="cp-input" style="display:inline-block; margin-right:10px;">Select Color:</label>
                <input type="color" id="cp-input" value="#FFCB05" style="width:50px; height:50px; border:none; padding:0; border-radius:var(--border-radius-lg); vertical-align:middle;">
            </div>
            <div id="cp-preview" style="width: 100px; height: 100px; border: 1px solid var(--text-color); margin: 1rem auto; border-radius: var(--border-radius-lg);"></div>
            <div class="output-area" id="cp-results">
                <p>HEX: <strong id="cp-hex"></strong> <button class="btn-copy-color" data-target="cp-hex">Copy</button></p>
                <p>RGB: <strong id="cp-rgb"></strong> <button class="btn-copy-color" data-target="cp-rgb">Copy</button></p>
                <p>HSL: <strong id="cp-hsl"></strong> <button class="btn-copy-color" data-target="cp-hsl">Copy</button></p>
            </div>
        `;

        const colorInput = document.getElementById('cp-input');
        const previewBox = document.getElementById('cp-preview');
        const hexEl = document.getElementById('cp-hex');
        const rgbEl = document.getElementById('cp-rgb');
        const hslEl = document.getElementById('cp-hsl');

        function updateColorValues(hexColor) {
            previewBox.style.backgroundColor = hexColor;
            hexEl.textContent = hexColor.toUpperCase();

            let r = 0, g = 0, b = 0;
            if (hexColor.length === 4) { 
                r = parseInt(hexColor[1] + hexColor[1], 16);
                g = parseInt(hexColor[2] + hexColor[2], 16);
                b = parseInt(hexColor[3] + hexColor[3], 16);
            } else if (hexColor.length === 7) { 
                r = parseInt(hexColor.substring(1, 3), 16);
                g = parseInt(hexColor.substring(3, 5), 16);
                b = parseInt(hexColor.substring(5, 7), 16);
            }
            rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;

            const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
            const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
            let h, s, l = (max + min) / 2;

            if (max === min) { h = s = 0; } 
            else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                    case gNorm: h = (bNorm - rNorm) / d + 2; break;
                    case bNorm: h = (rNorm - gNorm) / d + 4; break;
                }
                h /= 6;
            }
            hslEl.textContent = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        }
        
        colorInput.addEventListener('input', (e) => updateColorValues(e.target.value));
        updateColorValues(colorInput.value); // Initial call

        contentDiv.querySelectorAll('.btn-copy-color').forEach(button => {
            button.classList.add('btn'); // Style as small button
            button.style.padding = '0.2em 0.5em';
            button.style.fontSize = '0.8em';
            button.style.marginLeft = '10px';
            button.style.textTransform = 'none';
            button.addEventListener('click', (e) => {
                const textToCopy = document.getElementById(e.target.dataset.target).textContent;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => showToast(`${textToCopy} copied!`))
                    .catch(() => showToast('Copy failed.', 'error'));
            });
        });
    }

    // 7. Text to Speech
    function initTextToSpeech() {
        const contentDiv = document.getElementById('text-to-speech-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="tts-text">Text to Speak:</label>
                <textarea id="tts-text" rows="5" placeholder="Enter text here..."></textarea>
            </div>
            <div class="form-group">
                <label for="tts-voice">Voice:</label>
                <select id="tts-voice" disabled><option>Loading voices...</option></select>
            </div>
            <div class="form-group">
                <label for="tts-rate">Rate: <span id="tts-rate-value">1</span></label>
                <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" style="width:100%;">
            </div>
            <div class="form-group">
                <label for="tts-pitch">Pitch: <span id="tts-pitch-value">1</span></label>
                <input type="range" id="tts-pitch" min="0" max="2" step="0.1" value="1" style="width:100%;">
            </div>
            <div class="btn-group">
                <button id="tts-speak-btn" class="btn">Speak</button>
                <button id="tts-pause-btn" class="btn">Pause</button>
                <button id="tts-resume-btn" class="btn">Resume</button>
                <button id="tts-stop-btn" class="btn">Stop</button>
            </div>
        `;

        const textInput = document.getElementById('tts-text');
        const voiceSelect = document.getElementById('tts-voice');
        const rateInput = document.getElementById('tts-rate');
        const rateValue = document.getElementById('tts-rate-value');
        const pitchInput = document.getElementById('tts-pitch');
        const pitchValue = document.getElementById('tts-pitch-value');
        const speakBtn = document.getElementById('tts-speak-btn');
        const pauseBtn = document.getElementById('tts-pause-btn');
        const resumeBtn = document.getElementById('tts-resume-btn');
        const stopBtn = document.getElementById('tts-stop-btn');

        const synth = window.speechSynthesis;
        if (!synth) {
            contentDiv.innerHTML = "<p>Speech Synthesis API not supported in this browser.</p>";
            return;
        }
        let voices = [];

        function populateVoiceList() {
            voices = synth.getVoices().sort((a,b) => a.lang.localeCompare(b.lang)); // Sort voices by language
            voiceSelect.innerHTML = '';
            if (voices.length === 0) {
                voiceSelect.innerHTML = '<option>No voices available</option>';
                voiceSelect.disabled = true;
                return;
            }
            voices.forEach((voice) => {
                const option = document.createElement('option');
                option.textContent = `${voice.name} (${voice.lang})`;
                if (voice.default) option.selected = true;
                option.setAttribute('data-lang', voice.lang);
                option.setAttribute('data-name', voice.name);
                voiceSelect.appendChild(option);
            });
            voiceSelect.disabled = false;
        }

        populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        rateInput.addEventListener('input', () => rateValue.textContent = rateInput.value);
        pitchInput.addEventListener('input', () => pitchValue.textContent = pitchInput.value);

        speakBtn.addEventListener('click', () => {
            if (synth.speaking) synth.cancel();
            if (textInput.value !== '') {
                const utterThis = new SpeechSynthesisUtterance(textInput.value);
                const selectedVoiceName = voiceSelect.selectedOptions[0]?.getAttribute('data-name');
                if(selectedVoiceName) utterThis.voice = voices.find(voice => voice.name === selectedVoiceName);
                utterThis.pitch = parseFloat(pitchInput.value);
                utterThis.rate = parseFloat(rateInput.value);
                utterThis.onerror = (e) => { 
                    showToast('Error during speech: ' + e.error, 'error');
                };
                synth.speak(utterThis);
            }
        });
        
        pauseBtn.addEventListener('click', () => synth.pause());
        resumeBtn.addEventListener('click', () => synth.resume());
        stopBtn.addEventListener('click', () => synth.cancel());
    }

    // 8. Age Calculator
    function initAgeCalculator() {
        const contentDiv = document.getElementById('age-calculator-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="ac-dob">Date of Birth:</label>
                <input type="date" id="ac-dob" max="${new Date().toISOString().split("T")[0]}">
            </div>
            <button id="ac-calculate-btn" class="btn">Calculate Age</button>
            <div class="output-area" id="ac-result" style="margin-top:1rem;">
                Your age will be displayed here.
            </div>
        `;

        const dobInput = document.getElementById('ac-dob');
        const calculateBtn = document.getElementById('ac-calculate-btn');
        const resultDiv = document.getElementById('ac-result');

        calculateBtn.addEventListener('click', () => {
            const dobString = dobInput.value;
            if (!dobString) {
                showToast('Please enter your date of birth.', 'error');
                resultDiv.innerHTML = 'Please enter your date of birth.';
                return;
            }

            const dob = new Date(dobString);
            const today = new Date();

            if (dob > today) {
                showToast('Date of birth cannot be in the future.', 'error');
                resultDiv.innerHTML = 'Date of birth cannot be in the future.';
                return;
            }

            let years = today.getFullYear() - dob.getFullYear();
            let months = today.getMonth() - dob.getMonth();
            let days = today.getDate() - dob.getDate();

            if (days < 0) {
                months--;
                days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); 
            }
            if (months < 0) {
                years--;
                months += 12;
            }
            
            resultDiv.innerHTML = `
                <p><strong>Age:</strong> ${years} years, ${months} months, and ${days} days</p>
            `;
        });
    }

    // 9. EMI Calculator
    function initEmiCalculator() {
        const contentDiv = document.getElementById('emi-calculator-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="emi-principal">Loan Amount (P):</label>
                <input type="number" id="emi-principal" placeholder="e.g., 100000" min="0">
            </div>
            <div class="form-group">
                <label for="emi-rate">Annual Interest Rate (% R):</label>
                <input type="number" id="emi-rate" placeholder="e.g., 10" min="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="emi-tenure">Loan Tenure (Years T):</label>
                <input type="number" id="emi-tenure" placeholder="e.g., 5" min="0">
            </div>
            <button id="emi-calculate-btn" class="btn">Calculate EMI</button>
            <div class="output-area" id="emi-result" style="margin-top:1rem;">
                Results will be displayed here.
            </div>
        `;
        const principalInput = document.getElementById('emi-principal');
        const rateInput = document.getElementById('emi-rate');
        const tenureInput = document.getElementById('emi-tenure');
        const calculateBtn = document.getElementById('emi-calculate-btn');
        const resultDiv = document.getElementById('emi-result');

        calculateBtn.addEventListener('click', () => {
            const P = parseFloat(principalInput.value);
            const annualRate = parseFloat(rateInput.value);
            const tenureYears = parseFloat(tenureInput.value);

            if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(tenureYears) || tenureYears <= 0) {
                showToast('Please enter valid loan details.', 'error');
                resultDiv.innerHTML = '<p>Invalid input. Ensure all fields are positive numbers.</p>';
                return;
            }
            const r = (annualRate / 12) / 100; // Monthly interest rate
            const n = tenureYears * 12; // Number of months
            
            if (r === 0) { // If interest rate is 0
                 const emi = P / n;
                 resultDiv.innerHTML = `
                    <p><strong>Monthly EMI:</strong> ${emi.toFixed(2)}</p>
                    <p><strong>Total Interest Payable:</strong> 0.00</p>
                    <p><strong>Total Payment (Principal + Interest):</strong> ${P.toFixed(2)}</p>
                `;
                return;
            }

            const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = emi * n;
            const totalInterest = totalPayment - P;

            resultDiv.innerHTML = `
                <p><strong>Monthly EMI:</strong> ${emi.toFixed(2)}</p>
                <p><strong>Total Interest Payable:</strong> ${totalInterest.toFixed(2)}</p>
                <p><strong>Total Payment (Principal + Interest):</strong> ${totalPayment.toFixed(2)}</p>
            `;
        });
    }

    // 10. SIP Calculator
    function initSipCalculator() {
        const contentDiv = document.getElementById('sip-calculator-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="sip-monthly">Monthly Investment:</label>
                <input type="number" id="sip-monthly" placeholder="e.g., 5000" min="0">
            </div>
            <div class="form-group">
                <label for="sip-rate">Expected Annual Return Rate (%):</label>
                <input type="number" id="sip-rate" placeholder="e.g., 12" min="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="sip-period">Investment Period (Years):</label>
                <input type="number" id="sip-period" placeholder="e.g., 10" min="0">
            </div>
            <button id="sip-calculate-btn" class="btn">Calculate Future Value</button>
            <div class="output-area" id="sip-result" style="margin-top:1rem;">
                Results will be displayed here.
            </div>
        `;
        const monthlyInput = document.getElementById('sip-monthly');
        const rateInput = document.getElementById('sip-rate');
        const periodInput = document.getElementById('sip-period');
        const calculateBtn = document.getElementById('sip-calculate-btn');
        const resultDiv = document.getElementById('sip-result');
        
        calculateBtn.addEventListener('click', () => {
            const M = parseFloat(monthlyInput.value); 
            const annualReturnRate = parseFloat(rateInput.value);
            const T = parseFloat(periodInput.value); 

            if (isNaN(M) || M <= 0 || isNaN(annualReturnRate) || annualReturnRate < 0 || isNaN(T) || T <= 0) {
                showToast('Please enter valid SIP details.', 'error');
                resultDiv.innerHTML = '<p>Invalid input. Ensure all fields are positive numbers (rate can be 0).</p>';
                return;
            }
            const i = (annualReturnRate / 100) / 12; // Monthly interest rate
            const n = T * 12; // Number of months

            let fv;
            if (i === 0) { // If rate is 0
                fv = M * n;
            } else {
                fv = M * ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i);
            }
            
            const totalInvested = M * n;
            const wealthGained = fv - totalInvested;

            resultDiv.innerHTML = `
                <p><strong>Total Invested Amount:</strong> ${totalInvested.toFixed(2)}</p>
                <p><strong>Estimated Returns (Wealth Gained):</strong> ${wealthGained.toFixed(2)}</p>
                <p><strong>Future Value (Maturity Amount):</strong> ${fv.toFixed(2)}</p>
            `;
        });
    }

    // 11. Speech to Text
    function initSpeechToText() {
        const contentDiv = document.getElementById('speech-to-text-content');
        contentDiv.innerHTML = `
            <p>Click 'Start Listening', speak clearly, and see the transcribed text below. (Browser support varies, Chrome is generally best.)</p>
            <div class="btn-group">
                <button id="stt-start-btn" class="btn">Start Listening</button>
                <button id="stt-stop-btn" class="btn" disabled>Stop Listening</button>
            </div>
            <div class="output-area" id="stt-output" style="margin-top:1rem; min-height:100px;"></div>
            <button id="stt-copy-btn" class="btn" style="margin-top:0.5rem; display:none;">Copy Text</button>
        `;
        const startBtn = document.getElementById('stt-start-btn');
        const stopBtn = document.getElementById('stt-stop-btn');
        const outputDiv = document.getElementById('stt-output');
        const copyBtn = document.getElementById('stt-copy-btn');
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            outputDiv.innerHTML = 'Speech Recognition API not supported in this browser.';
            startBtn.disabled = true;
            stopBtn.disabled = true;
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.continuous = true; 
        recognition.interimResults = true;
        recognition.lang = 'en-US'; 

        let finalTranscript = '';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            outputDiv.innerHTML = finalTranscript + '<i style="color: #ccc;">' + interimTranscript + '</i>';
            copyBtn.style.display = finalTranscript.trim() ? 'inline-block' : 'none';
        };
        recognition.onerror = (event) => {
            outputDiv.textContent = 'Error in recognition: ' + event.error;
            showToast(`Speech recognition error: ${event.error}`, 'error');
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };
        recognition.onend = () => {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };

        startBtn.addEventListener('click', () => {
            finalTranscript = ''; 
            outputDiv.innerHTML = '<i>Listening...</i>';
            copyBtn.style.display = 'none';
            try {
                recognition.start();
                startBtn.disabled = true;
                stopBtn.disabled = false;
            } catch(e) {
                 showToast(`Could not start recognition: ${e.message}`, 'error');
                 outputDiv.innerHTML = `Error starting: ${e.message}. Try again or check permissions.`;
                 startBtn.disabled = false;
            }
        });
        stopBtn.addEventListener('click', () => {
            recognition.stop();
        });
        copyBtn.addEventListener('click', () => {
            if (finalTranscript.trim()) {
                navigator.clipboard.writeText(finalTranscript.trim())
                    .then(() => showToast('Text copied to clipboard!'))
                    .catch(err => showToast('Failed to copy text.', 'error'));
            }
        });
    }

    // 12. JSON Formatter
    function initJsonFormatter() {
        const contentDiv = document.getElementById('json-formatter-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="json-input">Paste JSON here:</label>
                <textarea id="json-input" rows="10" placeholder='{"name": "QuickTools", "version": 1, "features": ["fast", "free"]}'></textarea>
            </div>
            <button id="json-format-btn" class="btn">Format/Validate JSON</button>
            <div class="form-group" style="margin-top: 1rem;">
                <label for="json-output">Formatted JSON:</label>
                <textarea id="json-output" rows="10" readonly style="background-color: var(--bg-color); border: 1px solid var(--header-bg);"></textarea>
            </div>
            <div id="json-error" style="color: #ff6b6b; margin-top: 0.5rem; font-weight:bold;"></div>
        `;
        const inputArea = document.getElementById('json-input');
        const outputArea = document.getElementById('json-output');
        const formatBtn = document.getElementById('json-format-btn');
        const errorDiv = document.getElementById('json-error');

        formatBtn.addEventListener('click', () => {
            errorDiv.textContent = '';
            outputArea.value = '';
            const inputText = inputArea.value.trim();
            if (!inputText) {
                showToast('Input is empty.', 'info');
                return;
            }
            try {
                const jsonObj = JSON.parse(inputText);
                outputArea.value = JSON.stringify(jsonObj, null, 4);
                showToast('JSON is valid and formatted!', 'success');
            } catch (e) {
                errorDiv.textContent = `Invalid JSON: ${e.message}`;
                showToast('Invalid JSON input.', 'error');
            }
        });
    }

    // 13. BMI Calculator
    function initBmiCalculator() {
        const contentDiv = document.getElementById('bmi-calculator-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="bmi-weight">Weight (kg):</label>
                <input type="number" id="bmi-weight" placeholder="e.g., 70" min="0">
            </div>
            <div class="form-group">
                <label for="bmi-height">Height (cm):</label>
                <input type="number" id="bmi-height" placeholder="e.g., 175" min="0">
            </div>
            <button id="bmi-calculate-btn" class="btn">Calculate BMI</button>
            <div class="output-area" id="bmi-result" style="margin-top:1rem;">
                Your BMI will be displayed here.
            </div>
        `;

        const weightInput = document.getElementById('bmi-weight');
        const heightInput = document.getElementById('bmi-height');
        const calculateBtn = document.getElementById('bmi-calculate-btn');
        const resultDiv = document.getElementById('bmi-result');

        calculateBtn.addEventListener('click', () => {
            const weight = parseFloat(weightInput.value);
            const heightCm = parseFloat(heightInput.value);

            if (isNaN(weight) || weight <= 0 || isNaN(heightCm) || heightCm <= 0) {
                showToast('Please enter valid positive weight and height.', 'error');
                resultDiv.innerHTML = '<p>Please enter valid positive weight and height.</p>';
                return;
            }

            const heightM = heightCm / 100;
            const bmi = weight / (heightM * heightM);
            const bmiRounded = bmi.toFixed(2);

            let category = '', color = '';
            if (bmi < 18.5) { category = 'Underweight'; color = '#3498db';}
            else if (bmi < 24.9) { category = 'Normal weight'; color = '#2ecc71'; }
            else if (bmi < 29.9) { category = 'Overweight'; color = '#f1c40f'; }
            else { category = 'Obesity'; color = '#e74c3c'; }

            resultDiv.innerHTML = `
                <p><strong>Your BMI:</strong> <span style="font-size:1.2em; color:${color};">${bmiRounded}</span></p>
                <p><strong>Category:</strong> <span style="color:${color};">${category}</span></p>
            `;
        });
    }

    // 14. Timer/Stopwatch
    function initTimerStopwatch() {
        const contentDiv = document.getElementById('timer-stopwatch-content');
        contentDiv.innerHTML = `
            <div style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--header-bg);">
                <h3>Stopwatch</h3>
                <div id="stopwatch-display" style="font-size: 2.5em; margin-bottom: 10px; color: var(--accent-color); font-family: 'Courier New', Courier, monospace;">00:00:00.000</div>
                <div class="btn-group">
                    <button id="stopwatch-start" class="btn">Start</button>
                    <button id="stopwatch-stop" class="btn" disabled>Stop</button>
                    <button id="stopwatch-reset" class="btn" disabled>Reset</button>
                </div>
            </div>
            <div>
                <h3>Timer</h3>
                <div class="form-group">
                    <label for="timer-hours">Hours:</label><input type="number" id="timer-hours" value="0" min="0" max="23" style="width:60px; margin-right:10px;">
                    <label for="timer-minutes">Minutes:</label><input type="number" id="timer-minutes" value="1" min="0" max="59" style="width:60px; margin-right:10px;">
                    <label for="timer-seconds">Seconds:</label><input type="number" id="timer-seconds" value="0" min="0" max="59" style="width:60px;">
                </div>
                <div id="timer-display" style="font-size: 2.5em; margin-bottom: 10px; color: var(--accent-color); font-family: 'Courier New', Courier, monospace;">00:01:00</div>
                 <div class="btn-group">
                    <button id="timer-start" class="btn">Start</button>
                    <button id="timer-pause" class="btn" disabled>Pause</button>
                    <button id="timer-reset" class="btn" disabled>Reset</button>
                </div>
            </div>
        `;
        // Stopwatch logic
        const swDisplay = document.getElementById('stopwatch-display');
        const swStartBtn = document.getElementById('stopwatch-start');
        const swStopBtn = document.getElementById('stopwatch-stop');
        const swResetBtn = document.getElementById('stopwatch-reset');
        let swInterval, swStartTime, swElapsedTime = 0;

        function formatSWTime(ms) {
            const d = new Date(ms);
            return `${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}:${String(d.getUTCMilliseconds()).padStart(3, '0')}`;
        }
        swStartBtn.addEventListener('click', () => {
            swStartTime = Date.now() - swElapsedTime;
            swInterval = setInterval(() => { swElapsedTime = Date.now() - swStartTime; swDisplay.textContent = formatSWTime(swElapsedTime); }, 10);
            swStartBtn.disabled = true; swStopBtn.disabled = false; swResetBtn.disabled = false;
        });
        swStopBtn.addEventListener('click', () => {
            clearInterval(swInterval);
            swStartBtn.disabled = false; swStopBtn.disabled = true;
        });
        swResetBtn.addEventListener('click', () => {
            clearInterval(swInterval); swElapsedTime = 0; swDisplay.textContent = formatSWTime(0);
            swStartBtn.disabled = false; swStopBtn.disabled = true; swResetBtn.disabled = true;
        });

        // Timer logic
        const tDisplay = document.getElementById('timer-display');
        const tHoursInput = document.getElementById('timer-hours');
        const tMinsInput = document.getElementById('timer-minutes');
        const tSecsInput = document.getElementById('timer-seconds');
        const tStartBtn = document.getElementById('timer-start');
        const tPauseBtn = document.getElementById('timer-pause');
        const tResetBtn = document.getElementById('timer-reset');
        let tInterval, tEndTime, tRemainingTime, tIsPaused = false;

        function setTimerInputsDisabled(disabled) {
            tHoursInput.disabled = disabled;
            tMinsInput.disabled = disabled;
            tSecsInput.disabled = disabled;
        }

        function formatTimerDisplay(ms) {
            if (ms < 0) ms = 0;
            const totalSeconds = Math.floor(ms / 1000);
            const h = String(Math.floor(totalSeconds / 3600)).padStart(2,'0');
            const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const s = String(totalSeconds % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
        
        function updateTimerDisplayFromInputs() {
             const h = parseInt(tHoursInput.value) || 0;
             const m = parseInt(tMinsInput.value) || 0;
             const s = parseInt(tSecsInput.value) || 0;
             tRemainingTime = (h * 3600 + m * 60 + s) * 1000;
             tDisplay.textContent = formatTimerDisplay(tRemainingTime);
        }
        [tHoursInput, tMinsInput, tSecsInput].forEach(input => input.addEventListener('change', updateTimerDisplayFromInputs));
        updateTimerDisplayFromInputs(); // Initial display

        tStartBtn.addEventListener('click', () => {
            if (tIsPaused) { 
                tEndTime = Date.now() + tRemainingTime;
                tIsPaused = false;
            } else { 
                updateTimerDisplayFromInputs(); // Get current values from input
                if (tRemainingTime <= 0) { showToast('Set a valid duration.', 'error'); return; }
                tEndTime = Date.now() + tRemainingTime;
            }
            
            clearInterval(tInterval);
            tInterval = setInterval(() => {
                tRemainingTime = tEndTime - Date.now();
                if (tRemainingTime <= 0) {
                    clearInterval(tInterval); tDisplay.textContent = formatTimerDisplay(0);
                    showToast('Timer Finished!', 'info');
                    // Optional: Play sound
                    tStartBtn.disabled = false; tStartBtn.textContent = "Start"; tPauseBtn.disabled = true; setTimerInputsDisabled(false);
                } else {
                    tDisplay.textContent = formatTimerDisplay(tRemainingTime);
                }
            }, 200);

            tStartBtn.disabled = true; tPauseBtn.disabled = false; tResetBtn.disabled = false; setTimerInputsDisabled(true);
        });
        tPauseBtn.addEventListener('click', () => {
            clearInterval(tInterval); tIsPaused = true;
            tStartBtn.disabled = false; tStartBtn.textContent = "Resume"; tPauseBtn.disabled = true;
        });
        tResetBtn.addEventListener('click', () => {
            clearInterval(tInterval); tIsPaused = false; updateTimerDisplayFromInputs();
            tStartBtn.disabled = false; tStartBtn.textContent = "Start"; 
            tPauseBtn.disabled = true; tResetBtn.disabled = true; setTimerInputsDisabled(false);
        });
    }

    // --- Stubs for more complex or remaining tools ---
    function initImageCropper() {
        const contentDiv = document.getElementById('image-cropper-content');
        contentDiv.innerHTML = `
            <p><strong>Image Cropper (Basic Concept)</strong></p>
            <div class="form-group">
                <label for="crop-file">Upload Image:</label>
                <input type="file" id="crop-file" accept="image/*">
            </div>
            <canvas id="crop-canvas" style="border:1px solid #ccc; max-width:100%; display:none;"></canvas>
            <div id="crop-download-container" style="text-align:center; margin-top:1rem;"></div>
            <p><em>A full interactive image cropper requires significant canvas event handling (mousedown, mousemove, mouseup for selection box) which is complex for this scope. This is a placeholder.</em></p>`;
        
        const fileInput = document.getElementById('crop-file');
        const canvas = document.getElementById('crop-canvas');
        const ctx = canvas.getContext('2d');
        const downloadContainer = document.getElementById('crop-download-container');

        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = event => {
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width / 2; // Example: crop to half size for demo
                    canvas.height = img.height / 2;
                    ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2); // Draw a portion
                    canvas.style.display = 'block';
                    
                    canvas.toBlob(blob => {
                        if (blob) {
                            const link = createFileDownloadLink(blob, 'cropped_image.png', 'Download Cropped (Demo)');
                            downloadContainer.innerHTML = '';
                            downloadContainer.appendChild(link);
                        }
                    }, 'image/png');
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        });
    }
    function initVideoConverter() {
        const contentDiv = document.getElementById('video-converter-content');
        contentDiv.innerHTML = `<p><strong>Video Converter Limitations</strong></p>
                                <p>Direct video file format conversion (e.g., MP4 to WebM) in the browser is extremely complex and typically requires WebAssembly (WASM) ports of libraries like FFmpeg. This is beyond browser-native capabilities.</p>
                                <p>What is possible: Recording video from webcam/screen (often to WebM or MP4 depending on browser via <code>MediaRecorder</code> API).</p>
                                <p><em>This tool is a placeholder due to these constraints.</em></p>`;
    }
    function initAudioConverter() {
        const contentDiv = document.getElementById('audio-converter-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="ac-audio-file">Upload Audio (MP3 or WAV):</label>
                <input type="file" id="ac-audio-file" accept=".mp3,.wav">
            </div>
            <button id="ac-mp3-to-wav-btn" class="btn" disabled>Convert MP3 to WAV</button>
            <div id="ac-download-container" style="text-align:center; margin-top:1rem;"></div>
            <p style="margin-top:1rem; font-size:0.9em;"><em>WAV to MP3 conversion requires an MP3 encoder library, not native to browsers.</em></p>`;

        const fileInput = document.getElementById('ac-audio-file');
        const convertBtn = document.getElementById('ac-mp3-to-wav-btn');
        const downloadContainer = document.getElementById('ac-download-container');
        let audioFile = null;

        fileInput.addEventListener('change', e => {
            audioFile = e.target.files[0];
            convertBtn.disabled = !audioFile || !audioFile.name.toLowerCase().endsWith('.mp3');
            downloadContainer.innerHTML = '';
        });

        convertBtn.addEventListener('click', async () => {
            if (!audioFile) return;
            setLoading('audio-converter', true);
            try {
                const arrayBuffer = await audioFile.arrayBuffer();
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                
                const wavBlob = audioBufferToWavBlob(audioBuffer); // Helper function
                const link = createFileDownloadLink(wavBlob, audioFile.name.replace(/\.[^/.]+$/, "") + '.wav', 'Download WAV');
                downloadContainer.innerHTML = '';
                downloadContainer.appendChild(link);
                showToast('MP3 to WAV conversion successful!');
            } catch (err) {
                showToast(`Audio conversion error: ${err.message}`, 'error');
                console.error(err);
            } finally {
                setLoading('audio-converter', false);
            }
        });
        
        // Simplified helper to create WAV blob from AudioBuffer
        function audioBufferToWavBlob(buffer) {
            const numOfChan = buffer.numberOfChannels,
                  len = buffer.length * numOfChan * 2 + 44, // 2 bytes per sample (16-bit)
                  wavBuffer = new ArrayBuffer(len),
                  view = new DataView(wavBuffer),
                  channels = [],
                  sampleRate = buffer.sampleRate;
            let offset = 0, pos = 0;

            function writeString(s) { for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i)); }
            
            writeString('RIFF'); offset += 4;
            view.setUint32(offset, len - 8, true); offset += 4; // ChunkSize
            writeString('WAVE'); offset += 4;
            writeString('fmt '); offset += 4;
            view.setUint32(offset, 16, true); offset += 4; // Subchunk1Size (16 for PCM)
            view.setUint16(offset, 1, true); offset += 2; // AudioFormat (1 for PCM)
            view.setUint16(offset, numOfChan, true); offset += 2; // NumChannels
            view.setUint32(offset, sampleRate, true); offset += 4; // SampleRate
            view.setUint32(offset, sampleRate * numOfChan * 2, true); offset += 4; // ByteRate
            view.setUint16(offset, numOfChan * 2, true); offset += 2; // BlockAlign
            view.setUint16(offset, 16, true); offset += 2; // BitsPerSample
            writeString('data'); offset += 4;
            view.setUint32(offset, len - pos - 4, true); offset += 4; // Subchunk2Size (data size)

            for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));

            while (pos < buffer.length) {
                for (let i = 0; i < numOfChan; i++) {
                    let sample = Math.max(-1, Math.min(1, channels[i][pos])); // Clamp
                    sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF); // Scale to 16-bit signed int
                    view.setInt16(offset, sample, true);
                    offset += 2;
                }
                pos++;
            }
            return new Blob([view], { type: 'audio/wav' });
        }
    }
    function initAudioTrimmer() {
        const contentDiv = document.getElementById('audio-trimmer-content');
        contentDiv.innerHTML = `<p><strong>Audio Trimmer (Concept)</strong></p>
                                <p>Upload audio, decode with Web Audio API, set start/end times (e.g., via input fields or a visual waveform - complex), create new AudioBuffer with the slice, then encode to WAV.</p>
                                <p><em>This involves detailed Web Audio API manipulation and is a placeholder.</em></p>`;
    }
    function initUnitConverter() {
        const contentDiv = document.getElementById('unit-converter-content');
        contentDiv.innerHTML = `
            <div class="form-group">
                <label for="uc-category">Category:</label>
                <select id="uc-category">
                    <option value="length">Length</option>
                    <option value="weight">Weight</option>
                    <option value="temperature">Temperature</option>
                </select>
            </div>
            <div class="form-group">
                <label for="uc-input-value">Input Value:</label>
                <input type="number" id="uc-input-value" value="1">
                <select id="uc-from-unit" style="width:auto; margin-left:5px;"></select>
            </div>
            <div class="form-group">
                 <label for="uc-to-unit">To Unit:</label>
                 <select id="uc-to-unit" style="width:auto;"></select>
            </div>
            <button id="uc-convert-btn" class="btn">Convert</button>
            <div class="output-area" id="uc-result" style="margin-top:1rem;">Result will show here.</div>
        `;

        const categorySelect = document.getElementById('uc-category');
        const inputValue = document.getElementById('uc-input-value');
        const fromUnitSelect = document.getElementById('uc-from-unit');
        const toUnitSelect = document.getElementById('uc-to-unit');
        const convertBtn = document.getElementById('uc-convert-btn');
        const resultDiv = document.getElementById('uc-result');

        const units = {
            length: { // Base unit: meter
                meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001,
                mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254
            },
            weight: { // Base unit: kilogram
                kilogram: 1, gram: 0.001, milligram: 0.000001, metric_ton: 1000,
                pound: 0.453592, ounce: 0.0283495
            },
            temperature: { // Special handling
                celsius: 'celsius', fahrenheit: 'fahrenheit', kelvin: 'kelvin'
            }
        };

        function populateUnits() {
            const category = categorySelect.value;
            fromUnitSelect.innerHTML = '';
            toUnitSelect.innerHTML = '';
            for (const unit in units[category]) {
                fromUnitSelect.add(new Option(unit.replace('_', ' '), unit));
                toUnitSelect.add(new Option(unit.replace('_', ' '), unit));
            }
            if (category === 'length') { // Set sensible defaults
                 fromUnitSelect.value = 'meter'; toUnitSelect.value = 'foot';
            } else if (category === 'weight') {
                 fromUnitSelect.value = 'kilogram'; toUnitSelect.value = 'pound';
            } else { // temperature
                 fromUnitSelect.value = 'celsius'; toUnitSelect.value = 'fahrenheit';
            }
        }
        categorySelect.addEventListener('change', populateUnits);
        
        convertBtn.addEventListener('click', () => {
            const category = categorySelect.value;
            const fromUnit = fromUnitSelect.value;
            const toUnit = toUnitSelect.value;
            const val = parseFloat(inputValue.value);
            if (isNaN(val)) { resultDiv.textContent = 'Invalid input value.'; return; }

            let result;
            if (category === 'temperature') {
                if (fromUnit === toUnit) result = val;
                else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = (val * 9/5) + 32;
                else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = val + 273.15;
                else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (val - 32) * 5/9;
                else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') result = ((val - 32) * 5/9) + 273.15;
                else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = val - 273.15;
                else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') result = ((val - 273.15) * 9/5) + 32;
                else { resultDiv.textContent = 'Conversion not supported.'; return; }
                result = result.toFixed(2);
            } else {
                const baseValue = val * units[category][fromUnit];
                result = (baseValue / units[category][toUnit]).toFixed(5); // Adjust precision as needed
            }
            resultDiv.textContent = `${val} ${fromUnit.replace('_',' ')} = ${result} ${toUnit.replace('_',' ')}`;
        });
        populateUnits(); // Initial population
    }


    // --- Initialize All Tools ---
    function initAllTools() {
        initQrGenerator();          // 1
        initPasswordGenerator();    // 2
        initImageConverterOrCompressor('image-converter', false); // 3
        initImageConverterOrCompressor('image-compressor', true); // 4
        initImageCropper();         // 5 (Basic stub)
        initVideoConverter();       // 6 (Placeholder)
        initAudioConverter();       // 7 (MP3 to WAV implemented)
        initAudioTrimmer();         // 8 (Placeholder)
        initAgeCalculator();        // 9
        initEmiCalculator();        // 10
        initSipCalculator();        // 11
        initWordCounter();          // 12
        initBase64Coder();          // 13
        initColorPicker();          // 14
        initTextToSpeech();         // 15
        initSpeechToText();         // 16
        initJsonFormatter();        // 17
        initUnitConverter();        // 18 (Implemented basic length, weight, temp)
        initBmiCalculator();        // 19
        initTimerStopwatch();       // 20
    }

    initAllTools();
    handleHashChange(); // Initial page load based on hash

    // Fade-in on scroll for tool cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: unobserve after animation
            }
        });
    }, { threshold: 0.05 }); // Trigger a bit earlier

    document.querySelectorAll('#tools-grid .tool-card').forEach(el => {
        observer.observe(el);
    });
});