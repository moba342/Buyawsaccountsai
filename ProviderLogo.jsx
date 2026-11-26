import React from 'react';
import { providerAssets as assets } from './providerAssets';
export default function ProviderLogo({
  name,
  className = '',
  decorative = false,
  priority = false,
}) {
  return (
    <img
      className={
        'platform-logo platform-logo-sapphire ' +
        (name === 'AWS' || name === 'Amazon SES' || name === 'Oracle Cloud'
          ? 'wide-logo '
          : '') +
        className
      }
      src={'/logos/' + assets[name]}
      alt={decorative ? '' : name + ' logo'}
      width="40"
      height="40"
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
