const express = require('express'); // A web framework for Nodejs
const app = express();

const path = require('path');
const mongoose = require('mongoose'); 
const passport = require('passport'); 
const flash = require('connect-flash'); 
const morgan = require('morgan');
const cookieParser = require('cookie-parser'); 
const session = require('express-session'); 

const { url } = require('./config/database');

// MongoDB connection
mongoose.connect(url, { useNewUrlParser: true }, () => {
    console.log('Database online')
})

// Passport config
require('./config/passport')(passport);

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({extended: false})); // False because I dont want to process images and encode it
app.use(session({
    secret: 'SNMC1999',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
require('./app/routes')(app, passport);

// Static Files
app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`)
})
