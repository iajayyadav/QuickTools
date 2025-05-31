// Image Metadata Remover Tool
import { showToast, createFileDownloadLink } from '../main.js';

export function init() {
    const container = document.getElementById('image-metadata-remover-content');
    if (!container) {
        console.error('Image Metadata Remover: Container not found');
        return;
    }

    // Create a unique scope ID
    const scopeId = 'image-metadata-remover-' + Math.random().toString(36).substr(2, 9);
    container.setAttribute('data-scope', scopeId);

    // Initialize the UI
    initializeUI(container, scopeId);
}

function initializeUI(container, scopeId) {
    // Render the initial HTML
    container.innerHTML = `
        <div class="imr-container">
            <!-- Upload Section -->
            <div class="imr-upload-section">
                <div class="imr-upload-area" id="uploadArea">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drop your image here or click to upload</p>
                    <input type="file" id="fileInput" accept="image/*" class="imr-file-input">
                </div>
            </div>

            <!-- Preview Section (Initially Hidden) -->
            <div class="imr-preview-section" id="previewSection" style="display: none;">
                <div class="imr-preview-container">
                    <img id="imagePreview" class="imr-preview-image" alt="Preview">
                </div>
                
                <div class="imr-metadata-section">
                    <h3>Image Metadata</h3>
                    <div id="metadataDisplay" class="imr-metadata-content"></div>
                </div>

                <div class="imr-actions">
                    <button id="removeMetadataBtn" class="imr-btn imr-primary-btn">
                        <i class="fas fa-eraser"></i> Remove Metadata
                    </button>
                    <button id="downloadBtn" class="imr-btn" disabled>
                        <i class="fas fa-download"></i> Download Clean Image
                    </button>
                </div>
            </div>
        </div>

        <style>
            [data-scope="${scopeId}"] .imr-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }

            [data-scope="${scopeId}"] .imr-upload-area {
                border: 2px dashed var(--border-color);
                border-radius: 8px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--tool-card-bg);
            }

            [data-scope="${scopeId}"] .imr-upload-area:hover,
            [data-scope="${scopeId}"] .imr-upload-area.drag-over {
                border-color: var(--accent-color);
                background: var(--bg-color);
            }

            [data-scope="${scopeId}"] .imr-upload-area i {
                font-size: 48px;
                color: var(--accent-color);
                margin-bottom: 15px;
            }

            [data-scope="${scopeId}"] .imr-file-input {
                display: none;
            }

            [data-scope="${scopeId}"] .imr-preview-section {
                margin-top: 20px;
                background: var(--tool-card-bg);
                border-radius: 8px;
                padding: 20px;
            }

            [data-scope="${scopeId}"] .imr-preview-image {
                max-width: 100%;
                border-radius: 8px;
                margin-bottom: 20px;
            }

            [data-scope="${scopeId}"] .imr-metadata-section {
                background: var(--bg-color);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            }

            [data-scope="${scopeId}"] .imr-metadata-content {
                margin-top: 10px;
            }

            [data-scope="${scopeId}"] .imr-metadata-item {
                padding: 8px;
                border-bottom: 1px solid var(--border-color);
            }

            [data-scope="${scopeId}"] .imr-metadata-item:last-child {
                border-bottom: none;
            }

            [data-scope="${scopeId}"] .imr-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            [data-scope="${scopeId}"] .imr-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                background: var(--bg-color);
                color: var(--text-color);
            }

            [data-scope="${scopeId}"] .imr-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            [data-scope="${scopeId}"] .imr-btn:not(:disabled):hover {
                transform: translateY(-2px);
            }

            [data-scope="${scopeId}"] .imr-primary-btn {
                background: var(--accent-color);
                color: white;
            }

            @media (max-width: 768px) {
                [data-scope="${scopeId}"] .imr-container {
                    padding: 10px;
                }

                [data-scope="${scopeId}"] .imr-actions {
                    flex-direction: column;
                }

                [data-scope="${scopeId}"] .imr-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        </style>
    `;

    // Get DOM elements
    const elements = {
        uploadArea: document.getElementById('uploadArea'),
        fileInput: document.getElementById('fileInput'),
        previewSection: document.getElementById('previewSection'),
        imagePreview: document.getElementById('imagePreview'),
        metadataDisplay: document.getElementById('metadataDisplay'),
        removeMetadataBtn: document.getElementById('removeMetadataBtn'),
        downloadBtn: document.getElementById('downloadBtn')
    };

    // Store the current image data
    let currentImageData = null;

    // Handle file selection
    function handleImageSelection(file) {
        if (!file || !file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
        }

        // Reset UI state
        elements.downloadBtn.disabled = true;
        elements.metadataDisplay.innerHTML = '<p>Reading metadata...</p>';

        // Read and display the image
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.imagePreview.src = e.target.result;
            elements.previewSection.style.display = 'block';
            currentImageData = e.target.result;

            // Extract metadata
            extractMetadata(file).then(displayMetadata);
        };
        reader.readAsDataURL(file);
    }

    // Extract metadata from image
    async function extractMetadata(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const view = new DataView(e.target.result);
                const metadata = {};

                try {
                    let offset = 0;
                    if (view.getUint16(offset) === 0xFFD8) { // JPEG
                        offset += 2;
                        while (offset < view.byteLength) {
                            if (view.getUint16(offset) === 0xFFE1) {
                                const exifData = parseExifData(view, offset);
                                Object.assign(metadata, exifData);
                                break;
                            }
                            offset += 2 + view.getUint16(offset + 2);
                        }
                    }
                } catch (error) {
                    console.error('Error reading metadata:', error);
                }

                resolve(metadata);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    // Parse EXIF data
    function parseExifData(view, offset) {
        const data = {};
        try {
            const exifStart = offset + 4;
            if (view.getUint32(exifStart) === 0x45786966) { // 'Exif'
                const tiffOffset = exifStart + 6;
                const littleEndian = view.getUint16(tiffOffset) === 0x4949;
                const offset = tiffOffset + 8;
                const numEntries = view.getUint16(offset, littleEndian);

                // Parse basic EXIF tags
                for (let i = 0; i < numEntries; i++) {
                    const entryOffset = offset + 2 + (i * 12);
                    const tag = view.getUint16(entryOffset, littleEndian);
                    const value = view.getUint32(entryOffset + 8, littleEndian);

                    switch(tag) {
                        case 0x0110: data.Camera = value; break;
                        case 0x9003: data.DateTaken = value; break;
                        case 0x8769: data.ExifVersion = value; break;
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing EXIF:', error);
        }
        return data;
    }

    // Display metadata in UI
    function displayMetadata(metadata) {
        const entries = Object.entries(metadata);
        if (entries.length === 0) {
            elements.metadataDisplay.innerHTML = '<p>No metadata found in image.</p>';
            return;
        }

        const html = entries.map(([key, value]) => `
            <div class="imr-metadata-item">
                <strong>${key}:</strong> ${value}
            </div>
        `).join('');
        elements.metadataDisplay.innerHTML = html;
    }

    // Remove metadata and prepare for download
    function removeMetadata() {
        const img = elements.imagePreview;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw image without metadata
        ctx.drawImage(img, 0, 0);

        // Convert to clean blob
        canvas.toBlob((blob) => {
            // Enable download with clean image
            elements.downloadBtn.disabled = false;
            elements.downloadBtn.onclick = () => {
                createFileDownloadLink(blob, 'clean_image.png').click();
            };

            // Update preview with clean image
            const cleanUrl = URL.createObjectURL(blob);
            elements.imagePreview.src = cleanUrl;

            showToast('Metadata successfully removed');
            
            // Update metadata display
            elements.metadataDisplay.innerHTML = '<p>All metadata has been removed.</p>';
        }, 'image/png');
    }

    // Event Listeners
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', (e) => handleImageSelection(e.target.files[0]));
    elements.removeMetadataBtn.addEventListener('click', removeMetadata);

    // Drag and Drop handlers
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.add('drag-over');
    });

    elements.uploadArea.addEventListener('dragleave', () => {
        elements.uploadArea.classList.remove('drag-over');
    });

    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('drag-over');
        handleImageSelection(e.dataTransfer.files[0]);
    });
} 