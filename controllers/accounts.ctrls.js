const db = require('../models')

const index = (req, res) => {
    // Grab session currentUser and use the ID to get all bills registered to user
    // console.log("Bills Route Index called");
    // console.log(req.session.id)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Accounts.find({user: foundUser._id}, (err, foundAccounts) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(foundBills)
                    res.status(200).json(foundAccounts)
                }
            })
        }
    })
}

const create = (req, res) => {
    const newAccount = req.body
    for (const [key, value] of Object.entries(newAccount)) {
        // console.log(`${key}:${value}`)
        if(!value) delete newAccount[key]
        if(key === 'balance') newAccount[key] = Number(value)
    }
    // console.log(typeof(newAccount.balance))
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Accounts.create({...newAccount, user: foundUser._id}, (err, createdAccount) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(createdAccount)
                    res.status(200).json(createdAccount)
                }
            })
        }
    })
    // res.send(newAccount)
}

const edit = (req, res) => {
    // console.log(req.body)
    db.Accounts.findByIdAndUpdate(req.params.id, 
        {
            $set: req.body,
        }, 
        {
            new: true,
        }, 
        (err, editedAccount) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            // console.log("Successfully Edited", editedAccount)
            return res.status(200).json(editedAccount)
        } catch {
            return res.status(200).json(editedAccount)
        }
    })
}

const patch = (req, res) => {
    // console.log(req.body)
    // console.log(req.params.id)
    db.Accounts.findByIdAndUpdate(req.params.id, 
        {
            $set: {balance: req.body.newBalance},
        }, 
        {
            new: true,
        }, 
        (err, editedAccount) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            // console.log("Successfully Edited", editedAccount)
            return res.status(200).json(editedAccount)
        } catch {
            return res.status(200).json(editedAccount)
        }
    })
}

module.exports = {
    create,
    index,
    edit,
    patch
}