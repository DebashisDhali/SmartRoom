const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter Room Title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter Room Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter Room Price"],
        max: [99999999, "Price cannot exceed 8 digits"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    videos: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please Enter Room Category"],
        enum: ['Bachelor', 'Family'],
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        latitude: { type: String },
        longitude: { type: String },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    facilities: [String],
    rules: [String],
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Booked', 'Under Maintenance'],
        default: 'Available'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    contactInfo: {
        phone: {
            type: String,
            required: [true, "Please Enter Contact Phone Number"],
        },
        whatsapp: {
            type: String,
        },
        facebook: {
            type: String,
        },
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    isApproved: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Room", roomSchema);
