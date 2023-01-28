const express = require('express');
const mongoose = require('mongoose');
const bodyParser =  require ('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
require('./config');

const app = express();
//console.log(process.env.MONGO_URL)

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.set('strictQuery', true);
//se connecter à notre base de données MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

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

app.use('/api_piiquante/sauce', sauceRoutes);
app.use('/api_piiquante/auth', userRoutes);

module.exports = app;