const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/', ctrls.users.index)
router.post('/login/', ctrls.users.loginUser)
router.post('/register', ctrls.users.register)
router.get('/signout', ctrls.users.signout)

module.exports = router;