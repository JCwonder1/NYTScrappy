var express = require('express');
const UserModel = require('../db/models/Users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res) => res.sender('/user/register', {success: req.query.success}))

// router.post('/register', async function (req, res, next){
//   try{
//     const user = new UserModel({
//       username = req.body.username,
//       password = req.body.password,
//     });
//     const saveUser = await user.save();
//     if(saveUser) return res.redirect('/user/register?success=true');
//     return next(new Error('Failed to save user!'));
//   }catch(err){  
//     return next(err);
//   }
// });

module.exports = router;
