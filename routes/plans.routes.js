const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/:id', ctrls.plans.index)

module.exports = router;