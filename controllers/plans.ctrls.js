const db = require("../models")

// ROUTES
// INDEX
// Get all plans data
const index = (req, res) => {
    // Grab session currentUser and use the ID to get all plans registered to user
    console.log("Plans Route Index called");
    // console.log(req.session)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Plans.find({userID: foundUser._id}, (err, foundPlans) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(foundPlans)
                    res.status(200).json(foundPlans)
                }
            })
        }
    })
}

const create = (req, res) => {
    console.log("Add plan called");
    db.plans.create(req.body, (err, newBill) => {
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
    console.log("Delete requested")
    db.plans.findByIdAndDelete(req.params.id, (err, deletedVideo) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            console.log("Successfully Deleted", deletedVideo._id)
            return res.status(200).json(deletedVideo)
        } catch {
            return res.status(200).json(deletedVideo)
        }
    })
}

const update = (req, res) => {
    console.log("Edit Route Called", req.params.id)
    db.plans.findByIdAndUpdate(req.params.id, {
        $set: req.body,
    }, {
        new: true,
    }, (err, updatedBill) => {
        try {
            if(err) return res.status(404).json({error: err.message})
            console.log("Successfully Edited", updatedBill._id)
            return res.status(200).json(updatedBill)
        } catch {
            return res.status(200).json(updatedBill)
        }
    })
}

module.exports = {
    index,
    create,
    destroy,
    update,
}