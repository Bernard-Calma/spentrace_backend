const db = require("../models");
const bcrypt = require("bcrypt"); // To hash password
// ROUTES
// INDEX
// Get all users data
const index = (req, res) => {
    console.log("All users info retreived")
    console.log(req.session)
    db.users.find({}, (err, allUsers) => {
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
    console.log("Username tried to login: ", req.body.username)
    db.users.findOne({username: req.body.username.toLowerCase()}, (err, userFound) => {
        // console.log("Login User Found: ", userFound)
        if (err) return(res.status(400).json({error: err.message}))
        if (!userFound) return(res.status(404).json({error: "User not found"}))
        if (!bcrypt.compareSync(req.body.password, userFound.password)) return(res.status(401).json({message: "Invalid Username or Password"}))
        userFound.password = undefined // Remove password when sending back user data
        req.session.currentUser = userFound; // Add user to session
        // console.log("Login Session:", req.session)
        return (res.status(200).json(userFound))
    })
}

// REGISTER
const register = (req,res) => {
    return res.status(400).json({Error: "Registration is closed for now."})
    const salt = bcrypt.genSaltSync(10);
    req.body.username = req.body.username.toLowerCase();
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    db.users.create(req.body, (err, createdUser) => {
        try{
            if (err) return res.status(400).json({error: err.message})
            return res.status(200).json(createdUser);
        } catch {
            return res.status(200).json(createdUser)
        }
    })
}

// SIGNOUT
const signout = (req,res) => {
    console.log('User Signout: ', req.session.currentUser)
    req.session.destroy()
    return res.status(200).json({message: "Logout Successfull"})
}

module.exports = {
    index,
    login,
    register,
    signout
}