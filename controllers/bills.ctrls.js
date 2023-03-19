const db = require("../models")

// ROUTES
const index = (req, res) => {
    console.log("Index route called");
    // console.log("Plans Index Session: ", req.params.id)
    db.bills.find({userId: req.params.id}, (err, allBills) => {
        // console.log("Plans Index allPlans: ", allPlans)
        try {
            if (err) return res.status(404).json({error: err.message})
            return res.status(200).json(allBills)
        } catch {
            return res.status(200).json(allBills)
        }
    }).sort({date: "asc"})
}