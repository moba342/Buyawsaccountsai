// Browser validation never transfers funds, submits a real TXID, or fabricates an order.
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { products, brands } from '../../catalog.js';
import { productPath, providerPath, productRoute } from '../../catalogPaths.js';
import { paymentMethods } from '../../payments.js';
const require = createRequire(process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url);
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.QA_URL || 'http://localhost:4173';
const out = process.env.QA_EVIDENCE_DIR || 'docs/audits/evidence/inventory';
await fs.mkdir(out, {recursive:true});
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const context = await browser.newContext({reducedMotion:'reduce'});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const report = {date:'2026-11-27', base, categories:0, variants:0, checkoutProducts:0, stockOffers:0, responsiveViews:0, accessibilityScans:0, violations:[], errors, realPaymentsSubmitted:0, automaticDeliveryConfigured:false};
try {
 for (const product of products) {
  await page.goto(base + productPath(product));
  const panel = page.locator('.account-purchase-panel');
  await panel.waitFor();
  assert((await panel.innerText()).includes('In Stock'), productRoute(product));
  const buttons = panel.locator('button.primary,button.secondary');
  assert.equal(await buttons.count(),2);
  for (const button of await buttons.all()) assert(await button.isEnabled(),productRoute(product));
  const main = await page.locator('main').innerText();
  assert(!/Pending verification|Pending review|Reference price|not available to order/i.test(main),productRoute(product));
  const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(n => JSON.parse(n.textContent)['@graph'] || []));
  const item = schema.find(n => n['@type'] === 'Product');
  assert.equal(item.offers.price,product.price);
  assert.equal(item.offers.availability,'https://schema.org/InStock');
  report.stockOffers++;
  await buttons.first().click();
  const dialog=page.getByRole('dialog');
  await dialog.waitFor();
  assert(await dialog.getByRole('button',{name:'Checkout',exact:true}).isEnabled());
  await dialog.getByRole('button',{name:'Close dialog',exact:true}).click();
  // Exercise actual Add to Cart, preserving the source catalog ID and price.
  await buttons.last().click();
  await page.waitForFunction(id => JSON.parse(localStorage.getItem('baa-cart-v2') || '[]').some(row => row.id === id), productRoute(product));
  report.variants++;
 }
 await page.goto(base+'/cart/');
 await page.locator('.commerce-total').waitFor();
 assert.equal(await page.locator('.commerce-item').count(),products.length);
 assert(await page.locator('main a[href="/checkout/"]').isVisible());
 await page.goto(base+'/checkout/');
 await page.locator('#payment-txid').waitFor();
 assert.equal(await page.locator('.commerce-checkout-lines li').count(),68);
 report.checkoutProducts=68;
 for(const method of paymentMethods){
  const input=page.locator(`input[type="radio"][value="${method.id}"]`);
  if(await input.count()) await input.check();
  else await page.getByText(method.label,{exact:true}).first().click();
  assert(await page.locator(`input[value="${method.address}"]`).count());
  assert(await page.locator(`img[src="/payments/usdt-${method.id}.svg"]`).count());
 }
 // Real API, invalid input only: never trigger RPC or claim a successful transfer.
 const api=await page.request.post(base+'/api/verify-payment',{data:{network:'trc20',txid:'invalid',items:[{id:productRoute(products[0]),quantity:1}]}});
 assert.equal(api.status(),400);
 assert.equal((await api.json()).status,'invalid');
 for(const brand of brands){
  await page.goto(base+providerPath(brand));
  await page.locator('main:not(.route-loading)').waitFor();
  assert(!/Pending publication review/.test(await page.locator('main').innerText()));
  report.categories++;
 }
 for(const width of [320,375,768,1024,1440,1920]){
  await page.setViewportSize({width,height:960});
  for(const path of [productPath(products[0]),'/cart/','/checkout/']){
   await page.goto(base+path);
   await page.locator('main:not(.route-loading)').waitFor();
   await page.waitForTimeout(100);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path+' '+width);
   report.responsiveViews++;
   if(path==='/checkout/' && [375,1440].includes(width)) await page.screenshot({path:out+'/checkout-'+width+'.png',fullPage:true});
   if([375,1440].includes(width)){
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    report.accessibilityScans++;
    report.violations.push(...result.violations.map(v=>({path,width,id:v.id,targets:v.nodes.map(n=>n.target)})));
   }
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(report.violations,[]);
 report.status='PASS';
} finally {
 await fs.writeFile(out+'/purchasing.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
console.log(JSON.stringify(report,null,2));
