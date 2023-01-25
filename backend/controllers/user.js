const bcrypt = require('bcrypt');
const User = require('../models/User');

//crypter le mot de passe, créer un nouvel utilisateur avec ce mot de passe créé et l'adresse mail, puis enregistrer l'utilisateur dans la base de données
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({error}));
};

//permettre aux utilisateurs existants de se connecter à la base de données
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(user === null) {
            res.status(401).json({message: 'Identifiant ou mot de passe incorrect'})
        }else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' })
                }else{
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    })
                }
            })
            .catch(error => {
                res.status(500).json({error});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error});
    })

};