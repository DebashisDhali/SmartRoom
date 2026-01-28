const User = require('../models/user');
const Room = require('../models/room');
const Booking = require('../models/booking');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Get Dashboard Stats
exports.getAdminStats = catchAsyncErrors(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const pendingRooms = await Room.countDocuments({ isApproved: false });
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
        success: true,
        stats: {
            totalUsers,
            totalRooms,
            pendingRooms,
            totalBookings
        }
    });
});

// Update Room Status (Approve/Reject)
exports.updateRoomStatus = catchAsyncErrors(async (req, res, next) => {
    const { isApproved } = req.body;
    
    const room = await Room.findByIdAndUpdate(req.params.id, { isApproved }, {
        new: true,
        runValidators: true
    });

    if (!room) {
        return next(new ErrorHandler("Room not found", 404));
    }

    res.status(200).json({
        success: true,
        room
    });
});

// Verify Owner
exports.verifyOwner = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});
