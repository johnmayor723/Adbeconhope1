const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3061;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// DB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adbeconhope1';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change_this_secret';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(err => console.error('Mongoose connection error:', err));

mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${MONGODB_URI}`));
mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
const sessionStore = MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
});

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        },
    })
);

// Routers
const indexRouter = require('./routes/index');
const managementRouter = require('./routes/management');

app.use('/', indexRouter);
app.use('/management', managementRouter);

// Server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
