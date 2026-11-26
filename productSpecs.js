export function productSpecifications(product) {
  return [
    ['Package type', product.type],
    ...(product.vcpus
      ? [['Product variation limit', product.vcpus + ' vCPU']]
      : []),
    ...(product.credit
      ? [['Listed credit value', '$' + product.credit.toLocaleString('en-US')]]
      : []),
    ...(product.rpm ? [['Listed request quota', product.rpm]] : []),
    ...(product.tpm ? [['Listed token quota', product.tpm]] : []),
    ...(product.models ? [['Seller-listed models', product.models]] : []),
    ...(product.capacity
      ? [
          [
            'Listed capacity',
            product.capacity +
              (product.kind === 'Server' ? ' servers' : ' Droplets'),
          ],
        ]
      : []),
    ...(product.dailyLimit
      ? [
          [
            'Listed sending limit',
            product.dailyLimit.toLocaleString('en-US') + ' / day',
          ],
        ]
      : []),
    ...(product.regions
      ? [['Listed region count', String(product.regions)]]
      : []),
    ...(product.ips ? [['Listed IP allocation', product.ips + ' IPs']] : []),
    ...(product.port25 ? [['Listed connectivity', 'Port 25 open']] : []),
  ];
}
