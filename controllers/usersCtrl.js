const User = require('../models/users');
const bcrypt = require('bcrypt')

class UserCtrl {
  static getUser(req, res) {
    User.findById(req.params.id)
    .populate('follow.user')
    .then(user => {
      if (user) {
        res.status(200).json({
          message: 'get User success',
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

  static updatePhoto(req, res){
    let id = {  _id : req.params.id }
    if(req.file){
      req.body.image = req.file.cloudStoragePublicUrl
    }
    let update = {
      image : req.body.image
    }
    User.findByIdAndUpdate(id, update,{
      new: true, // return new updated document
    })
    .then(user => {
      res.status(200).json({
        message: 'Update Photo Profile Succes!',
        data: user
      })
    })
    .catch(err => res.send(err))
  }

  static updateProfile(req, res) {
    let id = {  _id : req.params.id }
    if (req.body.password!=='') {
      var salt = bcrypt.genSaltSync(8)
      req.body.password = bcrypt.hashSync(req.body.password, salt)
      let update = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        image: req.body.image
      }
      User.findByIdAndUpdate(id, update,{
        new: true, // return new updated document
        runValidators: true, context: 'query'
      })
      .then(user => {
        res.status(200).json({
          message: 'Update Profile Succes!',
          data: user
        })
      })
      .catch(err => res.send(err))
    }else {
      let update = {
        email: req.body.email,
        username: req.body.username,
        fullname: req.body.fullname,
        runValidators: true, context: 'query'
      }
      User.findByIdAndUpdate(id, update,{
        new: true, // return new updated document
        runValidators: true, context: 'query'
      })
      .then(user => {
        res.status(200).json({
          message: 'Update Profile Succes!',
          data: user
        })
      })
      .catch(err => res.send(err))
    }
  }

  static follow(req, res){
    let id = { _id : req.body.id }
    let follow = ''
    User.findOne(id).then((data) => {
      if (data._id != req.decoded.userId) {
        data.follow.map(a =>{
          if (a.user == req.decoded.userId) {
            follow = 'followed'
            a._id = req.decoded.userId
          }
        })
        if (follow == 'followed') {
          data.follow.pull(req.decoded.userId)
          data.save().then((updateData) => {
            res.status(200).json({message: 'unfollow', data : updateData})
          }).catch(err => res.send(err))
        }else {
          data.follow.push({user:req.decoded.userId})
          data.save().then((updateData) => {
            res.status(200).json({message: 'following!', data : updateData})
          }).catch(err => res.send(err))
        }
      }else {
        res.status(200).json({message:'gabisa follow sendiri'})
      }
    }).catch(err => res.send(err))
  }

  static getProfile(req, res){
    console.log('ini');
    res.json(req.decoded)
  }


}

module.exports = UserCtrl;
