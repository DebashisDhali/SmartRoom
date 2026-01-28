const express = require('express');
const { 
    getAdminStats, 
    updateRoomStatus, 
    verifyOwner 
} = require('../controllers/adminController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected and restricted to admin
router.use(isAuthenticatedUser, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.put('/room/:id', updateRoomStatus);
router.put('/user/verify/:id', verifyOwner);

module.exports = router;
