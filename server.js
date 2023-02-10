// EXPRESS
const express = require('express')

const app = express();

// PORT
const PORT = 8000;

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
})