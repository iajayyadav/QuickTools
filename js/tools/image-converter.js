import { showToast, setLoading, createFileDownloadLink } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('image-converter-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="image-converter-file">Upload Image:</label>
            <input type="file" id="image-converter-file" accept="image/jpeg, image/png, image/webp">
        </div>
        <div class="form-group">
            <label for="image-converter-format">Convert to:</label>
            <select id="image-converter-format">
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
            </select>
        </div>
        <div class="form-group" id="image-converter-quality-group">
            <label for="image-converter-quality">Quality (for JPEG/WEBP): <span id="image-converter-quality-value">0.9</span></label>
            <input type="range" id="image-converter-quality" min="0.1" max="1.0" step="0.05" value="0.9" style="width:100%;">
        </div>
        <button id="image-converter-process-btn" class="btn" disabled>Convert & Download</button>
        <div class="preview-area" style="text-align:center;">
            <img id="image-converter-preview" style="max-width:100%; display:none;">
            <p id="image-converter-original-size" style="font-size:0.9em; margin-top:0.5em;"></p>
            <p id="image-converter-processed-size" style="font-size:0.9em; margin-top:0.5em;"></p>
        </div>
        <div id="image-converter-download-container" style="text-align:center;"></div>
    `;

    const fileInput = document.getElementById('image-converter-file');
    const formatSelect = document.getElementById('image-converter-format');
    const qualityGroup = document.getElementById('image-converter-quality-group');
    const qualityInput = document.getElementById('image-converter-quality');
    const qualityValue = document.getElementById('image-converter-quality-value');
    const processBtn = document.getElementById('image-converter-process-btn');
    const previewImg = document.getElementById('image-converter-preview');
    const downloadContainer = document.getElementById('image-converter-download-container');
    const originalSizeEl = document.getElementById('image-converter-original-size');
    const processedSizeEl = document.getElementById('image-converter-processed-size');

    let originalFile = null;

    fileInput.addEventListener('change', (e) => {
        originalFile = e.target.files[0];
        downloadContainer.innerHTML = '';
        originalSizeEl.textContent = '';
        processedSizeEl.textContent = '';
        
        if (originalFile) {
            originalSizeEl.textContent = `Original size: ${(originalFile.size / 1024).toFixed(2)} KB`;
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                processBtn.disabled = false;
            }
            reader.readAsDataURL(originalFile);
            
            qualityGroup.style.display = 
                (formatSelect.value === 'image/jpeg' || formatSelect.value === 'image/webp') 
                ? 'block' : 'none';
        } else {
            previewImg.style.display = 'none';
            processBtn.disabled = true;
            originalFile = null;
        }
    });

    formatSelect.addEventListener('change', () => {
        qualityGroup.style.display = 
            (formatSelect.value === 'image/jpeg' || formatSelect.value === 'image/webp') 
            ? 'block' : 'none';
    });

    qualityInput.addEventListener('input', () => {
        qualityValue.textContent = qualityInput.value;
    });

    processBtn.addEventListener('click', () => {
        if (!originalFile) {
            showToast('Please upload an image first.', 'error');
            return;
        }

        setLoading('image-converter', true);
        downloadContainer.innerHTML = '';
        processedSizeEl.textContent = '';

        const targetFormat = formatSelect.value;
        const quality = (targetFormat === 'image/jpeg' || targetFormat === 'image/webp') 
            ? parseFloat(qualityInput.value) 
            : undefined;
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            canvas.toBlob(function(blob) {
                if (blob) {
                    processedSizeEl.textContent = `Converted size: ${(blob.size / 1024).toFixed(2)} KB`;
                    const extension = targetFormat.split('/')[1];
                    const fileName = `converted_image.${extension}`;
                    const downloadLink = createFileDownloadLink(blob, fileName, `Download ${extension.toUpperCase()}`);
                    downloadContainer.appendChild(downloadLink);
                    showToast('Image converted successfully!');
                } else {
                    showToast('Error converting image.', 'error');
                }
                setLoading('image-converter', false);
            }, targetFormat, quality);
        };
        
        img.onerror = () => {
            showToast('Error loading image for conversion.', 'error');
            setLoading('image-converter', false);
        };
        
        img.src = URL.createObjectURL(originalFile);
    });
} 