const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
class Authentication {

  static register(req, res){
    var newUser = new User(req.body)
    bcrypt.hash(req.body.password, 10).then((hash) => {
      newUser.password = hash
      newUser.save().then((dataUser) => {
        res.status(200).json({ message: 'Register Success!', dataUser })
      })
      .catch((err) => {
        res.status(404).send(err)
      })
    }).catch(err => res.send(err))

  }

  static login(req, res){
    User.findOne({$or: [
      {email: req.body.email},
      {username: req.body.username}
    ]})
    .then((dataUser)=>{
      console.log(dataUser);
      if(!dataUser){
        res.send('Unregistered Email/Username, Please Register First!')
      }else {
        dataUser.comparePassword(req.body.password, (err, success) => {
          if (err || !success) {
            return res.status(200).json({
              message: 'Authentication failed, Email/Username or password did not match'
            })
          }else {
            let payload = {
              userId: dataUser._id,
              email: dataUser.email,
              username: dataUser.username
            }
            let token = jwt.sign(payload, process.env.SECRET)
            res.status(200).json({
              message:"Login Succes!",
              token: token
            })
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

}

module.exports = Authentication
