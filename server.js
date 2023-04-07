// IMPORTS
require("dotenv").config()
const express = require('express')
const methodOverride = require('method-override')
// Session
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require("passport");
const cors = require("cors")
const app = express();
//  ------------------- END OF IMPORT --------------------

// ENV
var env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8000;
// Cors
const whiteList = ["http://localhost:3000", process.env.CLIENT_URL, process.env.CLIENT_URL_HTTP, process.env.HEROKU_URL, process.env.HEROKU_URL_HTTP ]
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
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
// CORS
app.use(cors({origin: "http://localhost:3000", credentials: true}))
// Session
app.set('trust proxy', 1)
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: 'none',
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 100 * 60 * 60
    })
}));
// Passport
app.use(passport.initialize())
app.use(passport.session())

//  ------------------- END OF MIDDLEWARE --------------------

// DATABASE
require("./config/db.connection")
// ROUTES
const routes = require("./routes")
app.use("/users", routes.users);
app.use("/plans", routes.plans)
app.use('/bills', routes.bills)

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(`Server is running ${env}`)
})