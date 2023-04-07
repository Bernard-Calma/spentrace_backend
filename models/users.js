// Import
const mongoose = require("mongoose");
// Passport
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
//  ------------------- END OF IMPORT --------------------

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    level: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User