const Event = require('../models/Event');

// Get organizer's events
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const events = await Event.find(filter).populate('organizer', 'name email');
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email phone');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      venue, 
      startDate, 
      endDate, 
      registrationFee, 
      maxParticipants,
      paymentMethod,
      paymentPhoneNumber,
      paymentQRCode
    } = req.body;

    // Validate payment method requirements
    if (paymentMethod === 'phone' && !paymentPhoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required when payment method is phone' 
      });
    }

    if (paymentMethod === 'qr' && !paymentQRCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'QR code is required when payment method is QR' 
      });
    }

    const event = new Event({
      title,
      description,
      category,
      venue,
      startDate,
      endDate,
      registrationFee,
      maxParticipants,
      paymentMethod,
      paymentPhoneNumber,
      paymentQRCode,
      organizer: req.user.id,
    });

    await event.save();
    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json({ success: true, message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
