const localStrategy = require('passport-local').Strategy;

const User = require('../app/models/users');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) { // This function tells passport how to get information from a user object and stored it in a session
        done(null, user.id)
    })
 
    passport.deserializeUser(function (id, done) { // This function take that user information and turn it back into a user object
        User.findById(id, function (err, user) {
            done(err, user)
        });
    });

    // Signup
    passport.use('local-signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if (err) return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'The email is already taken'));
            } else {
                var newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function (err) {
                    if (err) throw err

                    return done(null, newUser);
                })
            }

        })
    }))

    // Login
    passport.use('local-login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if (err) return done(err);

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found'));
            }

            if(!user.validatePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong Password'));
            }

            return done(null, user)
        });
    }));
}