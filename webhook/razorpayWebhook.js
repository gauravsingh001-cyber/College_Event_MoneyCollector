const crypto = require('crypto');
const Payment = require('../models/Payment');


module.exports = async (req, res) => {
const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
const signature = req.headers['x-razorpay-signature'];
const body = req.body.toString(); // raw body
const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');


if (signature !== expected) {
console.error('Invalid webhook signature');
return res.status(400).send('invalid');
}


const event = req.body.event; // e.g. payment.captured
if (event === 'payment.captured') {
const payload = req.body.payload.payment.entity;
const order_id = payload.order_id;
const payment_id = payload.id;


// Update local payment matching order_id
await Payment.findOneAndUpdate({ paymentGatewayOrderId: order_id }, { status: 'paid', paymentGatewayPaymentId: payment_id });
}


res.status(200).json({ ok: true });
};