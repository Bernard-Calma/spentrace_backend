const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/', ctrls.users.index)
router.post('/login', ctrls.users.login)
router.post('/register', ctrls.users.register)

module.exports = router;