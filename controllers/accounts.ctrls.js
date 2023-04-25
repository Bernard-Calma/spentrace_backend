const db = require('../models')

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
                    console.log(createdAccount)
                    res.status(200).json(createdAccount)
                }
            })
        }
    })
    // res.send(newAccount)
}

module.exports = {
    create,
}