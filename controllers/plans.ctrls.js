const db = require("../models")

// ROUTES
// INDEX
// Get all plans data
const index = (req, res) => {
    // Grab session currentUser and use the ID to get all plans registered to user
    // console.log("Plans Route Index called");
    // console.log(req.session.id)
    // console.log(req.session.passport.user)
    // console.log(process.env.NODE_ENV)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Plans.find({user: foundUser._id}, (err, foundPlans) => {
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
    // console.log("Add plan called");
    // console.log(req.body)
    // console.log(req.session.passport.user)
    // console.log(req.session.id)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Plans.create({...req.body, user: foundUser._id}, (err, createdPlan) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(createdPlan)
                    res.status(200).json(createdPlan)
                }
            })
        }
    })
}

const destroy = (req, res) => { 
    // console.log("Delete requested")
    db.Plans.findByIdAndDelete(req.params.id, (err, deletedVideo) => {
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
    // console.log("Edit Route Called", req.params.id)
    db.Plans.findByIdAndUpdate(req.params.id, {
        $set: req.body,
    }, {
        new: true,
    }, (err, updatedBill) => {
        try {
            if(err) return res.status(404).json({error: err.message})
            // console.log("Successfully Edited", updatedBill._id)
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