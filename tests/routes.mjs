import assert from 'node:assert/strict';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3001';
const paths = ['/', '/product', '/faq', '/contact', '/shipping-returns', '/privacy', '/terms', '/disclaimer', '/missing-page', '/robots.txt', '/sitemap.xml', '/icon', '/apple-icon', '/og.png'];
for (const path of paths) {
 const response = await fetch(origin + path);
 const type = response.headers.get('content-type');
 const body = type?.includes('text') || type?.includes('xml') ? await response.text() : '';
 const title = body.match(/<title>(.*?)<\/title>/)?.[1];
 const h1s = [...body.matchAll(/<h1(?:\s[^>]*)?>/g)].length;
 assert.equal(response.status, path === '/missing-page' ? 404 : 200, path);
 assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
 assert.equal(response.headers.get('x-frame-options'), 'DENY');
 assert.ok(response.headers.get('content-security-policy'));
 if (type?.includes('text/html') && path !== '/missing-page') { assert.equal(h1s, 1, path); assert.ok(title, path); }
 if (path === '/missing-page') assert.ok(body.includes('back to wellness'), 'Custom 404 content missing');
 if (path === '/product') assert.ok(!body.includes('NAFDAC'), 'Unconfigured compliance field published');
 console.log(JSON.stringify({ path, status: response.status, title, type }));
}
