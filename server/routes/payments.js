const express = require('express');
const {
  getPaymentDetails,
  createPayment,
  collectPayment,
  getEventPayments,
} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/details', authenticate, getPaymentDetails);
router.post('/create', authenticate, createPayment);
router.put('/:participantId/collect', authenticate, collectPayment);
router.get('/event/:eventId', authenticate, getEventPayments);

module.exports = router;
