const db = require("../models");
const bcrypt = require("bcrypt"); // To hash password
const passport = require("passport");
const User = require("../models/users");
// ROUTES
// INDEX
// Get all users data
const index = (req, res) => {
    console.log("All users info retreived")
    console.log(req.session)
    db.Users.find({}, (err, allUsers) => {
        try {
            if (err) return res.status(404).json({error: err.message})
            return res.status(200).json(allUsers);
        } catch {
            return res.status(200).json(allUsers);
        }
    })
}

// LOGIN
const login = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, (err) => {
        if(err) {
            res.status(400).send(err)
        } else {
            passport.authenticate('local')(req, res, () => {
                const authUser = req.user;
                // Remove salt and hash when sending back user info
                authUser.salt = undefined,
                authUser.hash = undefined
                console.log(authUser)
                res.status(200).send(authUser)
            })
        }
    })
    // console.log("Username tried to login: ", req.body.username)
    // db.Users.findOne({username: req.body.username.toLowerCase()}, (err, userFound) => {
    //     if (!userFound) return res.status(404).json({message: "Username is not registered"})
    //     else if (!bcrypt.compareSync(req.body.password, userFound.password)) return(res.status(401).json({message: "Invalid Username or Password"}))
    //     else {
    //         userFound.password = undefined // Remove password when sending back user data
    //         req.session.currentUser = userFound; // Add user to session
    //         // console.log("Login Session:", req.session)
    //         return (res.status(200).json(userFound))
    //     }
    // })
}

// REGISTER
const register = (req,res) => {
    console.log("Register route")
    console.log(req.body)
    db.Users.register({
        username: req.body.username,
        email: req.body.email
        },
        req.body.password,
        (err, registeredUser) => {
            if (err) {
                console.log(err)
                res.status(404).json(err)
            } else {
                passport.authenticate('local')(req, res, () => {
                    registeredUser.hash = undefined;
                    registeredUser.salt = undefined;
                    res.status(201).json(registeredUser);
                })
            }
        }
    )
}

// SIGNOUT
const signout = (req,res) => {
    console.log('User Signout: ', req.session.currentUser)
    req.session.destroy()
    return res.status(200).json({message: "Logout Successful"})
}

module.exports = {
    index,
    login,
    register,
    signout
}