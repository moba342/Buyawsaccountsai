import{brands,products}from'./catalog';
const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const routeIds=['products','providers','compare','guides','faq','contact','verified',...brands.map(b=>slug(b.name)+'-accounts'),...products.map(p=>'product/'+slug(p.provider+' '+p.name))];
export const validRoute=id=>routeIds.includes(id);
export const routePath=id=>'/'+id.replace(/^\/+|\/+$/g,'')+'/';
export const pathRoute=pathname=>{const id=pathname.replace(/^\/+|\/+$/g,'');return validRoute(id)?id:pathname==='/'?'products':null};
export function migrateLegacyRoute(){const id=window.location.hash.slice(1);if(validRoute(id))window.history.replaceState(null,'',routePath(id)+window.location.search)}
export function currentRoute(){return pathRoute(window.location.pathname)||'products'}
