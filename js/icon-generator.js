// icon-generator.js
async function generateIcons() {
    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Define all required icon sizes
    const iconSizes = [
        { name: 'icon-72x72', width: 72, height: 72 },
        { name: 'icon-96x96', width: 96, height: 96 },
        { name: 'icon-128x128', width: 128, height: 128 },
        { name: 'icon-144x144', width: 144, height: 144 },
        { name: 'icon-152x152', width: 152, height: 152 },
        { name: 'icon-192x192', width: 192, height: 192 },
        { name: 'icon-384x384', width: 384, height: 384 },
        { name: 'icon-512x512', width: 512, height: 512 },
        { name: 'ms-icon-70x70', width: 70, height: 70 },
        { name: 'ms-icon-144x144', width: 144, height: 144 },
        { name: 'ms-icon-150x150', width: 150, height: 150 },
        { name: 'ms-icon-310x150', width: 310, height: 150 },
        { name: 'ms-icon-310x310', width: 310, height: 310 }
    ];

    // Load the current favicon
    const faviconUrl = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>';
    const favicon = new Image();
    await new Promise((resolve) => {
        favicon.onload = resolve;
        favicon.src = faviconUrl;
    });

    // Create icons directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    const iconsDir = path.join(__dirname, '../assets/icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Generate and save each icon size
    for (const size of iconSizes) {
        // Set canvas size
        canvas.width = size.width;
        canvas.height = size.height;

        // Draw favicon centered on canvas
        const x = (size.width - 100) / 2;
        const y = (size.height - 100) / 2;
        ctx.drawImage(favicon, x, y, 100, 100);

        // Create PNG data URL
        const pngData = canvas.toDataURL('image/png');

        // Save to file
        const base64Data = pngData.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(iconsDir, `${size.name}.png`);
        fs.writeFileSync(filePath, buffer);

        console.log(`Generated: ${size.name}.png (${size.width}x${size.height})`);
    }

    console.log('All icons generated successfully!');
}

// Run the generator when the script is loaded
document.addEventListener('DOMContentLoaded', generateIcons);
