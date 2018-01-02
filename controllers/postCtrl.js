const Post = require('../models/post');

class PostCtrl {

  static getPosts(req, res){
    Post.find()
    .populate('posted_by')
    .populate('comment.user')
    .then((post) => {
      res.status(200).json({
        message: 'Succes get all posts',
        data: post
      })
    })
    .catch(err => { res.status(404).send(err)})
  }

  static postImage(req, res){
    req.body.image = req.file.cloudStoragePublicUrl
    let newPost = new Post({
      image: req.body.image,
      posted_by: req.decoded.userId,
      caption: req.body.caption
    })
    newPost.save().then((post) => {
      res.status(200).json({
        message: 'Post Succesfully Added!',
        data: post
      })
    })
    .catch((err) => { res.status(404).send(err)
    })
  }

  static addComment(req, res){
    let id = {  _id : req.body.id }
    Post.findOneAndUpdate(id, {
        $push: {
          comment: {
            user: req.decoded.userId,
            comment: req.body.comment
          }
        }
      }, {
        new: true,
        safe: true,
        upsert: true
      },
    ).then((comment) => {
      res.status(200).json({
        message: ' Success add comment',
        data : comment
      })
    }).catch((err) => {
      res.send(err)
    })
  }

  static giveLove(req, res){
    let id = {  _id : req.body.id }

    Post.findById(id).then((data) => {
      if (data.love.user._id === req.decoded.userId && data.love.love == 'loved') {
        data.love.love = 'unloved'
        data.save().then((updateLove) => {
          res.status(200).json({updateLove})
        })
      }else {
        
      }

    })

    Post.findOneAndUpdate(id, {
        $push: {
          comment: {
            user: req.decoded.userId,
            comment: req.body.comment
          }
        }
      }, {
        new: true,
        safe: true,
        upsert: true
      },
    ).then((comment) => {
      res.status(200).json({
        message: ' Success add comment',
        data : comment
      })
    }).catch((err) => {
      res.send(err)
    })
  }




}

module.exports = PostCtrl
