const db = require("../models");
const passport = require('passport')

// ROUTES
// LOGIN
const loginUser = (req, res) => {
    console.log("Login")
    console.log(req.body)
    db.Users.findOne({username: req.body.username}, (err, foundUser) => {
        if(err) {
            console.log(err);
            return res.status(400).json(err)
        } else if (!foundUser) {
            return res.status(400).json({message: "Username not found"})
        } else {
            const user = new db.Users({
                username: req.body.username,
                password: req.body.password
            })
            req.login(user, err => {
                if (err) {
                    console.log("Error: ", err)
                    res.status(400).json(err)
                }else {
                    // console.log("Login: ", user)
                    passport.authenticate("local", (err, user, info) => {
                        // console.log("Err: ", err)
                        // console.log("User: ", user)
                        // console.log("Info: ", info)
                        // console.log(req.session)
                        if (err) return next(err)
                        else if (!user) {
                           return res.status(401).json(info)
                        } else {
                           return res.status(200).json(req.session.passport)
                        }
                    })(req, res, () => {
                        console.log(req.session.passport)
                        res.status(200).json(req.session.passport)
                    })
                }
            })
        }

    })
}

// REGISTER
const register = (req,res) => {
    const newUser = {...req.body};
    delete newUser.password
    delete newUser.verifyPassword
    // console.log("NewUser: ", newUser)
    // console.log("req.body: ", req.body)
    db.Users.register(newUser, req.body.password, (err, registeredUser) => {
        if (err) {
            console.log("Register Error: ", err)
            res.status(400).json({message: err})
        } else {
            // console.log("New user created: ", registeredUser)
            passport.authenticate("local")(req, res, () => {
                res.status(200).json(registeredUser)
            })
        }
    })
}

// SIGNOUT
const signout = (req,res) => {
    // console.log("Signout")
    // Destroy current session
    req.session.destroy( (err) => {
        if(err) {
            res.status(400).send({message: "Error logging out."})
        } else {
            res.status(200).send({message: "Sucessfully logged out."})
        }
    })

    // console.log('User Signout: ', req.session)no
    // req.session.destroy()
    // return res.status(200).json({message: "Logout Successful"})
}

module.exports = {
    loginUser,
    register,
    signout
}