const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/users
// @access  Public
const enregistrerUtilisateur = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Veuillez remplir tous les champs')
  }

  // Vérifier si l'utilisateur existe
  const utilisateurExiste = await User.findOne({ email })

  if (utilisateurExiste) {
    res.status(400)
    throw new Error("L'utilisateur existe déjà")
  }

  // Hachage du mot de passe
  const sel = await bcrypt.genSalt(10)
  const motDePasseHaché = await bcrypt.hash(password, sel)

  // Créer l'utilisateur
  const utilisateur = await User.create({
    name,
    email,
    password: motDePasseHaché,
  })

  if (utilisateur) {
    res.status(201).json({
      _id: utilisateur.id,
      name: utilisateur.name,
      email: utilisateur.email,
      token: générerJeton(utilisateur._id),
    })
  } else {
    res.status(400)
    throw new Error('Données utilisateur invalides')
  }
})

// @desc    Authentifier un utilisateur
// @route   POST /api/users/login
// @access  Public
const authentifierUtilisateur = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Vérifier l'email de l'utilisateur
  const utilisateur = await User.findOne({ email })

  if (utilisateur && (await bcrypt.compare(password, utilisateur.password))) {
    res.json({
      _id: utilisateur.id,
      name: utilisateur.name,
      email: utilisateur.email,
      token: générerJeton(utilisateur._id),
    })
  } else {
    res.status(400)
    throw new Error('Identifiants invalides')
  }
})

// @desc    Obtenir les données de l'utilisateur
// @route   GET /api/users/me
// @access  Privé
const obtenirMoi = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Générer un jeton JWT
const générerJeton = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  enregistrerUtilisateur,
  authentifierUtilisateur,
  obtenirMoi,
}
