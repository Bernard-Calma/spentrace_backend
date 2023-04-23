const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

router.get('/', ctrls.bills.index)
router.post('/', ctrls.bills.create)
router.delete('/:id', ctrls.bills.destroy)
router.put('/:id', ctrls.bills.edit)
router.patch('/:id',ctrls.bills.patch)

module.exports = router;