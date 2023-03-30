const db = require("../models")

// ROUTES
const index = (req, res) => {
    console.log("Index route (Bills) called");
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

const create = (req, res) => {
    console.log("Add Bill called");
    db.bills.create(req.body, (err, newBill) => {
        try {
            if(err) return res.status(404).json({error: err.message})
            console.log("Successfully Added", newBill)
            return res.status(200).json(newBill)
        } catch {
            return res.status(200).json(newBill)
        }
    })
}

const destroy = (req, res) => {
    console.log("Delete Route Called")
    db.bills.findByIdAndDelete(req.params.id, (err, deletedBIll) => {
        try {
            if (err) return (res.status(400).json({err: err.message}))
            console.log("Successfully Deleted", deletedBIll)
            return res.status(200).json({message: deletedBIll})
        } catch {
            return res.status(200).json({message: deletedBIll})
        }
    })
}

module.exports = {
    index,
    create,
    destroy
}