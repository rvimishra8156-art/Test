const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure test-results directory exists
const RESULTS_DIR = path.join(__dirname, '..', 'test-results');
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR);
}

const log = (msg) => console.log(`\n[VERIFY] ${msg}`);

async function runStep(name, command) {
    log(`Starting step: ${name}`);
    try {
        execSync(command, { stdio: 'inherit', cwd: process.cwd() });
        log(`Passed: ${name}`);
    } catch (e) {
        console.error(`FAILED: ${name}`);
        process.exit(1);
    }
}

async function runVisualTests() {
    log('Starting Functional & Visual Tests (Puppeteer)...');
    const puppeteer = require('puppeteer');

    // Launch server in background
    const server = spawn('npx', ['http-server', 'out', '-p', '8080'], {
        cwd: process.cwd(),
        stdio: 'ignore' // Clean output
    });

    log('Waiting for server...');
    try {
        execSync('npx wait-on http://localhost:8080 --timeout 60000');
    } catch (e) {
        console.error('Server failed to start');
        server.kill();
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set consistent viewport
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // 1. Home Page Verification
        log('Checking Home Page...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
        const title = await page.title();
        console.log(`  Page Title: ${title}`);
        await page.screenshot({ path: path.join(RESULTS_DIR, '01_home_desktop.png') });
        log('  Saved 01_home_desktop.png');

        // 2. Mobile View Verification
        log('Checking Mobile View...');
        await page.setViewport({ width: 375, height: 667 });
        await page.screenshot({ path: path.join(RESULTS_DIR, '02_home_mobile.png') });
        log('  Saved 02_home_mobile.png');

        // 3. Functional: Open Product Modal
        log('Checking Product Modal interaction...');
        await page.setViewport({ width: 1280, height: 800 });

        // Find first product card button and click
        const selector = '.product-card button';
        await page.waitForSelector(selector);
        await page.click(selector);

        // Wait for modal
        const modalSelector = '.modal-content';
        await page.waitForSelector(modalSelector, { visible: true });

        // Wait a bit for animation
        await new Promise(r => setTimeout(r, 500));

        await page.screenshot({ path: path.join(RESULTS_DIR, '03_product_modal.png') });
        log('  Saved 03_product_modal.png');

    } catch (err) {
        console.error('Visual Test Successful:', err);
        throw err;
    } finally {
        await browser.close();
        server.kill();
    }
    log('Passed: Functional & Visual Tests');
}

async function main() {
    // 1. Lint
    await runStep('Lint', 'npm run lint');

    // 2. Build & Export
    await runStep('Build & Export', 'npm run export');

    // 3. Visual & Functional Tests
    try {
        await runVisualTests();
    } catch (e) {
        process.exit(1);
    }


    // 3.5 Check Image Integrity
    log('Checking Image Integrity...');
    const products = require('../data/products.json');
    let imgErrors = 0;
    products.forEach(p => {
        if (!Array.isArray(p.images)) {
            console.error(`  ${p.id}: Images is not an array`);
            imgErrors++;
            return;
        }
        p.images.forEach(img => {
            const pth = path.join(process.cwd(), 'public', img);
            if (!fs.existsSync(pth)) {
                console.error(`  ${p.id}: Missing image ${img}`);
                imgErrors++;
            }
        });
    });
    if (imgErrors > 0) {
        console.error(`  Failed: ${imgErrors} missing/invalid images.`);
        process.exit(1);
    } else {
        log('Passed: All images exist on disk.');
    }

    // 4. Lighthouse Performance
    await runStep('Lighthouse CI', 'npx @lhci/cli autorun --config=.lighthouseci.yml');

    log('ALL VERIFICATION CHECKS PASSED ✅');
}

main();
