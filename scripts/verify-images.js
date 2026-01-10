const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '..', 'data', 'products.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function verifyImages() {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
    const errors = [];
    const warnings = [];

    console.log(`Verifying ${products.length} products...`);

    products.forEach(p => {
        if (!Array.isArray(p.images) || p.images.length === 0) {
            errors.push(`${p.id}: No images found (value: ${JSON.stringify(p.images)})`);
            return;
        }

        p.images.forEach((img, idx) => {
            // Check file existence
            const headers = img.startsWith('/') ? img : '/' + img;
            const fullPath = path.join(PUBLIC_DIR, headers);
            if (!fs.existsSync(fullPath)) {
                errors.push(`${p.id} [${idx}]: File not found: ${img}`);
            }

            // Check for repetition in filename (basic check)
            const count = p.images.filter(x => x === img).length;
            if (count > 1) {
                warnings.push(`${p.id}: Duplicate image used: ${img}`);
            }
        });

        if (p.images.length < 3) {
            warnings.push(`${p.id}: Low image count (${p.images.length})`);
        }
    });

    console.log("\n=== VERIFICATION REPORT ===");
    if (errors.length === 0) console.log("✅ No missing files.");
    else {
        console.error(`❌ ${errors.length} Missing Files/Errors:`);
        errors.forEach(e => console.error(e));
    }

    if (warnings.length > 0) {
        console.warn(`\n⚠️ ${warnings.length} Warnings (Low count / Duplicates):`);
        warnings.slice(0, 10).forEach(w => console.warn(w));
        if (warnings.length > 10) console.warn(`... and ${warnings.length - 10} more.`);
    }

    if (errors.length > 0) process.exit(1);
}

verifyImages();
