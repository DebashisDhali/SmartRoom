const roomRepository = require('../repositories/roomRepository');
const ErrorHandler = require('../utils/errorHandler');
const { deleteFromCloudinary } = require('../utils/cloudinary');

class RoomService {
    async createRoom(roomData, ownerId) {
        roomData.owner = ownerId;
        return await roomRepository.create(roomData);
    }

    async getAllRooms(filters) {
        return await roomRepository.searchRooms(filters);
    }

    async getRoomDetails(id) {
        const room = await roomRepository.findById(id);
        if (!room) {
            throw new ErrorHandler("Room not found", 404);
        }
        return room;
    }

    async updateRoom(id, roomData, userId, userRole) {
        let room = await roomRepository.findById(id);

        if (!room) {
            throw new ErrorHandler("Room not found", 404);
        }

        // Only owner or admin can update
        if (room.owner._id.toString() !== userId.toString() && userRole !== 'admin') {
            throw new ErrorHandler("Not authorized to update this room", 403);
        }

        // If new images are uploaded, delete old ones from Cloudinary
        if (roomData.images && roomData.images.length > 0) {
            for (const image of room.images) {
                await deleteFromCloudinary(image.public_id, "image");
            }
        }

        // If new videos are uploaded, delete old ones from Cloudinary
        if (roomData.videos && roomData.videos.length > 0) {
            for (const video of room.videos) {
                await deleteFromCloudinary(video.public_id, "video");
            }
        }

        return await roomRepository.update(id, roomData);
    }

    async deleteRoom(id, userId, userRole) {
        let room = await roomRepository.findById(id);

        if (!room) {
            throw new ErrorHandler("Room not found", 404);
        }

        if (room.owner.toString() !== userId.toString() && userRole !== 'admin') {
            throw new ErrorHandler("Not authorized to delete this room", 403);
        }

        // Delete images from Cloudinary
        for (const image of room.images) {
            await deleteFromCloudinary(image.public_id, "image");
        }

        // Delete videos from Cloudinary
        for (const video of room.videos) {
            await deleteFromCloudinary(video.public_id, "video");
        }

        await roomRepository.delete(id);
    }

    async updateRoomStatus(id, status, userId, userRole) {
        let room = await roomRepository.findById(id);

        if (!room) {
            throw new ErrorHandler("Room not found", 404);
        }

        if (room.owner._id.toString() !== userId.toString() && userRole !== 'admin') {
            throw new ErrorHandler("Not authorized to update this room", 403);
        }

        return await roomRepository.update(id, { availabilityStatus: status });
    }

    async createRoomReview(roomId, reviewData, user) {
        const { rating, comment } = reviewData;
        const room = await roomRepository.findById(roomId);

        if (!room) {
            throw new ErrorHandler("Room not found", 404);
        }

        const isReviewed = room.reviews.find(
            (rev) => rev.user.toString() === user._id.toString()
        );

        if (isReviewed) {
            room.reviews.forEach((rev) => {
                if (rev.user.toString() === user._id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                }
            });
        } else {
            room.reviews.push({
                user: user._id,
                name: user.name,
                rating: Number(rating),
                comment,
            });
            room.numOfReviews = room.reviews.length;
        }

        let avg = 0;
        room.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        room.ratings = avg / room.reviews.length;

        await room.save({ validateBeforeSave: false });
        return room;
    }

    async getOwnerRooms(ownerId) {
        return await roomRepository.findWithFilters({ owner: ownerId });
    }
}

module.exports = new RoomService();
