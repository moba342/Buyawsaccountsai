import test from 'node:test';
import assert from 'node:assert/strict';
import { products, brands } from '../catalog.js';
import { productRoute } from '../catalogPaths.js';
import { validatePaymentRequest } from '../server/payment-verifier.js';
const prices = {
  AWS: [
    15, 25, 35, 110, 145, 199, 299, 499, 1299, 1250, 2500, 6500, 18000, 70, 70,
    900, 5500, 6500, 9999, 1099, 1099, 2500,
  ],
  Azure: [35, 55, 7550, 1500, 999, 1999, 5500, 14500],
  DigitalOcean: [20, 30, 5800, 9800],
  'Google Cloud': [55, 80, 199, 699, 1299, 2999, 299, 999, 1899, 5500],
  Hetzner: [30, 35],
  Kamatera: [30, 50],
  Linode: [30, 120, 480],
  'Oracle Cloud': [45, 120],
  OVHcloud: [30, 80],
  'Amazon SES': [500, 899, 1599],
  UpCloud: [30, 75],
  'IBM Cloud': [45, 120, 80],
  Heroku: [50, 85],
  Vultr: [30, 55, 55],
};
test('replacement catalog matches every seller-supplied price and provider count', () => {
  assert.equal(products.length, 68);
  assert.equal(brands.length, 14);
  assert.deepEqual(
    brands.map((b) => b.name),
    Object.keys(prices),
  );
  for (const [provider, expected] of Object.entries(prices))
    assert.deepEqual(
      products.filter((p) => p.provider === provider).map((p) => p.price),
      expected,
      provider,
    );
  assert.equal(new Set(products.map(productRoute)).size, 68);
  assert(
    !brands.some((b) => ['Alibaba Cloud', 'Atlantic.Net'].includes(b.name)),
  );
});
test('new compute, AI, SMTP and capacity labels preserve the supplied details', () => {
  assert(
    products.some(
      (p) =>
        p.provider === 'AWS' &&
        p.vcpus === 1920 &&
        p.kind === 'Compute' &&
        p.price === 1299,
    ),
  );
  assert(
    products.some(
      (p) =>
        p.provider === 'AWS' &&
        p.models === '4.6 / 4.7 / 4.8 / Opus 5 / Fable 5' &&
        p.price === 9999,
    ),
  );
  assert(
    products.some(
      (p) =>
        p.provider === 'Google Cloud' &&
        p.models === 'VT Gemini AI · F5.2 and F5.2',
    ),
  );
  assert(
    products.some(
      (p) =>
        p.provider === 'Amazon SES' &&
        p.dailyLimit === 50000 &&
        p.regions === 3 &&
        p.price === 899,
    ),
  );
  assert(
    products.some(
      (p) =>
        p.provider === 'DigitalOcean' &&
        p.capacity === 500 &&
        p.port25 &&
        p.price === 9800,
    ),
  );
  assert(
    products
      .filter((p) => p.kind === 'AI')
      .every((p) => p.features[0].startsWith('Seller-listed:')),
  );
});
test('payment verification derives updated amounts and rejects retired SKUs', () => {
  const items = ['8 vCPU', '32 vCPU'].map((name) => ({
    id: productRoute(
      products.find((p) => p.provider === 'AWS' && p.name === name),
    ),
    quantity: 1,
  }));
  const r = validatePaymentRequest({
    network: 'trc20',
    txid: 'f'.repeat(64),
    items,
    total: 1,
  });
  assert.equal(r.expectedAmount, '60');
  assert.throws(() =>
    validatePaymentRequest({
      network: 'trc20',
      txid: 'f'.repeat(64),
      items: [{ id: 'product/aws-1k-credit', quantity: 1 }],
    }),
  );
});
