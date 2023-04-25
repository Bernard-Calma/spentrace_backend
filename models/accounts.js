const mongoose = require('mongoose')

const accountsSchema = mongoose.Schema({
    accType: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    accNumber: String,
    accOpen: Date,
    balance: Number,
    creditLimit: Number,
    availableCredit: Number,
    dueDate: Date,
    minPayment: Number,
    interest: Number,
    loanAmount: Number,
}, {
    timestaps: true
})
const Accounts = mongoose.model("Account", accountsSchema)

module.exports = Accounts