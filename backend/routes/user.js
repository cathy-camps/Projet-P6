const express = require('express');
const router = express.Router();

const User = require('../models/User');
console.log(User);

router.post('/', (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    //enregistrer un utilisateur dans la base de données
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' })) //renvoit une réponse au front-end (sinon la requête va expirer)
        .catch(error => res.status(400).json({ error }));
});

/*
//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
router.post('/', (req, res, next) => {
    //supprime l'id généré automatiquement
    delete req.body._id;
    const user = new User({
        ...req.body
    });
});*/

//récupération d'un utilisateur spécifique par son id (le frontend va envoyer l'id de l'utilisateur)
router.get('/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
});
 
//implémenter une route put pour la modification d'un utilisateur existant
router.put('/:id', (req, res, next) => {
    const user = new User ({
        email: req.body.email,
        password: req.body.password
});
    User.updateOne({ _id: req.params.id }, user)
    //{ ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur modifié avec succès!' }))
        .catch(error => res.status(400).json({ error }));
});


//implémenter une route pour supprimer un utilisateur 
router.delete('/:id', (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
        .catch(error => res.status(400).json({ error }));
});



//implémenter la route get pour récupérer la liste complète des utilisateurs enregistrés dans la base de données
router.get('/' + '', (req, res, next) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }))
});

module.exports = router;
