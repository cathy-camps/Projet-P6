const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const app = require('../app');

//crypter le mot de passe, créer un nouvel utilisateur avec ce mot de passe créé et l'adresse mail, puis enregistrer l'utilisateur dans la base de données
exports.signup = ('api_piiquante/auth/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //vérifier si l'email correspond bien à un format email
            const regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
            if (!regex.test(req.body.email)) {
                res.status(400).json({ message: 'email invalide' });
            }
            else {
                //vérifier si le mot de passe a au moins 8 caractères, une majuscule et un nombre
                if (!passwordValidation(req.body.password)) {
                    res.status(400).json({ message: 'Merci de saisir au moins 8 caractères, une majuscule et un nombre'});
                }
                else {
                    //on va hasher le mot de passe 10 fois pour éviter les attaques utilisant des rainbow tables, les attaques par dictionnaire et les attaques par force brute.
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        loginAttempt: 0,
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                        .catch(error => res.status(400).json({ error }));
                }}
            })
        .catch(error => res.status(500).json({ error }));
        //console.log(this.signup)
});
        
function passwordValidation(password) {
    if (password.length >= 8 && password != password.toLowerCase() && /\d/.test(password)) {
        return true;
    }
    else {
        return false;
    }
}

//Vérifier que l'email entré par l'utilisateur correspond à un utilisateur existant de la base de données
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    // si req ok : récupérer l'enregistrement dans la base de données et vérifier si l'utilisateur a bien été trouvé
    .then(user => {
        if(user === null) {
            res.status(401).json({message: 'Utilisateur inconnu'})
        //comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        }else {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        //on ajoute 1 à la tentative de connexion
                        user.loginAttempt += 1;
                        //on met à jour le nombre de connexion dans user
                        User.updateOne({ email: req.body.email }, user)
                            .then(() => res.status(401).json({ message: 'Mot de passe incorrect !' }))
                            .catch(error => res.status(500).json({ error }));
                    }
                    else {
                        //on remet à 0 la tentative de connexion
                        user.loginAttempt = 0;
                        //on met à jour le nombre de connexion dans user
                        User.updateOne({ email: req.body.email }, user)
                            .then(() => {
                                res.status(200).json({
                                    userId: user._id,
                                    token: jwt.sign(
                                        //on stocke également l'ip de l'utilisateur au moment de l'authentification et on vérifira pour les requête suivant qu'il se connectera depuis le même endroit
                                        { userId: user._id, ip: req.ip },
                                        'RANDOM_TOKEN_SECRET',
                                        { expiresIn: '24h' }
                                    )
                                });
                            })
                            .catch(error => res.status(500).json({ error }));
                    }
                })
                .catch(error => res.status(500).json({ error }));
        }
    })
        .catch(error => res.status(500).json({ error }));
};

console.log(User)