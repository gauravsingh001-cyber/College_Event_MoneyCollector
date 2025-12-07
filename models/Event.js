const mongoose = require('mongoose');


const EventSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
date: Date,
price: { type: Number, default: 0 }, // store rupees as integer
organiser: {
name: String,
email: String,
phone: String
},
slug: { type: String, unique: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Event', EventSchema);