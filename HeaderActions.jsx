import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { SITE } from './site-config';
import { ShoppingCart, Send } from 'lucide-react';

export default function HeaderActions({ count }) {
  return <div className="header-actions" aria-label="Contact and shopping">
    <a className="header-action-icon" href="https://t.me/dexterw4tts" target="_blank" rel="noopener noreferrer" aria-label="Contact Dexter Watts on Telegram" title="Telegram"><Send size={18} aria-hidden="true"/></a>
    <a className="header-action-icon" href={SITE.whatsapp.url} target="_blank" rel="noopener noreferrer" aria-label={`Contact us on WhatsApp at ${SITE.whatsapp.display}`} title="WhatsApp"><WhatsAppIcon size={19}/></a>
    <a className="header-action-icon header-cart-icon" href="/cart/" aria-label={`Shopping cart, ${count} ${count === 1 ? 'product' : 'products'}`} title="Shopping cart"><ShoppingCart size={18} aria-hidden="true"/>{count > 0 && <span className="header-cart-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}</a>
  </div>;
}
