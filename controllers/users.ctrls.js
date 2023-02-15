const db = require("../models");
const bcrypt = require("bcrypt"); // To hash password

// ROUTES

// INDEX
// Get all users data
const index = (req, res) => {
    db.users.find({}, (err, allUsers) => {
        try {
            if (err) return res.status(404).json({error: err.message})
            return res.status(200).json(allUsers);
        } catch {
            return res.status(200).json(allUsers);
        }
    })
}

// Login
const login = (req, res) => {
    // console.log("Body", req.body)
    db.users.findOne({username: req.body.username.toLowerCase()}, (err, userFound) => {
        if (err) return(res.status(400).json({error: err.message}))
        if (!userFound) return(res.status(404).json({error: "User not found"}))
        if (!bcrypt.compareSync(req.body.password, userFound.password)) return(res.status(400).json({error: "Incorrect Password"}))
        return (res.status(200).json(userFound))
    })
}

module.exports = {
    index,
    login,
}