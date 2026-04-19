const Payment = require('../models/Payment');
const Participant = require('../models/Participant');

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { participantId, eventId } = req.query;

    const payment = await Payment.findOne({ participant: participantId, event: eventId })
      .populate('event', 'title registrationFee')
      .populate('participant', 'user')
      .populate({
        path: 'participant',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create payment record
const createPayment = async (req, res) => {
  try {
    const { participantId, eventId, amount, paymentMethod } = req.body;

    const payment = new Payment({
      participant: participantId,
      event: eventId,
      amount,
      paymentMethod,
    });

    await payment.save();
    res.status(201).json({ success: true, message: 'Payment record created', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Collect payment
const collectPayment = async (req, res) => {
  try {
    const { participantId } = req.params;
    const { amount, paymentMethod } = req.body;

    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    // Update or create payment
    let payment = await Payment.findOne({ participant: participantId });
    if (payment) {
      payment.status = 'completed';
      payment.amount = amount;
      payment.paymentMethod = paymentMethod;
      payment.paidDate = new Date();
      payment.transactionId = `TXN-${Date.now()}`;
    } else {
      payment = new Payment({
        participant: participantId,
        event: participant.event,
        amount,
        paymentMethod,
        status: 'completed',
        paidDate: new Date(),
        transactionId: `TXN-${Date.now()}`,
      });
    }

    await payment.save();

    // Update participant payment status
    participant.paymentStatus = 'completed';
    await participant.save();

    res.json({ success: true, message: 'Payment collected successfully', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all payments for event (organizer)
const getEventPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ event: req.params.eventId })
      .populate('participant')
      .populate('event', 'title');

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPaymentDetails,
  createPayment,
  collectPayment,
  getEventPayments,
};
