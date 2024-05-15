const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc    Obtenir les objectifs
// @route   GET /api/goals
// @access  Privé
const obtenirObjectifs = asyncHandler(async (req, res) => {
  const objectifs = await Goal.find({ user: req.user.id })

  res.status(200).json(objectifs)
})

// @desc    Définir un objectif
// @route   POST /api/goals
// @access  Privé
const définirObjectif = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Veuillez ajouter un champ texte')
  }

  const objectif = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(objectif)
})

// @desc    Mettre à jour l'objectif
// @route   PUT /api/goals/:id
// @access  Privé
const mettreÀJourObjectif = asyncHandler(async (req, res) => {
  const objectif = await Goal.findById(req.params.id)

  if (!objectif) {
    res.status(400)
    throw new Error('Objectif non trouvé')
  }

  // Vérifier l'utilisateur
  if (!req.user) {
    res.status(401)
    throw new Error('Utilisateur non trouvé')
  }

  // S'assurer que l'utilisateur connecté correspond à l'utilisateur de l'objectif
  if (objectif.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Utilisateur non autorisé')
  }

  const objectifMisÀJour = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(objectifMisÀJour)
})

// @desc    Supprimer l'objectif
// @route   DELETE /api/goals/:id
// @access  Privé
const supprimerObjectif = asyncHandler(async (req, res) => {
  const objectif = await Goal.findById(req.params.id)

  if (!objectif) {
    res.status(400)
    throw new Error('Objectif non trouvé')
  }

  // Vérifier l'utilisateur
  if (!req.user) {
    res.status(401)
    throw new Error('Utilisateur non trouvé')
  }

  // S'assurer que l'utilisateur connecté correspond à l'utilisateur de l'objectif
  if (objectif.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Utilisateur non autorisé')
  }

  await objectif.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  obtenirObjectifs,
  définirObjectif,
  mettreÀJourObjectif,
  supprimerObjectif,
}
