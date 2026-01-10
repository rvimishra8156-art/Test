const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'products.json');

function cleanImages() {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const products = JSON.parse(raw);
    let fixedCount = 0;

    products.forEach(p => {
        // Check if images is a string (corruption)
        if (typeof p.images === 'string') {
            console.log(`Fixing ${p.id}...`);
            // Regex to find paths starting with /images/ and ending with extension
            // Handles cases like "/images/a.jpg/images/b.jpg" (missing space)
            const matches = p.images.match(/\/images\/[\w-]+\.(jpg|png|svg|jpeg)/gi);
            if (matches) {
                p.images = [...new Set(matches)]; // Dedupe
            } else {
                p.images = [];
            }
            fixedCount++;
        } else if (!Array.isArray(p.images)) {
            p.images = [];
            fixedCount++;
        }
    });

    fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));
    console.log(`Fixed ${fixedCount} products.`);
}

cleanImages();
