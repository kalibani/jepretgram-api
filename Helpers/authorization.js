const jwt = require('jsonwebtoken')

class Authorization {
  static authorization(req, res, next){
    const token = req.headers['authorization'];
    if (!token) {
      return res.json({success: false, message: 'Token required'})
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.json({success: false, message: 'Problem With Token'})
      } else {
        req.decoded = decoded
        req.userId = decoded.userId
        next()
      }
    })
  }

  static isSelf(req, res, next){
    if (req.decoded.userId === req.params.id) {
      next()
    }else {
      res.json({message:'User not allowed'})
    }
  }

}

module.exports = Authorization
