const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtenir le jeton depuis l'en-tête
      token = req.headers.authorization.split(' ')[1]

      // Vérifier le jeton
      const decoded = 

      // Obtenir l'utilisateur à partir du jeton
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Non autorisé')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Non autorisé, aucun jeton')
  }
})

module.exports = { protect }
