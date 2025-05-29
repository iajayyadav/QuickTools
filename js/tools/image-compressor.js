import { showToast, setLoading, createFileDownloadLink } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('image-compressor-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="image-compressor-file">Upload Image:</label>
            <input type="file" id="image-compressor-file" accept="image/jpeg, image/png, image/webp">
        </div>
        <div class="form-group" id="image-compressor-quality-group">
            <label for="image-compressor-quality">Compression Quality: <span id="image-compressor-quality-value">0.7</span></label>
            <input type="range" id="image-compressor-quality" min="0.1" max="1.0" step="0.05" value="0.7" style="width:100%;">
        </div>
        <button id="image-compressor-process-btn" class="btn" disabled>Compress & Download</button>
        <div class="preview-area" style="text-align:center;">
            <img id="image-compressor-preview" style="max-width:100%; display:none;">
            <p id="image-compressor-original-size" style="font-size:0.9em; margin-top:0.5em;"></p>
            <p id="image-compressor-processed-size" style="font-size:0.9em; margin-top:0.5em;"></p>
        </div>
        <div id="image-compressor-download-container" style="text-align:center;"></div>
    `;

    const fileInput = document.getElementById('image-compressor-file');
    const qualityGroup = document.getElementById('image-compressor-quality-group');
    const qualityInput = document.getElementById('image-compressor-quality');
    const qualityValue = document.getElementById('image-compressor-quality-value');
    const processBtn = document.getElementById('image-compressor-process-btn');
    const previewImg = document.getElementById('image-compressor-preview');
    const downloadContainer = document.getElementById('image-compressor-download-container');
    const originalSizeEl = document.getElementById('image-compressor-original-size');
    const processedSizeEl = document.getElementById('image-compressor-processed-size');

    let originalFile = null;
    let originalType = '';

    fileInput.addEventListener('change', (e) => {
        originalFile = e.target.files[0];
        downloadContainer.innerHTML = '';
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
            
            qualityGroup.style.display = 
                (originalType === 'image/jpeg' || originalType === 'image/webp') 
                ? 'block' : 'none';

            if (originalType === 'image/png') {
                showToast('PNG compression is limited in browser. For best results, use specialized tools.', 'info');
            }
        } else {
            previewImg.style.display = 'none';
            processBtn.disabled = true;
            originalFile = null;
        }
    });

    qualityInput.addEventListener('input', () => {
        qualityValue.textContent = qualityInput.value;
    });

    processBtn.addEventListener('click', () => {
        if (!originalFile) {
            showToast('Please upload an image first.', 'error');
            return;
        }

        setLoading('image-compressor', true);
        downloadContainer.innerHTML = '';
        processedSizeEl.textContent = '';

        const quality = (originalType === 'image/jpeg' || originalType === 'image/webp') 
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
                    processedSizeEl.textContent = `Compressed size: ${(blob.size / 1024).toFixed(2)} KB`;
                    const extension = originalType.split('/')[1];
                    const fileName = `compressed_image.${extension}`;
                    const downloadLink = createFileDownloadLink(blob, fileName, `Download ${extension.toUpperCase()}`);
                    downloadContainer.appendChild(downloadLink);
                    
                    const compressionRatio = ((1 - blob.size / originalFile.size) * 100).toFixed(1);
                    showToast(`Image compressed! Saved ${compressionRatio}% space`);
                } else {
                    showToast('Error compressing image.', 'error');
                }
                setLoading('image-compressor', false);
            }, originalType, quality);
        };
        
        img.onerror = () => {
            showToast('Error loading image for compression.', 'error');
            setLoading('image-compressor', false);
        };
        
        img.src = URL.createObjectURL(originalFile);
    });
} 