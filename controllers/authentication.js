const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Authentication {

  static register(req, res){
    var newUser = new User(req.body)
    var salt = bcrypt.genSaltSync(8)
    newUser.password = bcrypt.hashSync(req.body.password, salt)
    newUser.save().then((dataUser) => {
      res.status(200).json({ message: 'Register Success!', dataUser })
    })
    .catch((err) => {
      res.status(404).send(err)
    })
  }

  static login(req, res){
    User.findOne({$or: [
      {email: req.body.email},
      {username: req.body.username}
    ]})
    .then((dataUser)=>{
      if(!dataUser){
        res.send('Unregistered Email, Please Register First!')
      } else if (dataUser.comparePassword(req.body.password)) {
        let token = jwt.sign({ dataUser }, process.env.SECRET)
        res.json({
          message:"Login Succes!",
          token: token
        })
      }else if (!dataUser.comparePassword(req.body.password)) {
        res.send('Authentication failed, Wrong Password!')
      }
    })
    .catch(err=>{
      res.send(err)
    })
  }

}

module.exports = Authentication;
