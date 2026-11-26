// Isolated synthetic reviews in an in-memory Vite SSR graph; no production data or files changed.
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const vite=await createServer({server:{middlewareMode:true},appType:"custom"});
try {
  const {products,brands}=await vite.ssrLoadModule('/catalog.js');
  const {publicationReviews}=await vite.ssrLoadModule('/offer-review-records.js');
  const {approvedReview}=await vite.ssrLoadModule('/tests/fixtures/publication.js');
  const {productRoute,providerRoute}=await vite.ssrLoadModule('/catalogPaths.js');
  const {default:Card}=await vite.ssrLoadModule('/CatalogAccountCard.jsx');
  const {default:Summary}=await vite.ssrLoadModule('/PurchaseSummary.jsx');
  const {default:Provider}=await vite.ssrLoadModule('/ProviderCard.jsx');
  const {CartPage,CheckoutPage}=await vite.ssrLoadModule('/CommercePages.jsx');
  const {default:BuyingArticle}=await vite.ssrLoadModule('/ProductBuyingArticle.jsx');
  const product=products[1],brand=brands.find(b=>b.name===product.provider),id=productRoute(product),cases=[];
  assert.equal(Object.keys(publicationReviews).length,0);
  for(const availability of [null,'InStock','LimitedAvailability','OutOfStock','PreOrder','BackOrder']){
    if(availability)publicationReviews[id]=approvedReview(product,{availability});else delete publicationReviews[id];
    const html=renderToStaticMarkup(React.createElement(Card,{product,brand,onOrder(){}}));
    const disabled=/class="primary" disabled=""/.test(html);
    assert.equal(disabled,!["InStock","LimitedAvailability"].includes(availability));
    if(availability){assert(!html.includes('Reference price'));assert(!html.includes('Pending review'));assert(!html.includes('Pending verification'));}
    else{assert(html.includes('Reference price'));assert(html.includes('Pending verification'));}
    const article=renderToStaticMarkup(React.createElement(BuyingArticle,{product,brand,onOrder(){}}));
    if(availability)assert(!article.slice(article.indexOf('class="product-article-actions"')).includes('Publication review pending'));
    cases.push({availability:availability||'NO REVIEW',buttonDisabled:disabled,priceLabel:availability?'Price':'Reference price'});
  }
  delete publicationReviews[id];
  // A later eligible option must not be hidden behind the first pending package.
  publicationReviews[id]=approvedReview(product);
  let html=renderToStaticMarkup(React.createElement(Summary,{brand,packages:[products[0],product],onOrder(){}}));
  assert(!/class="primary" disabled=""/.test(html));assert(html.includes('Buy Now'));assert(html.includes('$25'));
  publicationReviews[providerRoute(brand)]={status:'approved',reviewedBy:'TEST ONLY reviewer',reviewedAt:'2026-01-01',editorialReview:{approved:true,actualOfferApproved:true}};
  html=renderToStaticMarkup(React.createElement(Provider,{brand,count:22,navigate(){}}));
  assert(!html.includes('Reference prices from'));assert(!html.includes('Pending publication review'));assert(html.includes('$25')); // pending $15 trial must not undercut the confirmed option
  const cart={lines:[{id,product,quantity:1}],count:1,total:product.price,storageError:false,quantity(){},remove(){},clear(){}};
  html=renderToStaticMarkup(React.createElement(CartPage,{cart}));
  assert(!html.includes('Reference total'));assert(html.includes('Subtotal'));
  html=renderToStaticMarkup(React.createElement(CheckoutPage,{cart}));
  assert(html.includes('commerce-checkout'));assert(!html.includes('checkout-publication-hold'));assert(!html.includes('Reference total'));
  publicationReviews[id]=approvedReview(product,{availability:'OutOfStock'});
  html=renderToStaticMarkup(React.createElement(CheckoutPage,{cart}));
  assert(html.includes('Selected products are currently unavailable'));assert(html.includes('checkout-publication-hold'));assert(!html.includes('commerce-checkout'));
  delete publicationReviews[id];delete publicationReviews[providerRoute(brand)];
  assert.equal(Object.keys(publicationReviews).length,0);
  const result={syntheticOnly:true,productionReviewRecordsWritten:0,cardCases:cases,laterEligiblePackageSelection:true,providerApprovedPriceExcludesPendingTrial:true,approvedCartAndCheckoutEnabled:true,outOfStockCheckoutHeldWithCorrectReason:true};
  await fs.mkdir('docs/audits/evidence/product-status',{recursive:true});await fs.writeFile('docs/audits/evidence/product-status/rendered-fixtures.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await vite.close();}
