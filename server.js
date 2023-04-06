// IMPORTS
require("dotenv").config()
const express = require('express')
const methodOverride = require('method-override')
const session = require("express-session")
const passport = require("passport");
const cors = require("cors")
//  ------------------- END OF IMPORT --------------------

// ENV
var env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8000;
// Cors
const whiteList = ["http://localhost:3000", "http://192.168.1.80:3000", process.env.CLIENT_URL, process.env.CLIENT_URL_HTTP, process.env.HEROKU_URL, process.env.HEROKU_URL_HTTP ]
const corsOption = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }, credentials: true
}
//  ------------------- END OF ENV --------------------

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
// Session
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// Passport
app.use(passport.initialize())
app.use(passport.session())
// CORS
app.use(cors(corsOption))
//  ------------------- END OF MIDDLEWARE --------------------

// DATABASE
require("./config/db.connection")

// ROUTES
const routes = require("./routes")
app.get('/', (req, res) => {
    res.send("Spentrace Back End")
})
app.use("/users", routes.users);
app.use("/plans", (req, res, next) => {
    res.locals.currentUser = req.session.currentUser
    next();
})
app.use("/plans", routes.plans)
app.use('/bills', routes.bills)

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(`Server is running ${env}`)
})