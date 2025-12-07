const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/order/:eventId', paymentController.createPaymentOrder);
router.post('/confirm/:paymentId', paymentController.confirmPayment);
router.get('/event/:eventId', paymentController.listPaymentsForEvent);
router.get('/stats/total', paymentController.getTotalCollected);

module.exports = router;
