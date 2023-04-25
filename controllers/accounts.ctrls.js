const db = require('../models')

const create = (req, res) => {
    const newAccount = req.body
    for (const [key, value] of Object.entries(newAccount)) {
        // console.log(`${key}:${value}`)
        if(!value) delete newAccount[key]
        if(key === 'balance') newAccount[key] = Number(value)
    }
    console.log(typeof(newAccount.balance))
    res.send(newAccount)
}

module.exports = {
    create,
}