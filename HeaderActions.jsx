import React from 'react';
import { ArrowRight, ShoppingCart, Send } from 'lucide-react';

export default function HeaderActions({ count }) {
  return <div className="header-actions" aria-label="Contact and shopping">
    <a className="header-action-icon" href="https://t.me/dexterw4tts" target="_blank" rel="noopener noreferrer" aria-label="Contact Dexter Watts on Telegram" title="Telegram"><Send size={18} aria-hidden="true"/></a>
    <a className="header-action-icon" href="https://wa.me/14582624274" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" title="WhatsApp"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z"/><path d="m9 8 .8 2-1 1c.8 1.5 1.7 2.4 3.3 3.1l1-1 2 .8c-.1 1.2-.8 1.8-1.8 1.6-3.1-.6-5.9-3.4-6.2-6.1C7 8.6 7.8 8 9 8Z"/></svg></a>
    <a className="header-action-icon header-cart-icon" href="/cart/" aria-label={`Shopping cart, ${count} ${count === 1 ? 'product' : 'products'}`} title="Shopping cart"><ShoppingCart size={18} aria-hidden="true"/>{count > 0 && <span className="header-cart-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}</a>
    <a className="header-pricing" href="/products/">Check Pricing<ArrowRight size={17} aria-hidden="true"/></a>
  </div>;
}
