import React from "react";
// Crisp, scalable WhatsApp mark; inherits the website's navy color.
export default function WhatsAppIcon({ size = 20, ...props }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.8a8.5 8.5 0 1 1 16.1-4.1Z" />
    <path d="M8.1 7.6c.3-.4.7-.3.9.1l.8 1.7c.1.3 0 .5-.2.8l-.6.6c.7 1.3 1.7 2.3 3.1 3l.6-.7c.2-.3.5-.3.8-.2l1.7.8c.4.2.5.5.3.9-.3.8-1 1.3-1.9 1.2-3-.3-6.7-3.8-7-6.8-.1-.6.3-1.1.7-1.4Z" />
  </svg>;
}
