const db = require("../models");
const bcrypt = require("bcrypt"); // To hash password
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
const loginUser = (req, res) => {
    console.log("Username tried to login: ", req.body.username)
    db.Users.findOne({username: req.body.username.toLowerCase()}, (err, userFound) => {
        if (!userFound) return res.status(404).json({message: "Username is not registered"})
        else if (!bcrypt.compareSync(req.body.password, userFound.password)) return(res.status(401).json({message: "Invalid Username or Password"}))
        else {
            userFound.password = undefined // Remove password when sending back user data
            req.session.currentUser = userFound; // Add user to session
            // console.log("Login Session:", req.session)
            return (res.status(200).json(userFound))
        }
    })
}

// REGISTER
const register = (req,res) => {
    console.log("Register route")
    const newUser = req.body;
    // Check username format
    const regex = /[a-zA-Z0-9]$/
    if(!regex.exec(req.body.username)) {
        res.status(400).send({message: 'Username can only consist of letters and numbers'})
    } else {
    // Check if email or username is already used been used
        db.Users.find({$or:[
                {email: newUser.email}, 
                {username: newUser.username}
            ]}, (err, foundUser) => {
            if(foundUser.length > 0) {
                console.log(foundUser)
                console.log("Username or Email is already being used")
                res.status(400).json({message: "Username or Email is already been used."})
            } else {
                // Proceed with registration
                // Password Validation
                // if(newUser.password.length < 6) res.status(400).json({message: "Password should be at least 6 characters"})
                if(newUser.password !== newUser.verifyPassword) res.status(400).json({message: "Password does not match"})
                else {
                    // Hash password
                    newUser.password = bcrypt.hashSync(newUser.password, 10);
                    delete newUser.verifyPassword
                    db.Users.create(newUser, (err, createdUser) => {
                        if (err) {
                            console.log("Error creating new user")
                            res.status(404).json({messsage: "Unexpected error occured"})
                        } else {
                            delete createdUser.password
                            req.session.currentUser = createdUser
                            res.status(200).json(createdUser)
                        }
                    })
                }

            }
        })
    }

}

// SIGNOUT
const signout = (req,res) => {
    req.logout()
    // console.log('User Signout: ', req.session.currentUser)
    // req.session.destroy()
    // return res.status(200).json({message: "Logout Successful"})
}

module.exports = {
    index,
    loginUser,
    register,
    signout
}