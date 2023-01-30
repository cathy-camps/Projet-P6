const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//routes post pour que le frontend envoie les informations (email et mot de passe)
router.post('/api/auth/signup', userCtrl.signup);
router.post('/api/auth/login', userCtrl.login);

//export du routeur pour pouvoir l'importer dans app.js
module.exports = router;