const db = require("../models")

// ROUTES
// INDEX
// Get all plans data
const index = (req, res) => {
    console.log("Index route called");
    // console.log("Plans Index Session: ", req.params.id)
    db.plans.find({userId: req.params.id}, (err, allPlans) => {
        // console.log("Plans Index allPlans: ", allPlans)
        try {
            if (err) return res.status(404).json({error: err.message})
            return res.status(200).json(allPlans)
        } catch {
            return res.status(200).json(allPlans)
        }
    })
}

const create = (req, res) => {
    console.log("Add plan called");
    // console.log(req.body)
    // console.log("User Session", req.session.currentUser)
    //If body has an id do edit
    if (req.body._id) db.plans.findByIdAndUpdate(req.body._id, {
        $set: req.body,
    }, {
        new: true,
    }, (err, updatedBill) => {
        try {
            if(err) return res.status(404).json({error: err.message})
            return res.status(200).json(updatedBill)
        } catch {
            return res.status(200).json(updatedBill)
        }
    })
    // If body does not have id, add new bill
    db.plans.create(req.body, (err, newBill) => {
        try {
            if(err) return res.status(404).json({error: err.message})
            return res.status(200).json(newBill)
        } catch {
            return res.status(200).json(newBill)
        }
    })
}

const destroy = (req, res) => {
    console.log("Delete requested")
    console.log(req.params.id)
    db.plans.findByIdAndDelete(req.params.id, (err, deletedVideo) => {
        try {
            if (err) return (res.status(400).json({err: err.message}))
            return res.status(200).json({message: deletedVideo})
        } catch {
            return res.status(200).json({message: deletedVideo})
        }
    })
}

module.exports = {
    index,
    create,
    destroy
}