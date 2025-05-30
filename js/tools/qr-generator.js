import { showToast, setLoading, createFileDownloadLink } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('qr-generator-content');
    contentDiv.innerHTML = `
        <div class="form-group">
            <label for="qr-text">Text or URL:</label>
            <input type="text" id="qr-text" placeholder="Enter text or URL">
        </div>
        <div class="form-group">
            <label for="qr-color">QR Code Color:</label>
            <input type="color" id="qr-color" value="#000000">
        </div>
        <div class="form-group">
            <label for="qr-bg-color">Background Color:</label>
            <input type="color" id="qr-bg-color" value="#FFFFFF">
        </div>
        <div class="form-group">
            <label for="qr-logo">Logo URL (optional):</label>
            <input type="url" id="qr-logo" placeholder="https://example.com/logo.png">
        </div>
        <div class="form-group">
            <label for="qr-size">QR Code Size:</label>
            <input type="range" id="qr-size" min="100" max="400" value="200" step="10">
            <span id="qr-size-value">200 x 200</span>
        </div>
        <button id="qr-generate-btn" class="btn">Generate QR Code</button>
        <div class="preview-area" style="text-align:center; margin-top: 1rem;">
            <div id="qr-code-result"></div>
        </div>
        <div class="btn-group" style="display:flex; gap:1rem; justify-content:center; margin-top:1rem;">
            <button id="qr-download-png" class="btn" style="display:none;">Download PNG</button>
            <button id="qr-download-pdf" class="btn" style="display:none;">Download PDF</button>
        </div>
    `;

    const textInput = document.getElementById('qr-text');
    const colorInput = document.getElementById('qr-color');
    const bgColorInput = document.getElementById('qr-bg-color');
    const logoInput = document.getElementById('qr-logo');
    const sizeInput = document.getElementById('qr-size');
    const sizeValue = document.getElementById('qr-size-value');
    const generateBtn = document.getElementById('qr-generate-btn');
    const resultDiv = document.getElementById('qr-code-result');
    const downloadPngBtn = document.getElementById('qr-download-png');
    const downloadPdfBtn = document.getElementById('qr-download-pdf');

    let qrCode = null;

    sizeInput.addEventListener('input', () => {
        sizeValue.textContent = `${sizeInput.value} x ${sizeInput.value}`;
    });

    generateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            showToast('Please enter text or URL.', 'error');
            return;
        }

        setLoading('qr-generator', true);
        resultDiv.innerHTML = '';

        try {
            if (typeof QRCodeStyling === 'undefined') {
                showToast('QR Code Styling library not loaded.', 'error');
                return;
            }

            const size = parseInt(sizeInput.value);
            const options = {
                width: size,
                height: size,
                type: 'canvas',
                data: text,
                dotsOptions: {
                    color: colorInput.value,
                    type: 'rounded'
                },
                backgroundOptions: {
                    color: bgColorInput.value
                },
                cornersSquareOptions: {
                    type: 'square'
                },
                cornersDotOptions: {
                    type: 'dot'
                }
            };

            if (logoInput.value) {
                options.image = logoInput.value;
                options.imageOptions = {
                    crossOrigin: 'anonymous',
                    margin: 10,
                    imageSize: 0.4
                };
            }
            

            qrCode = new QRCodeStyling(options);
            qrCode.append(resultDiv);
            
            downloadPngBtn.style.display = 'block';
            downloadPdfBtn.style.display = 'block';
            showToast('QR Code generated successfully!');

        } catch (err) {
            showToast('Error generating QR Code.', 'error');
            console.error('QR generation error:', err);
        } finally {
            setLoading('qr-generator', false);
        }
    });

    downloadPngBtn.addEventListener('click', () => {
        if (!qrCode) {
            showToast('Generate a QR code first.', 'error');
            return;
        }
        qrCode.download({ 
            name: 'qrcode', 
            extension: 'png' 
        });
    });

    downloadPdfBtn.addEventListener('click', async () => {
        if (!qrCode || typeof window.jspdf === 'undefined') {
            showToast('Generate a QR code first or PDF library not loaded.', 'error');
            return;
        }

        try {
            const canvas = resultDiv.querySelector('canvas');
            if (!canvas) {
                showToast('QR code canvas not found.', 'error');
                return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate positions to center the QR code
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const qrSize = Math.min(pageWidth - 40, pageHeight - 40); // Leave margins
            const x = (pageWidth - qrSize) / 2;
            const y = (pageHeight - qrSize) / 2;

            // Add title
            pdf.setFontSize(16);
            pdf.text('QR Code', pageWidth / 2, 20, { align: 'center' });

            // Add the QR code
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

            // Add the encoded text below
            pdf.setFontSize(12);
            const text = textInput.value.trim();
            pdf.text('Encoded content:', 20, pageHeight - 20);
            pdf.setTextColor(100);
            pdf.text(text, 20, pageHeight - 15);

            pdf.save('qrcode.pdf');
            showToast('PDF downloaded successfully!');
        } catch (err) {
            showToast('Error generating PDF.', 'error');
            console.error('PDF generation error:', err);
        }
    });
} 