const db = require("../models")

// ROUTES
const index = (req, res) => {
    // Grab session currentUser and use the ID to get all bills registered to user
    // console.log("Bills Route Index called");
    // console.log(req.session.id)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Bills.find({user: foundUser._id}, (err, foundBills) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(foundPlans)
                    res.status(200).json(foundBills)
                }
            })
        }
    })
}

const create = (req, res) => {
    // console.log("Add bill called");
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Bills.create({...req.body, user: foundUser._id}, (err, createdBill) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(createdBill)
                    res.status(200).json(createdBill)
                }
            })
        }
    })
}

const destroy = (req, res) => {
    // console.log("Delete Route Called")
    db.Bills.findByIdAndDelete(req.params.id, (err, deletedBIll) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            console.log("Successfully Deleted", deletedBIll._id)
            return res.status(200).json(deletedBIll)
        } catch {
            return res.status(200).json(deletedBIll)
        }
    })
}

const edit = (req, res) => {
    // console.log("Edit Bill Called: ")
    db.Bills.findByIdAndUpdate(req.params.id, 
        {
            $set: req.body,
        }, 
        {
            new: true,
        }, 
        (err, editedBill) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            console.log("Successfully Edited", editedBill)
            return res.status(200).json(editedBill)
        } catch {
            return res.status(200).json(editedBill)
        }
    })
}

module.exports = {
    index,
    create,
    destroy,
    edit
}