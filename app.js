var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalPassport = require('passport-local'),
	User = require('../application/models/user'),
	methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/csc651-pickle', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));

//view engine makes it so it automatically knows its ejs, by just using / with the ejs
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.use(
	require('express-session')({
		secret: 'pickle',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//Routers

const homepageRouter = require('./routes/homepage');

app.use(homepageRouter);

const musicRouter = require('./routes/music');

app.use(musicRouter);

app.get('/register', function(req, res) {
	res.render('register');
});

app.post('/register', function(req, res) {
	var newUser = new User({ username: req.body.username });

	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	}),
	function(req, res) {}
);

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

app.listen(3000, process.env.PORT, function() {
	console.log('The Server Has Started!');
});


