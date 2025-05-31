import { showToast, setLoading, createFileDownloadLink } from '../main.js';

export function init() {
    const contentDiv = document.getElementById('qr-generator-content');
    
    const styles = {
        seoContent: `
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
            color: var(--text-color);
            line-height: 1.6;
        `,
        heading: `
            color: var(--text-color);
            margin: 1.5rem 0 1rem;
            font-size: 1.5em;
        `,
        subheading: `
            color: var(--text-color);
            margin: 1.5rem 0 1rem;
            font-size: 1.2em;
        `,
        paragraph: `
            margin-bottom: 1rem;
            color: var(--text-color);
            line-height: 1.6;
        `,
        featureList: `
            list-style: disc;
            margin: 1rem 0 1rem 1.5rem;
        `,
        featureItem: `
            margin-bottom: 0.5rem;
            color: var(--text-color);
        `,
        useCaseList: `
            list-style: none;
            margin: 1rem 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        `,
        useCaseItem: `
            background: var(--tool-card-bg);
            padding: 1rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--soft-box-shadow);
        `
    };

    contentDiv.innerHTML = `
        <div class="qr-tool-container">
            <div style="margin-bottom: 2rem; padding: 1rem; background: var(--tool-card-bg); border-radius: var(--border-radius-lg); text-align: center;">
                <p style="margin-bottom: 1rem;">Need more advanced features? Try our enhanced QR Code Generator with custom logos, advanced styling, and more!</p>
                <a href="https://qrcodegeneratorpro.netlify.app/" target="_blank" class="btn" style="background-color: var(--accent-color);">
                    <i class="fas fa-external-link-alt"></i> Try Advanced QR Generator
                </a>
            </div>
            <div class="form-group">
                <label for="qr-text">Text or URL:</label>
                <input type="text" id="qr-text" placeholder="Enter text or URL">
            </div>
            <details>
                <summary style="margin-bottom: 1.5rem;">More Options</summary>
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
            </details>
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
        </div>

        <div style="${styles.seoContent}">
            <h2 style="${styles.heading}">Free QR Code Generator</h2>
            <p style="${styles.paragraph}">
                Create customizable QR codes instantly with our free QR code generator. Whether you need 
                to share links, contact information, or any text-based data, our tool makes it easy to 
                generate professional QR codes with advanced customization options.
            </p>

            <h3 style="${styles.subheading}">Features</h3>
            <ul style="${styles.featureList}">
                <li style="${styles.featureItem}">Custom colors for QR code and background</li>
                <li style="${styles.featureItem}">Adjustable size settings (100x100 to 400x400 pixels)</li>
                <li style="${styles.featureItem}">Logo integration capability</li>
                <li style="${styles.featureItem}">Multiple download formats (PNG and PDF)</li>
                <li style="${styles.featureItem}">High-quality vector output</li>
                <li style="${styles.featureItem}">Mobile-friendly design</li>
            </ul>

            <h3 style="${styles.subheading}">Popular Use Cases</h3>
            <div style="${styles.useCaseList}">
                <div style="${styles.useCaseItem}">
                    <h4>Business Cards</h4>
                    <p>Add contact information and website links to digital business cards.</p>
                </div>
                <div style="${styles.useCaseItem}">
                    <h4>Marketing Materials</h4>
                    <p>Link print materials to digital content and landing pages.</p>
                </div>
                <div style="${styles.useCaseItem}">
                    <h4>Product Packaging</h4>
                    <p>Include product information, manuals, and registration links.</p>
                </div>
                <div style="${styles.useCaseItem}">
                    <h4>Event Management</h4>
                    <p>Share event details, tickets, and registration information.</p>
                </div>
            </div>

            <h3 style="${styles.subheading}">How QR Codes Work</h3>
            <p style="${styles.paragraph}">
                QR (Quick Response) codes are two-dimensional barcodes that can store various types of 
                information. When scanned with a smartphone camera or QR code reader, they instantly 
                provide access to the encoded information, whether it's a website URL, plain text, 
                contact details, or other data formats.
            </p>

            <h3 style="${styles.subheading}">Best Practices</h3>
            <p style="${styles.paragraph}">
                For optimal QR code performance, consider these tips:
            </p>
            <ul style="${styles.featureList}">
                <li style="${styles.featureItem}">Ensure sufficient contrast between QR code and background colors</li>
                <li style="${styles.featureItem}">Test your QR code on multiple devices before publishing</li>
                <li style="${styles.featureItem}">Keep the encoded data concise for better scanning reliability</li>
                <li style="${styles.featureItem}">If adding a logo, ensure it doesn't interfere with the QR code pattern</li>
                <li style="${styles.featureItem}">Choose an appropriate size based on scanning distance</li>
            </ul>

            <h3 style="${styles.subheading}">Technical Specifications</h3>
            <p style="${styles.paragraph}">
                Our QR code generator creates high-quality codes using the latest QR code standards. 
                The generated codes support error correction and can be customized with various options 
                including custom colors, sizes, and logo integration. Downloads are available in both 
                PNG format for digital use and PDF format for professional printing.
            </p>
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