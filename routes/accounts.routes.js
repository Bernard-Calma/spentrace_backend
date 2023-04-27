const express = require('express')
const router = express.Router()
const ctrls = require('../controllers')

router.get('/', ctrls.accounts.index)
router.post('/', ctrls.accounts.create)
router.put('/:id', ctrls.accounts.edit)
router.patch('/:id', ctrls.accounts.patch)

module.exports = router