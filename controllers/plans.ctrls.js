const db = require("../models")

// ROUTES

// INDEX
// Get all plans data
const index = (req, res) => {
    console.log("Index route called");
    db.plans.find({}, (err, allPlans) => {
        try {
            if (err) return res.status(404).json({error: err.message})
            return res.status(200).json(allPlans)
        } catch {
            return res.status(200).json(allPlans)
        }
    })
}

module.exports = {
    index,
}