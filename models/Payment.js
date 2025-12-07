const mongoose = require('mongoose');


const PaymentSchema = new mongoose.Schema({
eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
payerName: String,
mobile: String,
address: String,
rollNo: String,
amount: Number, // rupees stored as integer
currency: { type: String, default: 'INR' },
paymentGatewayOrderId: String, // Razorpay order id
paymentGatewayPaymentId: String, // Razorpay payment id
status: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Payment', PaymentSchema);