module.exports = (app, passport) => {
    app.get('/', (req, res) => {
        console.log(`GET: ${req.cookies}`)
        res.render('index');
    });

    app.get('/login', (req, res) => {
        console.log(`Flash: ${req.flash}, Session: ${req.session}`)
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', (req, res) => {
        console.log(`GET: ${req.cookies}`)
        res.render('signup', {
            message: req.flash('signupMessage')
        })
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, (req, res) => {
        console.log(`GET: ${req.cookies}`)
        res.render('profile', {
            user: req.user
        });
    });

    app.get('/logout', (req, res) => {
        console.log(`GET: ${req.cookies}`)
        req.logout();
        res.redirect('/');
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/')
    }
}