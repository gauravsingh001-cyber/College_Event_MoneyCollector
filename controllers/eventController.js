const Event = require('../models/Event');
const { generateQRCodeDataURL } = require('../utils/qr');
const shortid = require('shortid');


exports.createEvent = async (req, res) => {
try {
const { title, description, date, price, organiser } = req.body;
const slug = shortid.generate();
const event = await Event.create({ title, description, date, price, organiser, slug });
const url = `${process.env.FRONTEND_URL}/event/${event.slug}`;
const qr = await generateQRCodeDataURL(url);
res.json({ event, qrUrl: qr, shareUrl: url });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};


exports.listEvents = async (req, res) => {
try {
const events = await Event.find().sort({ createdAt: -1 });
res.json(events);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};


exports.getEvent = async (req, res) => {
try {
const event = await Event.findOne({ slug: req.params.slug });
if (!event) return res.status(404).json({ error: 'Event not found' });
res.json(event);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};