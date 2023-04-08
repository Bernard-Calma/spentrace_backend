const db = require("../models");
const bcrypt = require("bcrypt"); // To hash password

// ROUTES
// LOGIN
const loginUser = async (req, res) => {
    try {
      const userFound = await db.Users.findOne({username: req.body.username.toLowerCase()})
      if (!userFound) {
        return res.status(404).json({message: "Username is not registered"})
      }
      const isMatch = await bcrypt.compare(req.body.password, userFound.password)
      if (!isMatch) {
        return res.status(401).json({message: "Invalid Username or Password"})
      }
      userFound.password = undefined
      req.session.currentUser = userFound
      console.log("Added user in session: ", req.session)
      return res.status(200).json({
        user: userFound,
        session: req.session
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({message: "Internal Server Error"})
    }
  }

// REGISTER
const register = (req,res) => {
    console.log("Register route")
    const newUser = req.body;
    // Check username format
    const regex = /[a-zA-Z0-9]$/
    if(!regex.exec(req.body.username)) {
        return res.status(400).send({message: 'Username can only consist of letters and numbers'})
    } else {
    // Check if email or username is already used been used
        db.Users.find({$or:[
                {email: newUser.email}, 
                {username: newUser.username}
            ]}, (err, foundUser) => {
            if(foundUser.length > 0) {
                // console.log(foundUser.length)
                console.log("Username or Email is already being used")
                return res.status(400).json({message: "Username or Email is already been used."})
            } else {
                // Proceed with registration
                // Password Validation
                if(newUser.password.length < 6) res.status(400).json({message: "Password should be at least 6 characters"})
                if(newUser.password !== newUser.verifyPassword) res.status(400).json({message: "Password does not match"})
                else {
                    // Hash password
                    newUser.password = bcrypt.hashSync(newUser.password, 10);
                    delete newUser.verifyPassword
                    // Lower case email and username
                    newUser.email = newUser.email.toLowerCase()
                    newUser.username = newUser.username.toLowerCase()
                    db.Users.create(newUser, (error, createdUser) => {
                        if (error) {
                            console.log("Error creating new user")
                            return res.status(404).json({messsage: "Unexpected error occured"})
                        } else {
                            createdUser.password = undefined
                            req.session.currentUser = createdUser
                            return res.status(200).json(createdUser)
                        }
                    })
                }

            }
        })
    }

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