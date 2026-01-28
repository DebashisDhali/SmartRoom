const userRepository = require('../repositories/userRepository');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

class AuthService {
    async registerUser(userData) {
        const { name, email, phone, password, role, avatar } = userData;

        const user = await userRepository.create({
            name,
            email,
            phone,
            password,
            role,
            avatar,
        });

        return user;
    }

    async loginUser(email, password) {
        if (!email || !password) {
            throw new ErrorHandler("Please Enter Email & Password", 400);
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new ErrorHandler("Invalid email or password", 401);
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            throw new ErrorHandler("Invalid email or password", 401);
        }

        return user;
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        return user;
    }

    async updateUser(id, userData) {
        return await userRepository.update(id, userData);
    }
}

module.exports = new AuthService();
