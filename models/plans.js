const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    name: String,
    expense: {
        type: Boolean,
        required: true,
    },
    notes: String,
    userId: {
        type: String,
        required: true
    }
})

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan