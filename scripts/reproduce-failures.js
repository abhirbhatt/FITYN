const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('--- STARTING PLAYWRIGHT REAL-BROWSER AUDIT ---\n');

  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const warnings = [];
  const observations = [];

  // 1. Desktop Audit (1280x800)
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await desktopContext.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  // STEP 1: Homepage Investigation
  console.log('[AUDIT 1] Navigating to Homepage (Desktop)...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_home.png') });

  // Check 3D Canvas element
  const canvasExists = await page.locator('#fityn-persistent-canvas canvas').count();
  const canvasRoot = await page.locator('#persistent-canvas-root').first();
  const canvasRootZ = await canvasRoot.evaluate((el) => window.getComputedStyle(el).zIndex);
  const canvasRootPointer = await canvasRoot.evaluate((el) => window.getComputedStyle(el).pointerEvents);
  observations.push(`Canvas root zIndex: ${canvasRootZ}, pointerEvents: ${canvasRootPointer}`);

  // Check GarmentControls
  const arrows = await page.locator('button[aria-label="Next garment"]').count();
  const activeProductTitle = await page.locator('h2').first().textContent().catch(() => null);
  observations.push(`Initial active product title: "${activeProductTitle}"`);

  // Interact with Next Garment arrow
  if (arrows > 0) {
    const nextBtn = page.locator('button[aria-label="Next garment"]');
    await nextBtn.click();
    await page.waitForTimeout(500);
    const newTitle = await page.locator('h2').first().textContent().catch(() => null);
    observations.push(`After clicking next arrow, active product title: "${newTitle}"`);
    if (newTitle === activeProductTitle) {
      failures.push('Homepage Next Garment arrow did not change active product title');
    }
  } else {
    failures.push('Homepage garment navigation arrows not found in DOM');
  }

  // Check "SEE AVAILABILITY" button link
  const seeAvailLink = page.locator('a:has-text("SEE AVAILABILITY")').first();
  const seeAvailCount = await seeAvailLink.count();
  let targetHref = '';
  if (seeAvailCount > 0) {
    targetHref = await seeAvailLink.getAttribute('href');
    observations.push(`"SEE AVAILABILITY" href: ${targetHref}`);
  } else {
    failures.push('"SEE AVAILABILITY" CTA button not found on Homepage');
  }

  // STEP 2: Navigate to Product Page
  console.log('[AUDIT 2] Navigating to Product Page (Heavyweight Boxy Tee)...');
  await page.goto(`${BASE_URL}/product/heavyweight-boxy-tee`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_desktop_product.png') });

  // Check product page structure & garment visibility
  const prodTitle = await page.locator('h1').textContent().catch(() => null);
  observations.push(`Product page H1: "${prodTitle}"`);

  // Check FRONT / BACK buttons
  const frontBtn = page.locator('button:has-text("FRONT VIEW")');
  const backBtn = page.locator('button:has-text("BACK VIEW")');
  const hasFlipButtons = (await frontBtn.count()) > 0 && (await backBtn.count()) > 0;
  if (!hasFlipButtons) {
    failures.push('Product page missing FRONT VIEW or BACK VIEW buttons');
  } else {
    await backBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02b_desktop_product_back.png') });
  }

  // Check Colourway buttons
  const colorButtons = await page.locator('button[aria-label*="Select colour"]').count();
  observations.push(`Found ${colorButtons} colourway buttons`);
  if (colorButtons > 1) {
    await page.locator('button[aria-label*="Select colour"]').nth(1).click();
    await page.waitForTimeout(300);
  }

  // Check Size Selection
  const sizeM = page.locator('button:has-text("M")').first();
  const sizeL = page.locator('button:has-text("L")').first();
  if ((await sizeL.count()) > 0) {
    await sizeL.click();
    await page.waitForTimeout(200);
  }

  // Check Quantity increment
  const plusBtn = page.locator('button[aria-label="Increase quantity"]');
  if ((await plusBtn.count()) > 0) {
    await plusBtn.click();
    await page.waitForTimeout(200);
  }

  // STEP 3: Add to Cart & Cart Drawer
  console.log('[AUDIT 3] Testing Add to Cart & Drawer...');
  const addToCartBtn = page.locator('button:has-text("ADD TO CART")');
  if ((await addToCartBtn.count()) > 0) {
    await addToCartBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_cart_drawer.png') });

    const drawerVisible = await page.locator('aside[aria-label*="Cart" i], div[role="dialog"]').isVisible().catch(() => false);
    observations.push(`Cart drawer visible after ADD TO CART: ${drawerVisible}`);
    if (!drawerVisible) {
      failures.push('Cart drawer did not appear after clicking ADD TO CART');
    }
  } else {
    failures.push('ADD TO CART button not found on product page');
  }

  // STEP 4: Navigate to /cart page
  console.log('[AUDIT 4] Navigating to Cart Page...');
  await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_cart_page.png') });

  const cartItemsCount = await page.locator('h3, h4').count();
  const cartItemRemoval = page.locator('button:has-text("Remove")');
  observations.push(`Cart page loaded. Remove buttons count: ${await cartItemRemoval.count()}`);

  // Check Checkout CTA
  const proceedBtn = page.locator('a:has-text("PROCEED TO CHECKOUT")').first();
  if ((await proceedBtn.count()) === 0) {
    failures.push('PROCEED TO CHECKOUT button not found on cart page');
  }

  // STEP 5: Checkout Wizard
  console.log('[AUDIT 5] Navigating to Checkout Page...');
  await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_checkout.png') });

  // Test submitting empty form (validation check)
  const submitOrderBtn = page.locator('button:has-text("COMPLETE MOCK ORDER")');
  if ((await submitOrderBtn.count()) > 0) {
    await submitOrderBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05b_checkout_validation_errors.png') });

    const errorCount = await page.locator('p.text-red-600').count();
    observations.push(`Validation error messages shown on empty submit: ${errorCount}`);
    if (errorCount === 0) {
      failures.push('Checkout form did not show validation errors on invalid empty submit');
    }

    // Fill valid information
    await page.fill('input[placeholder*="Sharma"]', 'Aarav Mehta');
    await page.fill('input[placeholder*="example.com"]', 'aarav.mehta@example.com');
    await page.fill('input[placeholder="9876543210"]', '9876543210');
    await page.fill('input[placeholder*="Plot 42"]', '702 Lotus Boulevard, Indiranagar');
    await page.fill('input[placeholder="Bengaluru"]', 'Bengaluru');
    await page.fill('input[placeholder="Karnataka"]', 'Karnataka');
    await page.fill('input[placeholder="560038"]', '560038');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05c_checkout_filled.png') });

    // Submit valid order
    await submitOrderBtn.click();
    await page.waitForURL('**/checkout/success', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_order_success.png') });

    const successH1 = await page.locator('h1').textContent().catch(() => null);
    observations.push(`Success page H1: "${successH1}"`);
    const orderRefText = await page.locator('text=Order Reference:').textContent().catch(() => null);
    observations.push(`Success page Order Ref text: "${orderRefText}"`);

    if (!successH1 || !successH1.includes('THANK YOU')) {
      failures.push('Checkout submit did not navigate to Order Confirmation page');
    }
  } else {
    failures.push('COMPLETE MOCK ORDER button not found on checkout page');
  }

  // STEP 6: Direct visit to /checkout/success without active order
  console.log('[AUDIT 6] Testing direct visit to /checkout/success...');
  const directContext = await browser.newContext();
  const directPage = await directContext.newPage();
  await directPage.goto(`${BASE_URL}/checkout/success`, { waitUntil: 'networkidle' });
  const directOrderRef = await directPage.locator('text=Order Reference:').textContent().catch(() => null);
  observations.push(`Direct visit to success route without order showed: "${directOrderRef}"`);
  await directContext.close();

  // STEP 7: Mobile Viewport Audit (390x844 - iPhone 12/13/14)
  console.log('[AUDIT 7] Mobile Viewport Audit (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '07_mobile_home.png') });

  await mobilePage.goto(`${BASE_URL}/product/heavyweight-boxy-tee`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '08_mobile_product.png') });

  await mobilePage.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '09_mobile_cart.png') });

  await mobilePage.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_checkout.png') });

  await mobileContext.close();
  await desktopContext.close();
  await browser.close();

  console.log('\n=== PLAYWRIGHT AUDIT REPORT ===');
  console.log('Observations:');
  observations.forEach((o) => console.log('  • ' + o));

  if (consoleErrors.length > 0) {
    console.log('\nConsole Errors Caught:');
    consoleErrors.forEach((e) => console.log('  [ERROR] ' + e));
  } else {
    console.log('\nConsole Errors: 0');
  }

  if (failures.length > 0) {
    console.log('\nRecorded Failures:');
    failures.forEach((f) => console.log('  ❌ ' + f));
    process.exit(1);
  } else {
    console.log('\nRecorded Failures: 0 (All real browser interactions succeeded!)');
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
