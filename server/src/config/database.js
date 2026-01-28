const mongoose = require('mongoose');

const connectDatabase = () => {
    // Return the promise to allow awaiting
    return mongoose.connect(process.env.MONGODB_URI, {
        // Fail after 10 seconds if can't connect (matches functionality of buffering timeout)
        serverSelectionTimeoutMS: 10000, 
    })
    .then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((err) => {
        console.log("Database connection error: ", err.message);
        console.log("Make sure your IP is whitelisted in MongoDB Atlas or '0.0.0.0/0' is added for Vercel/Production.");
    });
};

module.exports = connectDatabase;
