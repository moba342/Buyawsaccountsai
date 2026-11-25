import {mkdir,writeFile} from 'node:fs/promises';
import QRCode from 'qrcode';
import {fileURLToPath} from 'node:url';
import {paymentMethods} from '../payments.js';
const directory=new URL('../public/payments/',import.meta.url);
await mkdir(directory,{recursive:true});
for(const method of paymentMethods){
 if(!method.address)continue;
 const options={errorCorrectionLevel:'M',margin:4,width:512,color:{dark:'#080F24',light:'#FFFFFF'}};
 // Encode only the configured receiving address. Network selection remains explicit in the UI.
 await writeFile(new URL(`usdt-${method.id}.svg`,directory),await QRCode.toString(method.address,{...options,type:'svg'}));
 await QRCode.toFile(fileURLToPath(new URL(`usdt-${method.id}.png`,directory)),method.address,options);
}
console.log('Generated wallet QR codes from payments.js for '+paymentMethods.filter(m=>m.address).length+' USDT networks.');
