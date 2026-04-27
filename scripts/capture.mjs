import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Read the components file
const dataPath = path.join(process.cwd(), 'src/data/components.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const components = JSON.parse(rawData);

const publicDir = path.join(process.cwd(), 'public/thumbnails');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function captureThumbnails() {
  console.log('Starting puppeteer to capture thumbnails...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const component of components) {
    const destPath = path.join(publicDir, `${component.id}.webp`);
    
    // Skip if already exists to save time on reruns
    if (fs.existsSync(destPath)) {
      console.log(`[SKIP] ${component.id}.webp already exists.`);
      continue;
    }

    console.log(`[FETCH] Capturing ${component.name} (${component.previewUrl})...`);
    try {
      await page.goto(component.previewUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      // Give it an extra second for animations/fonts to load
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await page.screenshot({ 
        path: destPath, 
        type: 'webp',
        quality: 80
      });
      console.log(`[DONE] Saved ${component.id}.webp`);
    } catch (err) {
      console.error(`[ERROR] Failed to capture ${component.id}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished capturing all thumbnails!');
}

captureThumbnails();
