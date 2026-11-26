// Current merchant inventory audit; no document-review prerequisites.
import fs from 'node:fs/promises';
import { products, brands } from '../catalog.js';
import { productRoute, providerRoute } from '../catalogPaths.js';
import { productPurchaseState } from '../purchase-state.js';
import { categoryPublication } from '../offer-publication.js';
import { getPageSeo, confirmedOffer } from '../seo.js';
const variants=products.map(product=>{
 const id=productRoute(product),state=productPurchaseState(product);
 return {id,name:product.provider+' '+product.name,url:getPageSeo(id).canonical,availability:state.review.availability,stockSource:state.review.source,price:product.price,currency:'USD',published:state.published,purchasable:state.purchasable,restrictions:state.reasons,offer:confirmedOffer(product)};
});
const categories=brands.map(brand=>{
 const list=products.filter(p=>p.provider===brand.name),state=categoryPublication(brand,list);
 return {id:providerRoute(brand),name:brand.full,variations:list.length,published:state.published,url:getPageSeo(providerRoute(brand)).canonical};
});
const report={date:'2026-11-27',stockConfirmation:'Website owner confirmed all current catalog inventory. This is not an independent verification or provider endorsement.',summary:{categories:categories.length,variations:variants.length,purchasable:variants.filter(p=>p.purchasable).length,inStock:variants.filter(p=>p.availability==='InStock').length},categories,variants,remainingLimitations:['No private order database, transaction-claim ledger, stock reservation or access-delivery backend is configured.','The blockchain verifier confirms a matching finalized transfer, not payer ownership, order acceptance or product delivery.','Seller must reconcile payment and arrange delivery. No automatic fulfillment is claimed.','No numeric stock quantities were provided; availability is a merchant-managed status, not real-time counted inventory.']};
await fs.mkdir('docs/audits',{recursive:true});
await fs.writeFile('docs/audits/PRODUCT-AVAILABILITY-UPDATE.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary,null,2));
