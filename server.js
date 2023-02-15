// EXPRESS
const express = require('express')
const app = express();
require("dotenv").config()

// PORT
const PORT = process.env.PORT || 8000;

// DATABASE
require("./config/db.connection")

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// ROUTES
const routes = require("./routes")
app.get('/', (req, res) => {
    res.send("Spentrace Back End")
})
app.use("/users", routes.users);
app.use("/plans", routes.users)

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
})