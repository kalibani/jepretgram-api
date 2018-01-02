const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

let userSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  fullname:{
    type: String,
    required: true
  },
  image:{
    type: String
  },
  follow: [{
    user: { type: Schema.Types.ObjectId, ref: 'User'}
  }]
})

userSchema.plugin(idvalidator)
userSchema.plugin(uniqueValidator)

userSchema.methods.comparePassword = function (plainPassword, callback) {
  console.log('compare--->', plainPassword, this.password)
  bcrypt.compare(plainPassword, this.password)
  .then(result => {
    callback(null, result)
  })
  .catch(err => {
    console.log(err)
    callback(err)
  })
}

module.exports = mongoose.model('User', userSchema)
