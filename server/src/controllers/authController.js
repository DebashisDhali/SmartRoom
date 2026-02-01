const authService = require('../services/authService');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    console.log("Register User: Request received", req.body);
    const { name, email, phone, password, role } = req.body;
    
    let avatar = {
        public_id: "sample_id",
        url: "https://res.cloudinary.com/demo/image/upload/v1625213715/sample.jpg"
    };

    if (req.file) {
        console.log("Register User: Processing file upload");
        try {
            // Check if file is in memory (buffer) or on disk (path)
            if (req.file.buffer) {
                // Handle Memory Storage (Vercel)
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                const result = await uploadToCloudinary(dataURI, 'smartroom/avatars');
                avatar = result;
            } else if (req.file.path) {
                // Handle Disk Storage (Localhost)
                const result = await uploadToCloudinary(req.file.path, 'smartroom/avatars');
                avatar = result;
            } else {
                 console.log("File uploaded but no path/buffer found. Skipping Cloudinary.");
            }
        } catch (uploadError) {
            console.error("Cloudinary Upload Failed:", uploadError);
            // We continue without the avatar if upload fails, rather than crashing 500
        }
    }

    console.log("Register User: Creating user in DB");
    const user = await authService.registerUser({
        name,
        email,
        phone,
        password,
        role,
        avatar
    });
    console.log("Register User: User created", user._id);

    // Do not log in automatically.
    res.status(201).json({
        success: true,
        message: "Registration successful. Please login to continue.",
    });
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

        let result;
        if (req.file.buffer) {
            // Handle Memory Storage (Vercel)
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            result = await uploadToCloudinary(dataURI, 'smartroom/avatars');
        } else {
             // Handle Disk Storage (Localhost if configured that way)
            result = await uploadToCloudinary(req.file.path, 'smartroom/avatars');
        }
        newData.avatar = result;
    }

    const updatedUser = await authService.updateUser(req.user.id, newData);

    res.status(200).json({
        success: true,
        user: updatedUser,
    });
});
