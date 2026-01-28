const BaseRepository = require('./baseRepository');
const Room = require('../models/room');

class RoomRepository extends BaseRepository {
    constructor() {
        super(Room);
    }

    async findWithFilters(query) {
        // Implement search with weights and filters here
        return await this.model.find(query);
    }
    
    async findById(id) {
        return await this.model.findById(id).populate('owner', 'name avatar email phone');
    }

    // Custom search logic
    async searchRooms(filters) {
        let query = {};
        
        // Only show approved and available rooms by default
        query.availabilityStatus = 'Available';

        if (filters.isApproved !== undefined) {
            query.isApproved = filters.isApproved === 'true';
        } else {
            query.isApproved = true;
        }

        if (filters.keyword) {
            query.title = { $regex: filters.keyword, $options: 'i' };
        }

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.city) {
            query['location.city'] = { $regex: filters.city, $options: 'i' };
        }

        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
        }

        return await this.model.find(query).populate('owner', 'name avatar');
    }
}

module.exports = new RoomRepository();
