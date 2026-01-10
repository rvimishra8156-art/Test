const fs = require('fs');
const path = require('path');
const https = require('https');
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);
const PRODUCTS_PATH = path.join(__dirname, '..', 'data', 'products.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// Ensure images dir exists
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

// Helper to download image
async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode} ${url}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log(`Processing ${products.length} products...`);

    for (const product of products) { // Sequential to avoid flooding
        const currentImages = product.images.filter(img => !img.endsWith('.svg')); // Ignore placeholders
        const targetCount = 5;
        const needed = targetCount - currentImages.length;

        if (needed <= 0) {
            console.log(`Skipping ${product.id} (already has ${currentImages.length})`);
            product.images = currentImages; // Just clean up SVGs if any
            continue;
        }

        console.log(`Fetching ${needed} images for ${product.id} (${product.name})...`);

        const keywords = `${product.category},wood,${product.tags[0] || 'furniture'}`;
        const newImages = [];

        for (let i = 0; i < needed; i++) {
            const uniqueId = Date.now() + Math.random().toString().slice(2, 6);
            const filename = `${product.id}-gen-${uniqueId}.jpg`;
            const filepath = path.join(IMAGES_DIR, filename);
            // Random lock to get different images
            const url = `https://loremflickr.com/800/800/${keywords}?lock=${product.id}${i}`;

            try {
                await downloadImage(url, filepath);
                newImages.push(`/images/${filename}`);
                process.stdout.write('.');
            } catch (err) {
                console.error(`Error downloading for ${product.id}:`, err.message);
            }
            await sleep(500); // 500ms delay between requests
        }

        product.images = [...currentImages, ...newImages];
        console.log(' Done.');
    }

    // Save updated products
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
    console.log('\nAll products updated and saved.');
}

main().catch(console.error);
