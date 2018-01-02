const express = require('express')
const router = express.Router()
const user = require('../controllers/usersCtrl')
const authorization = require('../Helpers/authorization')
const imageHelper = require('../Helpers/imageHelper')

router.get('/:id', authorization.authorization, user.getUser)
router.put('/update/:id',
  authorization.authorization,
  authorization.isSelf,
  imageHelper.multer.single('image'),
  imageHelper.sendUploadToGCS,
  user.updateProfile
)
router.post('/follow', authorization.authorization, user.follow)

module.exports = router
