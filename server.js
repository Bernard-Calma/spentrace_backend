// EXPRESS
const express = require('express')
const app = express();
require("dotenv").config()

// PORT
const PORT = process.env.PORT || 8000;

// DATABASE
require("./config/db.connection")

// ROUTES
app.get('/', (req, res) => {
    res.send("Spentrace Back End")
})

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
})