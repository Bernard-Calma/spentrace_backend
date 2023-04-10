const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/', ctrls.plans.index)
router.post('/', ctrls.plans.create)
router.put('/:id', ctrls.plans.update)
router.delete('/:id', ctrls.plans.destroy)

module.exports = router;