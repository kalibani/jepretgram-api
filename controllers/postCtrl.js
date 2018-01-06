const Post = require('../models/post');

class PostCtrl {

  static getPosts(req, res){
    Post.find()
    .sort({created_at: -1})
    .populate('posted_by')
    .populate('love.user')
    .populate('comment.user')
    .then((post) => {
      res.status(200).json({
        message: 'Succes get all posts',
        data: post
      })
    })
    .catch(err => { res.status(404).send(err)})
  }

  static getPostById(req, res){

  }

  static postImage(req, res){
    console.log('kenapaa', req.body.image);
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
    let id = { _id : req.body.id }
    let givelove = ''
    Post.findOne(id).then((data) => {
      if (data.posted_by != req.decoded.userId) {
        data.love.map(a =>{
          if (a.user == req.decoded.userId) {
            givelove = 'loved'
            a._id = req.decoded.userId
          }
        })
        if (givelove == 'loved') {
          data.love.pull(req.decoded.userId)
          data.save().then((updateData) => {
            res.status(200).json({message: 'Unloved', data : updateData})
          }).catch(err => res.send(err))
        }else {
          data.love.push({user:req.decoded.userId})
          data.save().then((updateData) => {
            res.status(200).json({message: 'Loved', data : updateData})
          }).catch(err => res.send(err))
        }
      }else {
        res.status(200).json({
          message: 'gabisa love foto sendiri'
        })
      }
    }).catch(err => res.send(err))
  }

}

module.exports = PostCtrl
