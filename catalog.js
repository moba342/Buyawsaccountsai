import { catalogDefinitions } from './catalog-data.js';
import { providerEditorial } from './editorialContent.js';
const money = (n) => '$' + n.toLocaleString('en-US');
function features(row) {
  if (row.kind === 'AI')
    return [
      'Seller-listed: ' +
        [
          row.vcpus ? `${row.vcpus} vCPU` : null,
          row.credit ? `${money(row.credit)} credits` : null,
          row.rpm,
          row.tpm,
          row.models,
        ]
          .filter(Boolean)
          .join(' · '),
      'Confirm exact AI service, models, region, and quotas',
      'Agree credit eligibility, delivery, and billing terms',
    ];
  if (row.dailyLimit)
    return [
      `Seller-listed ${row.dailyLimit.toLocaleString('en-US')} daily sending limit`,
      row.regions
        ? `Seller-listed ${row.regions} regions`
        : 'Confirm sending scope and regional quota',
      'Confirm permitted use, billing, and delivery',
    ];
  if (row.kind === 'Credit')
    return [
      `${money(row.credit)} seller-listed credit value`,
      'Confirm eligibility, redemption, and expiry',
      'Review billing and delivery terms',
    ];
  if (row.kind === 'Compute')
    return [
      `${row.vcpus} seller-listed vCPU tier`,
      'Confirm quota, region, and resource availability',
      'Agree billing and delivery terms',
    ];
  if (row.kind === 'Droplet')
    return [
      `${row.capacity} seller-listed Droplet capacity`,
      row.port25 ? 'Seller-listed port 25 open' : 'Confirm networking scope',
      'Confirm resource availability and recurring charges',
    ];
  if (row.kind === 'Server')
    return [
      `${row.capacity} seller-listed server limit`,
      'Confirm the meaning and scope of the listed port limit',
      'Review region, billing, and resource availability',
    ];
  if (row.kind === 'SMTP')
    return [
      row.ips
        ? `Seller-listed port 25 open · ${row.ips} IPs`
        : 'Seller-listed port 25 open',
      'Confirm permissions and acceptable-use requirements',
      'Review hosting charges and delivery terms',
    ];
  return [
    'Seller-listed: ' + row.name,
    'Confirm eligibility, account setup, and billing',
    'Review account details and purchase terms',
  ];
}
export const products = catalogDefinitions.flatMap((def) =>
  def.rows.map((row, index) => ({
    ...row,
    provider: def.name,
    credit: row.credit || 0,
    label:
      row.name === '32 vCPU'
        ? 'Popular'
        : row.kind === 'AI'
          ? 'AI package'
          : index === 0
            ? 'Starter'
            : row.kind === 'Credit'
              ? 'Credit package'
              : 'Account',
    type:
      row.kind === 'AI'
        ? 'AI-enabled cloud account'
        : row.kind === 'Credit'
          ? 'Cloud credit account'
          : row.kind === 'Compute'
            ? 'Compute account'
            : row.kind === 'Droplet'
              ? 'Droplet capacity account'
              : row.kind === 'Server'
                ? 'Server-limit account'
                : row.kind === 'SMTP'
                  ? 'SMTP-enabled account'
                  : row.kind === 'Trial'
                    ? 'Trial account'
                    : 'Cloud account',
    delivery: 'Confirm in quote',
    features: features(row),
  })),
);
export const brands = catalogDefinitions.map((def) => ({
  name: def.name,
  full: def.full,
  logo: def.name,
  color: def.color,
  summary: providerEditorial[def.name].summary,
  from: Math.min(
    ...products.filter((p) => p.provider === def.name).map((p) => p.price),
  ),
  desc: `Compare ${def.full} account packages, listed prices, and seller-provided account details.`,
}));
export const formatPrice = money;
