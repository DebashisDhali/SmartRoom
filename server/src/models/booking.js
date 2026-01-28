const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.ObjectId,
        ref: "Room",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    bookingStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending',
    },
    visitDate: {
        type: Date,
        required: true,
    },
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
