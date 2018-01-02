const express = require('express')
const router = express.Router()
const post = require('../controllers/postCtrl')
const authorization = require('../Helpers/authorization')
const imageHelper = require('../Helpers/imageHelper')

router.get('/home', authorization.authorization, post.getPosts)
router.post('/post',
  authorization.authorization,
  imageHelper.multer.single('image'),
  imageHelper.sendUploadToGCS,
  post.postImage
)
router.post('/comment', authorization.authorization, post.addComment)
router.post('/givelove', authorization.authorization, post.giveLove)
module.exports = router
