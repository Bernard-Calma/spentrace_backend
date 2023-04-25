const express = require('express')
const router = express.Router()
const ctrls = require('../controllers')

router.get('/', ctrls.accounts.index)
router.post('/', ctrls.accounts.create)

module.exports = router