import test from 'node:test';
import assert from 'node:assert/strict';
import { products, brands } from '../catalog.js';
import {
  getProductArticle,
  variantIntroductions,
  providerBuyingNotes,
} from '../productArticles.js';
import { productRoute, providerRoute } from '../catalogPaths.js';
import { routeIds } from '../routing.js';
test('every catalog variant has a complete, product-specific original buying article', () => {
  assert.equal(products.length, 53);
  const intros = new Set(),
    titles = new Set();
  for (const product of products) {
    const brand = brands.find((b) => b.name === product.provider),
      article = getProductArticle(product, brand);
    assert.equal(
      article.intro,
      variantIntroductions[product.provider][product.name],
    );
    assert(article.intro.length > 130);
    assert(article.title.includes(product.name));
    assert.equal(article.price, '$' + product.price.toLocaleString('en-US'));
    assert.equal(article.sections.length, 4);
    assert.equal(article.sections[1].checks.length, 3);
    const words = [
      article.intro,
      ...article.sections.flatMap((s) => s.paragraphs),
    ]
      .join(' ')
      .split(/\s+/).length;
    assert(words >= 350, `${productRoute(product)} has only ${words} words`);
    assert(routeIds.includes(productRoute(product)));
    intros.add(article.intro);
    titles.add(article.title);
  }
  assert.equal(intros.size, 53);
  assert.equal(titles.size, 53);
});
test('every provider has buying guidance and unchanged provider routes', () => {
  for (const brand of brands) {
    assert(providerBuyingNotes[brand.name]?.length > 100);
    assert(routeIds.includes(providerRoute(brand)));
  }
});
