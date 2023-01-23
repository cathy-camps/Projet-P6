const express = require('express');
const bodyParser =  require ('body-parser');
const dotenv = require('dotenv').config();
const config = require('./config');
//console.log(config);
const mongoose = require ('mongoose');
const cors = require('cors');

const User = require('./models/User');
console.log(User);

mongoose.set('strictQuery', true);
//se connecter à notre base de données MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON. Pour cela, vous avez juste besoin d'un middleware très simple, mis à disposition par le framework Express.
//Express intercepte toutes les requêtes qui ont comme Content-Type application/json et met à disposition ce contenu (corps de la requête (req.body))  directement sur l'objet req, extrait l'objet json de la requete
//remplace bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ajout de headers à l'objet réponse pour que les 2 serveurs puissent communiquer entre eux
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(cors());

//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
app.post('/api_piiquante/users', (req, res, next) => {
    //supprime l'id généré automatiquement
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    //enregistrer un utilisateur dans la base de données
    thing.save()
    .then(() => res.status(201).json({message: 'Utilisateur enregistré !'})) //renvoit une réponse au front-end (sinon la requête va expirer)
    .catch(error => res.status(400).json({ error }));
});

//récupération d'un utilisateur spécifique par son id (le frontend va envoyer l'id de l'utilisateur)
app.get('/api_piiquante/users/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
});

//implémenter la route get pour récupérer la liste complète des utilisateurs enregistrés dans la base de données
app.get('/api_piiquante/users', (req, res, next) => {
    User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({error}))
    });
 
//implémenter une route put pour la modification d'un utilisateur existant
app.put('/api_piiquante/users/:id', (req, res, next) => {
    User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
        .catch(error => res.status(400).json({ error }));
});

//implémenter une route pour supprimer un utilisateur 
app.delete('/api_piiquante/users/:id', (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
        .catch(error => res.status(400).json({ error }));
});
/*
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//middleware pour s'inscrire
app.post('/api_piiquante/user/auth/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({
            message: 'Utilisateur crée avec succès'
        }))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
    });

    //middleware pour se connecter : on vérifie si l'email existe déjà + on vérifie le mot de passe + génération d'un nouveau token
    app.post('/api-piiquante/user/auth/login', (req, res, next) => {
        User.findOne({ email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(401).json({error: 'Utilisateur inconnu !'});
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' })
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign (
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}

                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({ error }));
});

    /*
//enregistrement d'un user dans la base de données
//création d'une instance du modèle user en lui passant un objet JavaScript contenant toutes les infos du corps de requête analysé, en supprimant le faux ID envoyé par le front end
app.post('/api-piiquante/user', (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    //la méthode save renvoit une promise
    user.save()
        .then(() => res.status(201).json({ message: "compte utilisateur crée !" }))
        .catch(error => res.status(400).json({ error }));
});

//implémenter une route get pour envoyer les users dans la base de données
app.use('/api_piiquante/user', (req, res, next) => {
    User.find()
    .then(user = res.status(200).json(user))
    .catch(error => res.status(400).json({error}));
});*/


module.exports = app;