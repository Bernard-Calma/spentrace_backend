const db = require("../models");
const passport = require('passport')

// ROUTES
// LOGIN
const loginUser = (req, res) => {
    const user = new db.Users({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, err => {
        if (err) {
            console.log(err)
            res.status(400).json(err)
        }else {
            // console.log("New user created: ", user)
            passport.authenticate("local")(req, res, () => {
                console.log(req.session.passport)
                res.status(200).json(req.session.passport)
            })
        }
    })
}

// REGISTER
const register = (req,res) => {
    const newUser = {...req.body};
    delete newUser.password
    delete newUser.verifyPassword
    console.log("NewUser: ", newUser)
    console.log("req.body: ", req.body)
    db.Users.register(newUser, req.body.password, (err, registeredUser) => {
        if (err) {
            console.log(err)
            res.status(400).json(err)
        } else {
            console.log("New user created: ", registeredUser)
            passport.authenticate("local")(req, res, () => {
                res.status(200).json(registeredUser)
            })
        }
    })
}

// SIGNOUT
const signout = (req,res) => {
    // Destroy current session
    req.session.destroy( (err) => {
        if(err) {
            res.status(400).send({message: "Error logging out."})
        } else {
            res.status(200).send({message: "Sucessfully logged out."})
        }
    })

    // console.log('User Signout: ', req.session.currentUser)
    // req.session.destroy()
    // return res.status(200).json({message: "Logout Successful"})
}

module.exports = {
    loginUser,
    register,
    signout
}