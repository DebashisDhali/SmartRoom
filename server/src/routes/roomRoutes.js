const express = require('express');
const { 
    getAllRooms, 
    createRoom, 
    getRoomDetails, 
    updateRoom, 
    deleteRoom,
    getOwnerRooms,
    updateStatus,
    createRoomReview
} = require('../controllers/roomController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomDetails);
router.put('/review', isAuthenticatedUser, createRoomReview);

const upload = require('../middlewares/multer');

// Protected Routes
router.get('/owner/me', isAuthenticatedUser, authorizeRoles('owner', 'admin'), getOwnerRooms);
router.post('/new', isAuthenticatedUser, authorizeRoles('owner', 'admin'), upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), createRoom);
router.put('/:id', isAuthenticatedUser, authorizeRoles('owner', 'admin'), upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), updateRoom);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner', 'admin'), deleteRoom);
router.patch('/:id/status', isAuthenticatedUser, authorizeRoles('owner', 'admin'), updateStatus);

module.exports = router;
