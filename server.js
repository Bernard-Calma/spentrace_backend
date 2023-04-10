// IMPORTS
require("dotenv").config()
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require("cors")
const app = express();
//  ------------------- END OF IMPORT --------------------

// ENV
var env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8000;
// Cors
const whiteList = ["http://localhost:3000", process.env.CLIENT_URL ]
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
// CORS
app.use(cors(corsOption))
// Session
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 10000 * 60 * 60
    })
}));

// Custom Middleware
const authRequired = (req, res, next) => {
    // Middleware to check if use exist in session.
    console.log("AuthRequired", req.session)
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

// Routes with authentication
app.use("/plans", authRequired, routes.plans)
app.use('/bills', authRequired, routes.bills)
//  ------------------- END OF Routes --------------------


// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(`Server is running ${env}`)
})