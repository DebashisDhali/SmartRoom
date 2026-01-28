const BaseRepository = require('./baseRepository');
const User = require('../models/user');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.model.findOne({ email }).select("+password");
    }

    async findByPhone(phone) {
        return await this.model.findOne({ phone }).select("+password");
    }
}

module.exports = new UserRepository();
