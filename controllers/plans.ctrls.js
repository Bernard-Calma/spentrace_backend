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
                    // console.log(createdPlan)
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
            console.log("No ID")
            return res.status(200).json(deletedVideo)
        }
    })
}

const destroyNoID = async (req,res) => {
    const {
        name,
        amount,
        date,
        expense
    } = req.body;

    try {
        const result = await db.Plans.findOneAndDelete({
            name: name,
            amount: amount,
            date: date,
            expense: expense
        })
        // console.log("Res: ", result);
        // return res.status(200).json({data: result});
    } catch (error) {
        console.log("Err: ", error)
    }
    
}

// Updated function for updating plans
// Add if statement for accepting plans without any _id from frontend
// Remove {new: true} since nothing is being returned.
const update = async (req, res) => {
    // console.log("Edit Route Called", req.params.id)
    if(req.params.id !== "-1") {
        // console.log(req.body)
        
    delete req.body.newData._id
        try {
            await db.Plans.findOneAndUpdate(req.params.id, {$set: req.body.newData})
        } catch (err) {
            console.log("Error: ", err)
        }
    } else {
        const {
            name,
            amount,
            date,
            expense
        } = req.body.originalPlan;

        try {
            await db.Plans.findOneAndUpdate({
                name: name,
                amount: amount,
                date: date,
                expense: expense
            },{ $set: req.body.newData })
            console.log("Update success on no ID params.")
        } catch (err) {
            console.log("Error: ", err)
        }
    }
}

module.exports = {
    index,
    create,
    destroy,
    destroyNoID,
    update,
}