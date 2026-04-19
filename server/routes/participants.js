const express = require('express');
const {
  registerForEvent,
  getUserParticipations,
  getPendingParticipants,
  approveParticipant,
  rejectParticipant,
  getEventParticipants,
  checkInParticipant,
} = require('../controllers/participantController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authenticate, registerForEvent);
router.get('/my-participations', authenticate, getUserParticipations);
router.get('/event/:eventId', authenticate, getEventParticipants);
router.get('/pending/:eventId', authenticate, getPendingParticipants);
router.put('/:participantId/approve', authenticate, approveParticipant);
router.put('/:participantId/reject', authenticate, rejectParticipant);
router.put('/:participantId/checkin', authenticate, checkInParticipant);

module.exports = router;
