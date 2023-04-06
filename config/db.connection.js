const mongoose = require('mongoose');

const mongodbURL = process.env.MONGODB_URL;
mongoose.set("strictQuery", false) //Fixed deprecation error 4/5/2023
mongoose.connect(mongodbURL);
mongoose.connection.on('connected', ()=> console.log("Database connected."))
mongoose.connection.on('error', (err)=> console.log(err.message))
mongoose.connection.on('disconnected', ()=> console.log("Database disconnected."))