const User = require('../models/users');

class UserCtrl {

  static getUser(req, res) {
    User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json({
          message: 'User get success',
          data: user
        })
      } else {
        res.status(404).json({
          message: 'User not found'
        })
      }
    })
    .catch(err => res.send(err))
  }


  static updateProfile(req, res) {
    let id = {  _id : req.params.id }
    if(req.file){
      req.body.image = req.file.cloudStoragePublicUrl
    }
    if (req.body.password!=='') {
      User.findById(id).then((user) => {
        return Object.assign(user, req.body)
      }).then((user) => {
        return user.save()
      }).then(updatedUser => {
        res.status(200).json({
          message: 'User successfully updated',
          data: updatedUser
        })
      }).catch(err => res.send(err))
    }else {
      let update = {
        email: req.body.email,
        username: req.body.username,
        fullname: req.body.fullname,
        image: req.body.image
      }
      User.findByIdAndUpdate(id, update,{
        new: true // return new updated document
      })
      .then(user => {
        res.status(200).json({
          message: 'User successfully updated without update password',
          data: user
        })
      })
      .catch(err => res.send(err))
    }
  }

}

module.exports = UserCtrl;
