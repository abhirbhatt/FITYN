const http = require('http');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + urlPath, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  const routes = [
    '/',
    '/product/heavyweight-boxy-tee',
    '/collections',
    '/collections/monochrome-essentials',
    '/cart',
    '/checkout',
    '/checkout/success',
  ];

  console.log('--- FITYN HEALTH & CSS VERIFICATION ---');
  let hasError = false;

  for (const route of routes) {
    try {
      const res = await fetchUrl(route);
      if (res.statusCode !== 200) {
        console.error(`[FAIL] Route ${route} returned HTTP ${res.statusCode} (Expected 200)`);
        hasError = true;
        continue;
      }

      // Check if CSS files are attached in HTML
      const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g;
      const cssMatches = [...res.body.matchAll(cssRegex)].map((m) => m[1]);

      if (cssMatches.length === 0) {
        console.error(`[FAIL] Route ${route} has NO attached CSS stylesheet in HTML!`);
        hasError = true;
      } else {
        // Verify the CSS file returns HTTP 200 and has valid CSS
        const cssPath = cssMatches[0];
        const cssRes = await fetchUrl(cssPath);
        if (cssRes.statusCode !== 200 || cssRes.body.length < 100) {
          console.error(`[FAIL] CSS file ${cssPath} returned HTTP ${cssRes.statusCode} (size: ${cssRes.body.length} bytes)`);
          hasError = true;
        } else {
          console.log(`[PASS] ${route} -> HTTP 200 OK | CSS attached: ${cssPath} (${cssRes.body.length} bytes)`);
        }
      }
    } catch (err) {
      console.error(`[ERROR] Failed to fetch ${route}:`, err.message);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('\nVerification FAILED: Errors found.');
    process.exit(1);
  } else {
    console.log('\nAll routes returned HTTP 200 OK and valid attached CSS stylesheets.');
    process.exit(0);
  }
}

verifyAll();

