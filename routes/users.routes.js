const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/', crtls.users.index)

module.exports = router;