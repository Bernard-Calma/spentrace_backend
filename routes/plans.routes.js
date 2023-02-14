const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/', crtls.plans.index)

module.exports = router;