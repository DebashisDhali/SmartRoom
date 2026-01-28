const authService = require('../services/authService');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;
    
    let avatar = {
        public_id: "sample_id",
        url: "https://res.cloudinary.com/demo/image/upload/v1625213715/sample.jpg"
    };

    if (req.file) {
        const result = await uploadToCloudinary(req.file.path, 'smartroom/avatars');
        avatar = result;
    }

    const user = await authService.registerUser({
        name,
        email,
        phone,
        password,
        role,
        avatar
    });

    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);

    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };

    if (req.file) {
        const user = await authService.getUserById(req.user.id);
        
        // Delete old avatar if it's not the default sample
        if (user.avatar && user.avatar.public_id && user.avatar.public_id !== "sample_id") {
            await deleteFromCloudinary(user.avatar.public_id);
        }

        const result = await uploadToCloudinary(req.file.path, 'smartroom/avatars');
        newData.avatar = result;
    }

    const updatedUser = await authService.updateUser(req.user.id, newData);

    res.status(200).json({
        success: true,
        user: updatedUser,
    });
});
