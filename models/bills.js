const mongoose = require("mongoose");

const billsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: [],
        required: true
    },
    category: String,
    autoPay: {
        type: Boolean,
        default: false
    },
    paid: {
        type: [Boolean],
        default: false
    },
    repeat: {
        type: String,
        default: "never"
    },
    endRepeat: {
        type: Date,
    },
    notes: String,
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Bills = mongoose.model("Bill", billsSchema);
module.exports = Bills