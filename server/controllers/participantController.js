const Participant = require('../models/Participant');
const Event = require('../models/Event');
const { generateQRCode } = require('../utils/qrcode');

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const { rollNumber, department } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if already registered
    const existing = await Participant.findOne({ user: req.user.id, event: eventId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    // Create participant record (pending status)
    const participant = new Participant({
      user: req.user.id,
      event: eventId,
      status: 'pending',
      rollNumber,
      department,
    });

    // Generate QR code for approval
    const qrCode = await generateQRCode({
      participantId: participant._id,
      eventId,
      userId: req.user.id,
    });

    participant.qrCode = qrCode;
    await participant.save();

    res.status(201).json({
      success: true,
      message: 'Registration request submitted. Waiting for organizer approval.',
      participant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user participations
const getUserParticipations = async (req, res) => {
  try {
    const participations = await Participant.find({ user: req.user.id })
      .populate('event', 'title description venue category status paymentMethod paymentPhoneNumber paymentQRCode')
      .populate('user', 'name email');

    res.json({ success: true, participations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending participants for organizer
const getPendingParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify event belongs to organizer
    const event = await Event.findById(eventId);
    if (!event || event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const participants = await Participant.find({ event: eventId, status: 'pending' })
      .populate('user', 'name email phone department rollNumber');

    res.json({ success: true, participants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve participant
const approveParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;

    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    const event = await Event.findById(participant.event);
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    participant.status = 'approved';
    participant.paymentStatus = 'pending';
    await participant.save();

    // Increment event participant count
    event.currentParticipants += 1;
    await event.save();

    res.json({ success: true, message: 'Participant approved', participant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject participant
const rejectParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;

    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    const event = await Event.findById(participant.event);
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    participant.status = 'rejected';
    await participant.save();

    res.json({ success: true, message: 'Participant rejected', participant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get event participants (organizer only)
const getEventParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({ event: req.params.eventId })
      .populate('user', 'name email phone department')
      .populate('event', 'title');

    res.json({ success: true, participants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check in participant
const checkInParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.checkedIn = true;
    await participant.save();

    res.json({ success: true, message: 'Check-in successful', participant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerForEvent,
  getUserParticipations,
  getPendingParticipants,
  approveParticipant,
  rejectParticipant,
  getEventParticipants,
  checkInParticipant,
};
