const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const dotenv = require('dotenv');

// Config
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Connect to database
connectDatabase();

module.exports = app;
