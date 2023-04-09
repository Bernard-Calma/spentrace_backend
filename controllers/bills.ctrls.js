const db = require("../models")

// ROUTES
const index = (req, res) => {
    // Grab session currentUser and use the ID to get all bills registered to user
    // console.log("Plans Route Index called");
    const loggedInUser = req.session.currentUser
    db.bills.find({userId: loggedInUser._id}, (err, allBills) => {
        try {
            if (err) return res.status(404).json({error: err.message})
            return res.status(200).json(allBills)
        } catch {
            return res.status(200).json(allBills)
        }
    }).sort({date: "asc"})
}

const create = (req, res) => {
    console.log("Add bill called");
    db.bills.create(req.body, (err, newBill) => {
        try {
            if(err) return res.status(404).json({error: err.message})
            console.log("Successfully Added", newBill._id)
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
            console.log("Successfully Deleted", deletedBIll._id)
            return res.status(200).json({message: deletedBIll})
        } catch {
            return res.status(200).json({message: deletedBIll})
        }
    })
}

const edit = (req, res) => {
    console.log("Edit Bill Called: ")
    db.bills.findByIdAndUpdate(req.params.id, req.body, (err, editedBill) => {
        try {
            if (err) return (res.status(400).json({err: err.message}))
            console.log("Successfully Edited", editedBill._id)
            return res.status(200).json({message: editedBill})
        } catch {
            return res.status(200).json({message: editedBill})
        }
    })
}

module.exports = {
    index,
    create,
    destroy,
    edit
}