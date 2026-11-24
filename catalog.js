export const catalogSource='https://buyawscredit.vercel.app/';
const definitions=[
['AWS','Amazon Web Services','aws','#ff9c36',[
['Free Trial',15,'Trial'],['8 vCPU',35,'Compute'],['32 vCPU',80,'Compute'],['64 vCPU',120,'Compute'],['128 vCPU',150,'Compute'],['256 vCPU',190,'Compute'],['512 vCPU',299,'Compute'],['$1K Credit',250,'Credit',1000],['$5K Credit',999,'Credit',5000],['$10K Credit',2499,'Credit',10000],['$25K Credit',4999,'Credit',25000],['$100K Credit',13000,'Credit',100000]]],
['Google Cloud','Google Cloud','G','#84adff',[
['$300 Credit',45,'Credit',300],['$400 Credit',55,'Credit',400],['$1K Credit',199,'Credit',1000],['$5K Credit',499,'Credit',5000],['$10K Credit',999,'Credit',10000],['$25K Credit',1499,'Credit',25000]]],
['Azure','Microsoft Azure','▦','#60bdff',[
['Free Trial',30,'Trial'],['Pay As You Go',40,'Account'],['$1K Credit',199,'Credit',1000],['$5K Credit',699,'Credit',5000],['$25K Credit',1999,'Credit',25000]]],
['DigitalOcean','DigitalOcean','◕','#5799ff',[
['Free Trial',20,'Trial'],['Close Port 3',29,'Droplet'],['Close Port 10',39,'Droplet'],['Close Port 25',50,'Droplet'],['Open Port 3',99,'Droplet'],['Open Port 10',199,'Droplet'],['Open Port 25',299,'Droplet']]],
['Oracle Cloud','Oracle Cloud','O','#ef746d',[
['$300 Credit',45,'Credit',300],['New Account',40,'Account'],['Old Account',90,'Account'],['Upgraded Account',130,'Account'],['Pay As You Go',110,'Account']]],
['Hetzner','Hetzner Cloud','H','#ee7188',[
['5 Servers',45,'Server'],['10 Servers',90,'Server'],['25 Servers',190,'Server'],['100 Servers',999,'Server'],['Old Account',180,'Account']]],
['Vultr','Vultr','V','#71abff',[
['$200 Credit',30,'Credit',200],['$250 Credit',60,'Credit',250],['$300 Credit',99,'Credit',300]]],
['Linode','Linode (Akamai)','L','#6fcb9b',[
['$100 Credit',25,'Credit',100],['Port 25 Open',130,'SMTP']]],
['IBM Cloud','IBM Cloud','IBM','#97b5ec',[
['Free Trial',30,'Trial'],['Port 25 Open',80,'SMTP']]],
['Kamatera','Kamatera','K','#ab92ef',[
['Free Trial',25,'Trial'],['Port 25 Open',45,'SMTP']]],
['Alibaba Cloud','Alibaba Cloud','A','#ffa157',[
['Personal Account',50,'Account'],['Business Account',90,'Account']]],
['Atlantic.Net','Atlantic.Net','AT','#66c5ce',[
['Free Trial',50,'Trial'],['Port 25 Open',199,'SMTP']]]
];
export const products=definitions.flatMap(([provider,full,logo,color,rows])=>rows.map(([name,price,kind,credit],i)=>({provider,name,price,kind,credit:credit||0,label:name==='32 vCPU'?'Popular':i===0?'Starter':kind==='Credit'?'Credit package':'Account',type:kind==='Credit'?'Cloud credit account':kind==='Compute'?'Compute account':kind==='Droplet'?'Droplet capacity account':kind==='Server'?'Server capacity account':kind==='SMTP'?'SMTP-enabled account':kind==='Trial'?'Free trial account':'Cloud account',delivery:provider==='AWS'?'2–8 hours':'30 min–12 hours',features:kind==='Credit'?[`$${credit.toLocaleString('en-US')} reference credit value`,'Provider eligibility to be confirmed','Expiry and redemption terms on request']:kind==='Compute'?[`${name} reference account tier`,'Region and quota details on request','Delivery terms confirmed before payment']:kind==='Droplet'?[`${name.match(/\d+/)?.[0]} droplet reference capacity`,name.startsWith('Open')?'Open-port variant':'Standard-port variant','Availability confirmed before payment']:kind==='Server'?[`${name} reference capacity`,'Region and quota details on request','Availability confirmed before payment']:['Reference account variant: '+name,'Provider eligibility to be confirmed','Final terms confirmed before payment']})));
const providerSummaries={
'AWS':'Free trial and 8–512 vCPU accounts, with credit packages from $1K to $100K.',
'Google Cloud':'Cloud credit accounts from $300 to $25K, with six variants to compare.',
'Azure':'Free trial, pay-as-you-go, and cloud credit accounts from $1K to $25K.',
'DigitalOcean':'Free trial and 3–25 Droplet variants with standard or open-port options.',
'Oracle Cloud':'New, older, upgraded, and pay-as-you-go accounts, plus a $300 credit option.',
'Hetzner':'Account variants for 5–100 servers, plus an older-account option.',
'Vultr':'Compare cloud credit accounts with $200, $250, or $300 in reference credits.',
'Linode':'Choose a $100 cloud credit account or a port 25 open account variant.',
'IBM Cloud':'Explore free trial and port 25 open account variants in one place.',
'Kamatera':'Compare free trial and port 25 open accounts for your next project.',
'Alibaba Cloud':'Personal and business account variants for your cloud requirements.',
'Atlantic.Net':'Free trial and port 25 open account variants, with clear reference pricing.'
};
export const brands=definitions.map(([name,full,logo,color])=>({name,full,logo,color,summary:providerSummaries[name],from:Math.min(...products.filter(p=>p.provider===name).map(p=>p.price)),desc:`Compare ${products.filter(p=>p.provider===name).length} account and credit variants for ${full}.`}));
export const formatPrice=n=>'$'+n.toLocaleString('en-US');
