const http = require('http');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + urlPath, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

async function runJourneyAudit() {
  console.log('=== FITYN END-TO-END SHOPPING JOURNEY AUDIT ===\n');

  const tests = [
    {
      name: '1. Homepage Rail & Brand Hero',
      path: '/',
      expectations: [
        'FITYN',
        'Wear the Calm',
        'NEW DROPS',
        'persistent-canvas-root',
      ],
    },
    {
      name: '2. Product Detail Page & 3D Stage',
      path: '/product/heavyweight-boxy-tee',
      expectations: [
        'Heavyweight Boxy Tee',
        'FRONT VIEW',
        'BACK VIEW',
        'ADD TO CART',
        'BUY NOW',
      ],
    },
    {
      name: '3. Collections Archive & Capsule',
      path: '/collections/monochrome-essentials',
      expectations: [
        'MONOCHROME ESSENTIALS',
        'VIEW GARMENT',
      ],
    },
    {
      name: '4. Cart Management',
      path: '/cart',
      expectations: [
        'SHOPPING CART',
        'Return to Shopping',
      ],
    },
    {
      name: '5. Checkout Wizard & Validation',
      path: '/checkout',
      expectations: [
        'CHECKOUT',
        '1. CONTACT INFORMATION',
        '2. SHIPPING DESTINATION',
        'COMPLETE MOCK ORDER',
      ],
    },
    {
      name: '6. Order Confirmation & Receipt',
      path: '/checkout/success',
      expectations: [
        'THANK YOU',
        'Order Reference:',
        'Receipt Generated',
        'RETURN TO THE RAIL',
      ],
    },
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const res = await fetchPage(t.path);
      if (res.statusCode !== 200) {
        console.error(`[FAIL] ${t.name} -> HTTP ${res.statusCode}`);
        continue;
      }

      let allExpectedFound = true;
      for (const exp of t.expectations) {
        if (!res.body.includes(exp)) {
          console.error(`[FAIL] ${t.name} -> Missing expected token: "${exp}"`);
          allExpectedFound = false;
        }
      }

      if (allExpectedFound) {
        console.log(`[PASS] ${t.name} -> HTTP 200 OK | All key UX elements verified`);
        passed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name} ->`, err.message);
    }
  }

  console.log(`\nAudit completed: ${passed}/${tests.length} tests passed.`);
  if (passed === tests.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runJourneyAudit();

