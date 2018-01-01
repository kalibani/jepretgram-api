const User = require('../models/users');
const bcrypt = require('bcrypt');

class UserCtrl {
  static getUsers(req, res) {
    User.find()
    .then(users =>
      res.status(200).json({
        message: 'Users get success',
        data: users
      })
    )
    .catch(err => res.send(err))
  }

  static getEvent(req, res, next) {
    User.findById(req.params.id)
    .then(event => {
      if (event) {
        res.status(200).json({
          message: 'User get success',
          data: event
        })
      } else {
        res.status(404).json({
          message: 'User not found'
        })
      }
    })
    .catch(err => next(boom.boomify(err)))
  }

  static createEvent(req, res, next) {
    req.body.logo = req.file.cloudStoragePublicUrl
    let newEvent = new User(req.body)
    newEvent.save()
    .then(users => {
      res.status(200).json({
        message: 'User successfully created',
        data: users
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  static updateEvent(req, res, next) {
    if(req.file){
      req.body.logo = req.file.cloudStoragePublicUrl
    }
    User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        startdate: req.body.startdate,
        logo: req.body.logo,
        description: req.body.description
      },
      { new: true } // return new updated document
    )
    .then(event => {
      if (event) {
        res.status(200).json({
          message: 'User successfully updated',
          data: event
        })
      } else {
        res.status(404).json({
          message: 'User not found'
        })
      }
    })
    .catch(err => next(boom.boomify(err)))
  }

  static deleteEvent(req, res, next) {
    User.findByIdAndRemove(req.params.id)
    .then(event => {
      if (event) {
        res.status(200).json({
          message: 'User successfully deleted',
          data: event
        })
      } else {
        res.status(404).json({
          message: 'User not found'
        })
      }
    })
    .catch(err => next(boom.boomify(err)))
  }

}

module.exports = UserCtrl;
