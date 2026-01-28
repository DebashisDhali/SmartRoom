const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const data = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    } catch (err) {
        console.log("Database connection error: ", err.message);
        // Do not swallow the error; throw it so the server startup fails explicitly
        throw err;
    }
};

module.exports = connectDatabase;
