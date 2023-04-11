// IMPORTS
require("dotenv").config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')
const MongoStore = require('connect-mongo')
const cors = require("cors")
const app = express();
//  ------------------- END OF IMPORT --------------------

// ENV
var env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8000;
//  ------------------- END OF ENV --------------------

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
// CORS
app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL]
}))
// Session
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    secure: process.env.NODE_ENV ? true : false,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production"
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 10000 * 60 * 60
    })
}));

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/spentrace"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Custom Middleware
const authRequired = (req, res, next) => {
    // Middleware to check if use exist in session.
    // console.log("AuthRequired", req.session)
	if(req.session.currentUser){
		next()
	} else {
		res.status(401).send('You must be logged in to do that!')
	}
}

//  ------------------- END OF MIDDLEWARE --------------------

// DATABASE
require("./config/db.connection")
//  ------------------- END OF DATABASE --------------------

// ROUTES
const routes = require("./routes")

// Check if session currently has a user
app.get('/', (req, res) => {
    if (!req.session.currentUser) res.send("Spentrace Backend")
    else res.json(req.session.currentUser)
})

// Routes without authentication
app.use("/users", routes.users);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  
// Routes with authentication
app.use("/plans", authRequired, routes.plans)
app.use('/bills', authRequired, routes.bills)
//  ------------------- END OF Routes --------------------


// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(`Server is running ${env}`)
})