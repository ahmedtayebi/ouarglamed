// PATH: server/src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const academicRoutes = require('./routes/academic.routes');
const moduleRoutes = require('./routes/module.routes');
const semesterRoutes = require('./routes/semester.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');
// Removed Prisma DB instance import

const app = express();

// Security HTTP headers
app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));

// Apply rate limiting to login endpoint specifically
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 login requests per `window`
    message: { message: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true, // Return rate limit info
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/auth/login', loginLimiter); // Protect login route
app.use('/api/auth', authRoutes);
app.use('/api/years', academicRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/semesters', semesterRoutes);

app.get('/', (req, res) => {
    res.send('MedGuid API is running...');
});

app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown Events
const gracefulShutdown = async () => {
    console.log('Shutting down server gracefully...');
    // Removed prisma.$disconnect();
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
