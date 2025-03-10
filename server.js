// IMPORTS
require("dotenv").config()
const express = require('express')
const session = require('express-session')
const passport = require('passport');
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
    origin: [process.env.CLIENT_URL],
}))
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // handle OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    } else {
        next();
    }
});
// Session
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 60 * 60 * 1000,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 10000 * 60 * 60
    })
}));

// Passport
app.use(passport.initialize())
app.use(passport.session())
//  ------------------- END OF MIDDLEWARE --------------------

// DATABASE
require("./config/db.connection")
//  ------------------- END OF DATABASE --------------------

// ROUTES
const routes = require("./routes")

// Check if session currently has a user
app.get('/', (req, res) => {
//   console.log(req.session)
  if (req.session.passport?.user) res.status(200).json(req.session.passport)
  else res.status(401).json({message: "Spentrace Backend"})
})

// Routes without authentication
app.use("/users", routes.users);

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

  
// Routes with authentication
app.use("/plans", routes.plans)
app.use('/bills', routes.bills)
app.use('/accounts', routes.accounts)
//  ------------------- END OF Routes --------------------


// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(`Server is running ${env}`)
})