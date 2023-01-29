const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

//implémenter la route get pour récupérer la liste complète des utilisateurs enregistrés dans la base de données
router.get('/', auth, sauceCtrl.getAllSauces);
//implémenter la route post pour créer un nouvel utilisateur 
router.post('/', auth, multer, sauceCtrl.createSauce);
//récupération d'un utilisateur spécifique par son id (le frontend va envoyer l'id de l'utilisateur)
router.get('/:id', auth, sauceCtrl.getOneSauce);
//implémenter une route put pour la modification d'un utilisateur existant
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//implémenter une route pour supprimer un utilisateur 
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
