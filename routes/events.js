const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');


router.post('/', eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/:slug', eventController.getEvent);


module.exports = router;