const express = require('express');
const {
  getEvents,
  getEvent,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getEvents);
router.get('/organizer/my-events', authenticate, getOrganizerEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;
