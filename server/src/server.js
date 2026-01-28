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
connectDatabase().then(() => {
    const server = app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is working on http://localhost:${process.env.PORT || 5000}`);
    });
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});
