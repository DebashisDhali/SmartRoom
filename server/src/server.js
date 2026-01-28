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
