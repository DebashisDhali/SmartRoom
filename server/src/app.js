const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middlewares/error');

const app = express();

// Middlewares
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow all origins to prevent frustration with local network testing
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'https://living-room-finder.vercel.app' // Explicitly allow Vercel domain if env is missing
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || /vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        
        console.log('Blocked by CORS:', origin); // Log blocked origins for debugging
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Default Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to SmartRoom API'
    });
});

// Routes Import
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Routes Declaration
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
