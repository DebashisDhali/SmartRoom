const dotenv = require('dotenv');
// Config
dotenv.config();

const app = require('./app');
const connectDatabase = require('./config/database');

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Redundant config removed

// Connecting to database
// Connecting to database
// connectDatabase();

// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server is working on http://localhost:${process.env.PORT}`);
// });

// Better startup: Connect to DB first, then start server
let server;

const startServer = async () => {
    try {
        await connectDatabase();
        
        if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
             console.log("--- Server Environment Check ---");
             console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Defined (Starts with " + process.env.MONGODB_URI.substring(0, 5) + "...)" : "UNDEFINED");
             console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Defined" : "UNDEFINED");
             console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Defined" : "UNDEFINED");
             console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "UNDEFINED");
        }

        server = app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is working on http://localhost:${process.env.PORT || 5000}`);
        });
    } catch (error) {
        console.error("Failed to start server due to Database Error:", error.message);
        process.exit(1);
    }
};

startServer();

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
