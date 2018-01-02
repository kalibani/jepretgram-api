const mongoose = require('mongoose')
const Schema = mongoose.Schema

let postSchema = new Schema({
  image: { type: String, required: true },
  posted_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String },
  love: [{
    user: { type: Schema.Types.ObjectId, ref: 'User'}
  }],
  comment: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String }
  }],
  follow: [{
    user: { type: Schema.Types.ObjectId, ref: 'User'}
  }],
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', postSchema)
