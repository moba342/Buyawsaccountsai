import { InputError, verifyPayment } from '../server/payment-verifier.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res
      .status(405)
      .json({ status: 'invalid', message: 'Use POST to check a payment.' });
  }
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host)
        return res
          .status(403)
          .json({
            status: 'invalid',
            message: 'Use checkout on this website to verify a payment.',
          });
    } catch {
      return res
        .status(403)
        .json({ status: 'invalid', message: 'Invalid request origin.' });
    }
  }
  try {
    if (Number(req.headers['content-length'] || 0) > 16384)
      return res
        .status(413)
        .json({ status: 'invalid', message: 'Payment request is too large.' });
    const raw =
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    if (Buffer.byteLength(raw) > 16384)
      return res
        .status(413)
        .json({ status: 'invalid', message: 'Payment request is too large.' });
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      throw new InputError('Invalid payment request.');
    }
    return res.status(200).json(await verifyPayment(body));
  } catch (error) {
    if (error instanceof InputError)
      return res
        .status(400)
        .json({ status: 'invalid', message: error.message });
    return res
      .status(503)
      .json({
        status: 'unavailable',
        message:
          'The blockchain provider is temporarily unavailable. Your payment status has not been confirmed. Please try again.',
      });
  }
}
