/**
 * scripts/update-images.js
 *
 * Usage:
 *  node scripts/update-images.js
 *  node scripts/update-images.js --src=public/images --data=data/products.json --exts=webp,jpg,png
 *
 * What it does:
 * - Reads the product catalog JSON (default: data/products.json).
 * - Scans the images folder (default: public/images).
 * - For each product it looks for image files that match the product image basename.
 *   Example: if product.images contains "/images/product-001.svg", the script will search
 *   for files that start with "product-001" (like product-001.jpg, product-001-1.webp, product-001-2.jpg).
 * - If matching image files are found, it replaces product.images with the detected files (prefers sorted order).
 * - Backs up the original data file to data/products.json.bak.TIMESTAMP before overwriting.
 *
 * Notes:
 * - The script expects generated images to be placed in the images folder (e.g. public/images).
 * - It preserves existing paths if no replacements are found for a product.
 * - Filenames in the images folder may be:
 *     product-001.jpg
 *     product-001-1.jpg
 *     product-001-2.webp
 *   The script will include all matching files in ascending order (based on trailing numeric suffix).
 */

import fs from "fs/promises";
import path from "path";

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--")) {
      const [k, v] = arg.slice(2).split("=");
      args[k] = v === undefined ? true : v;
    }
  }
  return args;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const args = parseArgs();
  const imagesDir = args.src || "public/images";
  const dataFile = args.data || "data/products.json";
  const exts = (args.exts || "webp,jpg,jpeg,png").split(",").map((s) => s.trim().toLowerCase());

  // Load product data
  const dataPath = path.resolve(dataFile);
  let raw;
  try {
    raw = await fs.readFile(dataPath, "utf8");
  } catch (err) {
    console.error(`Error reading data file ${dataFile}:`, err.message);
    process.exit(1);
  }

  let products;
  try {
    products = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON in data file:", err.message);
    process.exit(1);
  }

  // Read images directory
  const imagesPath = path.resolve(imagesDir);
  let files;
  try {
    files = await fs.readdir(imagesPath);
  } catch (err) {
    console.error(`Error reading images dir ${imagesDir}:`, err.message);
    process.exit(1);
  }

  // Normalize file list (lowercase ext for matching)
  const filesMap = files.map((f) => ({ name: f, lc: f.toLowerCase() }));

  const backupPath = `${dataPath}.bak.${Date.now()}`;
  await fs.writeFile(backupPath, raw, "utf8");
  console.log(`Backup written to ${backupPath}`);

  let replacedCount = 0;
  const summary = [];

  for (const p of products) {
    // For each image entry in product, get base names to search for.
    // We'll derive product base from existing images if possible; otherwise attempt from product id or sku.
    const newImages = [];

    // Determine possible bases to look for, in priority:
    // - existing image filenames (basename without ext)
    // - product.id
    // - product.sku (if exists)
    const candidateBases = new Set();

    if (Array.isArray(p.images)) {
      for (const imgPath of p.images) {
        if (!imgPath) continue;
        const base = path.basename(imgPath).replace(path.extname(imgPath), "");
        candidateBases.add(base);
      }
    }

    if (p.id) candidateBases.add(p.id);
    if (p.sku) candidateBases.add(p.sku.toLowerCase().replace(/\s+/g, "-"));

    // For each candidate base, find all matching files in images folder
    let matches = [];
    for (const base of candidateBases) {
      const baseEsc = escapeRegExp(base);
      // Match files that start with base (optionally -number) and have allowed extensions
      const reg = new RegExp(`^${baseEsc}(?:-?\\d*)\\.(${exts.map(escapeRegExp).join("|")})$`, "i");
      const found = filesMap
        .filter((f) => reg.test(f.name))
        .map((f) => f.name);

      if (found.length) {
        // Sort by numeric suffix if present: product-001-2 before product-001-10, etc.
        found.sort((a, b) => {
          const getNum = (fn) => {
            const m = fn.match(/-(\d+)\.[^.]+$/);
            return m ? parseInt(m[1], 10) : 0;
          };
          const na = getNum(a);
          const nb = getNum(b);
          if (na !== nb) return na - nb;
          return a.localeCompare(b);
        });
        matches = matches.concat(found);
      }
    }

    // Deduplicate matches and map to /images/<name>
    matches = Array.from(new Set(matches));
    if (matches.length) {
      for (const m of matches) {
        const webPath = path.posix.join("/images", m);
        newImages.push(webPath);
      }
    }

    if (newImages.length) {
      // Replace product.images with newImages
      p.images = newImages;
      replacedCount++;
      summary.push({ id: p.id || p.sku || "(unknown)", replaced: newImages.length, sample: newImages[0] });
    } else {
      // No matches found; leave product.images unchanged
      summary.push({ id: p.id || p.sku || "(unknown)", replaced: 0 });
    }
  }

  // Write updated data back to dataFile
  try {
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2), "utf8");
    console.log(`Updated ${dataFile} — ${replacedCount} products updated.`);
  } catch (err) {
    console.error("Error writing updated data file:", err.message);
    process.exit(1);
  }

  console.log("Summary (first 20):");
  console.table(summary.slice(0, 20));

  console.log("Done. If you want to preview the exported static site:");
  console.log("  npm run export");
  console.log("  npx http-server out -p 8080");
  console.log("Then open http://localhost:8080");
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("update-images.js")) {
  main().catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });
}