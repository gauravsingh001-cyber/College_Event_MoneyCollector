const Payment = require('../models/Payment'); 
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE PAYMENT ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { payerName, mobile, address, rollNo } = req.body;

    if (!payerName || !mobile) {
      return res.status(400).json({ error: "Name & Mobile is required" });
    }

    const Event = require('../models/Event');
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const amountRupees = event.price || 0;
    const amountPaise = Math.round(amountRupees * 100);

    const payment = await Payment.create({
      eventId,
      payerName,
      mobile,
      address,
      rollNo,
      amount: amountRupees,
      currency: 'INR',
      status: 'pending'
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${payment._id}`,
      payment_capture: 1
    });

    payment.paymentGatewayOrderId = order.id;
    await payment.save();

    res.json({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id
    });
  } catch (err) {
    console.error('createPaymentOrder error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// CONFIRM PAYMENT
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing razorpay verification fields' });
    }

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payment = await Payment.findByIdAndUpdate(paymentId, {
      status: 'paid',
      paymentGatewayPaymentId: razorpay_payment_id,
      paymentGatewayOrderId: razorpay_order_id
    }, { new: true });

    res.json({ payment });
  } catch (err) {
    console.error('confirmPayment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// LIST PAYMENTS FOR EVENT
exports.listPaymentsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const payments = await Payment.find({ eventId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('listPaymentsForEvent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET TOTAL COLLECTED
exports.getTotalCollected = async (req, res) => {
  try {
    const { eventId } = req.query;
    const match = { status: 'paid' };
    if (eventId) match.eventId = mongoose.Types.ObjectId(eventId);
    const agg = await Payment.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ total: agg[0] ? agg[0].total : 0 });
  } catch (err) {
    console.error('getTotalCollected error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
