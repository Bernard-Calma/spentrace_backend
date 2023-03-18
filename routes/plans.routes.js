const express = require("express")
const router = express.Router();
const ctrls = require("../controllers")

const authRequired = (req, res, next) => {
	// if(req.session.currentUser){
	// 	// a user is signed in
		next()
	// 	// next is part of express
	// 	// it does what it says
	// 	// i.e, go on to the next thing
	// } else {
	// 	// if there is no user
	// 	res.send('You must be logged in to do that!')
	// 	// res.redirect('/user/signin')
	// }
}

router.post('/', authRequired, ctrls.plans.create)
router.post('/:id', ctrls.plans.update)
router.get('/:id', authRequired, ctrls.plans.index)
router.delete('/:id', authRequired, ctrls.plans.destroy)



module.exports = router;