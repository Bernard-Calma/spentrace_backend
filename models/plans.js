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
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan