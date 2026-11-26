import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HOME_SEO, SITE_URL, getPageSeo, siteSchema } from '../seo.js';
import { routeIds, routePath } from '../routing.js';

test('homepage uses the exact supplied title, description and unique keyword themes',()=>{
  const home=getPageSeo('products','/');
  assert.equal(home.title,'Buy AWS Accounts & Cloud Credits | BuyAWSAccountsAI');
  assert.equal(home.description,'Buy AWS accounts and explore cloud credits, Bedrock API access, and cloud account options. Compare available plans and pricing for your cloud requirements.');
  assert.equal(home.canonical,SITE_URL+'/');
  assert.equal(home.keywords,HOME_SEO.keywords);
  assert.equal(new Set(home.keywords.split(', ')).size,home.keywords.split(', ').length);
  for(const keyword of ['buy AWS accounts','buy AWS Bedrock API key','AWS Bedrock API pricing'])assert(home.keywords.includes(keyword));
  const marketplace=getPageSeo('products','/marketplace/');
  assert.notEqual(marketplace.title,home.title);
  assert.equal(marketplace.canonical,SITE_URL+'/marketplace/');
  assert.equal(marketplace.keywords,'');
});
test('all routes have unique canonical URLs, descriptions and correct indexing directives',()=>{
  const values=routeIds.map(id=>getPageSeo(id));
  assert.equal(new Set(values.map(v=>v.canonical)).size,routeIds.length);
  for(const id of routeIds){const seo=getPageSeo(id);assert(seo.title&&seo.description);assert.equal(seo.canonical,SITE_URL+routePath(id));assert.equal(seo.robots,['cart','checkout'].includes(id)?'noindex, nofollow':'index, follow')}
});
test('site structured data describes the site without unsupported ratings or verification claims',()=>{
  const schema=siteSchema(getPageSeo('products','/'));
  assert.equal(schema['@context'],'https://schema.org');
  assert.deepEqual(schema['@graph'].map(n=>n['@type']),['Organization','WebSite','WebPage']);
  assert.equal(schema['@graph'][2].url,SITE_URL+'/');
  assert(!JSON.stringify(schema).includes('aggregateRating'));
});
test('static rewrite destinations align with SEO HTML generation',()=>{
  const config=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url)));
  for(const rewrite of config.rewrites)assert.equal(rewrite.destination,rewrite.source+'index.html');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url)));
  assert.equal(pkg.scripts.postbuild,'node scripts/generate-seo.mjs');
});
