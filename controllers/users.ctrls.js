const db = require("../models")

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