const express = require('express'); // A web framework for Nodejs
const app = express();

const path = require('path'); // Its a node module included on its API, to make our paths relative. And supported in all OS
const mongoose = require('mongoose'); // Elegant mongodb object modeling for nodejs
const passport = require('passport'); // Passport is an authentication middleware for Node.js
const flash = require('connect-flash'); // The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const cookieParser = require('cookie-parser'); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names. In a simple way, parse and store cokkies in req.cookies
// const bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const session = require('express-session'); // Store user data between http requests. It assigns the client an ID and it makes all further requests using that ID. Information associates with the client is stores on the server linked to that ID. It store the data in req.session

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
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. 
}));
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // For persistent login sessions
app.use(flash()); // To connect or communicate into different webpages and to send error or log messages between them

// Routes
require('./app/routes')(app, passport); // We pass app and passport to use in that file. That file is a function with these two parameters

// Static Files
app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`)
})