const express = require('express')
const router = express.Router()
const user = require('../controllers/usersCtrl')
const authorization = require('../Helpers/authorization')
const imageHelper = require('../Helpers/imageHelper')

router.get('/:id', authorization.authorization, user.getUser)
router.post('/myprofile', authorization.authorization, user.getProfile)
router.put('/update/avatar/:id',
  authorization.authorization,
  authorization.isSelf,
  imageHelper.multer.single('image'),
  imageHelper.sendUploadToGCS,
  user.updatePhoto
)
router.put('/update/profile/:id',
  authorization.authorization,
  authorization.isSelf,
  user.updateProfile
)
router.post('/follow', authorization.authorization, user.follow)

module.exports = router
