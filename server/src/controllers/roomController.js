const roomService = require('../services/roomService');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.createRoom = catchAsyncErrors(async (req, res, next) => {
    console.log('--- Create Room Request ---');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    let images = [];
    let videos = [];

    if (req.files && req.files.images) {
        for (const file of req.files.images) {
            let result;
            if (file.buffer) {
                const b64 = Buffer.from(file.buffer).toString("base64");
                const dataURI = "data:" + file.mimetype + ";base64," + b64;
                result = await uploadToCloudinary(dataURI, 'smartroom/rooms/images');
            } else {
                result = await uploadToCloudinary(file.path, 'smartroom/rooms/images');
            }
            images.push(result);
        }
    }

    if (req.files && req.files.videos) {
        for (const file of req.files.videos) {
            let result;
            if (file.buffer) {
                const b64 = Buffer.from(file.buffer).toString("base64");
                const dataURI = "data:" + file.mimetype + ";base64," + b64;
                result = await uploadToCloudinary(dataURI, 'smartroom/rooms/videos');
            } else {
                result = await uploadToCloudinary(file.path, 'smartroom/rooms/videos');
            }
            videos.push(result);
        }
    }

    // Parse location if it's sent as a string (usual with multipart/form-data)
    let location = req.body.location;
    if (typeof location === 'string') {
        location = JSON.parse(location);
    }

    let contactInfo = req.body.contactInfo;
    if (typeof contactInfo === 'string') {
        contactInfo = JSON.parse(contactInfo);
    }

    const roomData = {
        ...req.body,
        location,
        contactInfo,
        images,
        videos,
        facilities: typeof req.body.facilities === 'string' ? JSON.parse(req.body.facilities) : req.body.facilities,
        rules: typeof req.body.rules === 'string' ? JSON.parse(req.body.rules) : req.body.rules,
    };

    const room = await roomService.createRoom(roomData, req.user.id);

    res.status(201).json({
        success: true,
        room,
    });
});

exports.getAllRooms = catchAsyncErrors(async (req, res, next) => {
    const rooms = await roomService.getAllRooms(req.query);

    res.status(200).json({
        success: true,
        rooms,
    });
});

exports.getRoomDetails = catchAsyncErrors(async (req, res, next) => {
    const room = await roomService.getRoomDetails(req.params.id);

    res.status(200).json({
        success: true,
        room,
    });
});

exports.updateRoom = catchAsyncErrors(async (req, res, next) => {
    let images = [];
    let videos = [];

    if (req.files && req.files.images) {
        for (const file of req.files.images) {
            let result;
            if (file.buffer) {
                const b64 = Buffer.from(file.buffer).toString("base64");
                const dataURI = "data:" + file.mimetype + ";base64," + b64;
                result = await uploadToCloudinary(dataURI, 'smartroom/rooms/images');
            } else {
                result = await uploadToCloudinary(file.path, 'smartroom/rooms/images');
            }
            images.push(result);
        }
    }

    if (req.files && req.files.videos) {
        for (const file of req.files.videos) {
            let result;
            if (file.buffer) {
                const b64 = Buffer.from(file.buffer).toString("base64");
                const dataURI = "data:" + file.mimetype + ";base64," + b64;
                result = await uploadToCloudinary(dataURI, 'smartroom/rooms/videos');
            } else {
                result = await uploadToCloudinary(file.path, 'smartroom/rooms/videos');
            }
            videos.push(result);
        }
    }

    let roomData = { ...req.body };

    if (req.body.location && typeof req.body.location === 'string') {
        roomData.location = JSON.parse(req.body.location);
    }

    if (req.body.contactInfo && typeof req.body.contactInfo === 'string') {
        roomData.contactInfo = JSON.parse(req.body.contactInfo);
    }

    if (req.body.facilities && typeof req.body.facilities === 'string') {
        roomData.facilities = JSON.parse(req.body.facilities);
    }

    if (req.body.rules && typeof req.body.rules === 'string') {
        roomData.rules = JSON.parse(req.body.rules);
    }

    if (images.length > 0) roomData.images = images;
    if (videos.length > 0) roomData.videos = videos;

    const room = await roomService.updateRoom(req.params.id, roomData, req.user.id, req.user.role);

    res.status(200).json({
        success: true,
        room,
    });
});

exports.deleteRoom = catchAsyncErrors(async (req, res, next) => {
    await roomService.deleteRoom(req.params.id, req.user.id, req.user.role);

    res.status(200).json({
        success: true,
        message: "Room deleted successfully",
    });
});

exports.getOwnerRooms = catchAsyncErrors(async (req, res, next) => {
    const rooms = await roomService.getOwnerRooms(req.user.id);

    res.status(200).json({
        success: true,
        rooms,
    });
});

exports.updateStatus = catchAsyncErrors(async (req, res, next) => {
    const room = await roomService.updateRoomStatus(req.params.id, req.body.status, req.user.id, req.user.role);

    res.status(200).json({
        success: true,
        room,
    });
});
exports.createRoomReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, roomId } = req.body;

    const room = await roomService.createRoomReview(roomId, { rating, comment }, req.user);

    res.status(200).json({
        success: true,
        room,
    });
});
