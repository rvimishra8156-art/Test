const fs = require('fs');
const https = require('https');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');
const TARGET_DIR = path.join(__dirname, '../public/images/stock');

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Map of ProductID -> { NewImageName, UnsplashID }
const UPDATES = {
    'prod-002': { // Desk Pen Holder
        file: 'stock-pen-holder.jpg',
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
    },
    'prod-004': { // Book Stand (Open book reading)
        file: 'stock-book-stand.jpg',
        url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80'
    },
    'prod-014': { // Remote/Phone Holder (Desk Organizer)
        file: 'stock-remote-holder.jpg',
        url: 'https://images.unsplash.com/photo-1623861217743-6c5844434252?auto=format&fit=crop&w=800&q=80' // Clean wood organizer
    },
    'prod-018': { // Executive Pen Stand
        file: 'stock-executive-pen.jpg',
        url: 'https://images.unsplash.com/photo-1549114674-d07d1887e2b7?auto=format&fit=crop&w=800&q=80' // Nice pen cup
    },
    'prod-032': { // Laptop Stand
        file: 'stock-laptop-stand.jpg',
        url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' // Laptop on desk
    }
};

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(TARGET_DIR, filename);
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadImage(response.headers.location, filename).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve(filename);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function main() {
    // 1. Download Images
    for (const [pid, info] of Object.entries(UPDATES)) {
        try {
            await downloadImage(info.url, info.file);
        } catch (e) {
            console.error(`Failed to download for ${pid}:`, e.message);
        }
    }

    // 2. Update JSON
    const products = require(PRODUCTS_FILE);
    let modified = false;

    products.forEach(p => {
        // Fix for prod-002: Remove specific bad image
        if (p.id === 'prod-002') {
            const badImg = "/images/prod-002-gen-7118.jpg";
            if (p.images.includes(badImg)) {
                p.images = p.images.filter(img => img !== badImg);
                console.log(`Remvoed bad image from prod-002`);
                modified = true;
            }
        }

        // Apply new stock images if applicable
        if (UPDATES[p.id]) {
            const newPath = `/images/stock/${UPDATES[p.id].file}`;

            // Remove the generic 'product-004.png' if prevalent
            p.images = p.images.filter(img => !img.includes('product-004.png'));

            // Add new image at the START
            p.images.unshift(newPath);
            // Ensure unique
            p.images = [...new Set(p.images)];

            console.log(`Updated images for ${p.id}`);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 4));
        console.log("Updated products.json");
    }
}

main();
