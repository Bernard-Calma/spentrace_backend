const db = require("../models")

// ROUTES
// INDEX
// Get all plans data
const index = (req, res) => {
    console.log("Index route called");
    console.log("Plans Index Session: ", req.params.id)
    db.plans.find({userId: "630d880da09907042f834a7d"}, (err, allPlans) => {
        console.log("Plans Index allPlans: ", allPlans)
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