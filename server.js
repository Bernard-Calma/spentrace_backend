// EXPRESS
const express = require('express')
const app = express();
require("dotenv").config()
// SESSIONS
const session = require("express-session")
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
// CORS
const cors = require("cors")
const whiteList = ["http://localhost:3000", process.env.CLIENT_URL ]
const corsOption = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}
app.use(cors(corsOption))

// PORT
const PORT = process.env.PORT || 8000;

// DATABASE
require("./config/db.connection")

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.options("*", cors())
// ROUTES
const routes = require("./routes")
app.get('/', (req, res) => {
    res.send("Spentrace Back End")
})
app.use("/users", routes.users);
app.use("/plans", (req, res, next) => {
    res.locals.currentUser = req.session.currentUser
    // console.log("App use",req.session);
    next();
})
app.use("/plans", routes.plans)

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
    console.log(`Server is running ${process.env}`)
})