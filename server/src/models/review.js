const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: "Room",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate average ratings for a room
reviewSchema.statics.calculateAverageRating = async function(roomId) {
    const stats = await this.aggregate([
        { $match: { room: roomId } },
        {
            $group: {
                _id: '$room',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Room').findByIdAndUpdate(roomId, {
            ratings: stats[0].avgRating,
            numOfReviews: stats[0].nRating
        });
    } else {
        await mongoose.model('Room').findByIdAndUpdate(roomId, {
            ratings: 0,
            numOfReviews: 0
        });
    }
};

reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.room);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calculateAverageRating(this.r.room);
});

module.exports = mongoose.model("Review", reviewSchema);
