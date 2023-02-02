const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet')
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const cors = require('cors');
//const dotenv = require('dotenv')
require ('dotenv').config();

const app = express();

//console.log(process.env.MONGO_URL)

mongoose.set('strictQuery', true);
//se connecter à notre base de données MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//ajout de headers à l'objet réponse pour que les 2 serveurs puissent communiquer entre eux
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app
.use(express.json()) //remplace bodyParser
.use(express.urlencoded({ extended: true}))
.use(cors())
.use(helmet({crossOriginResourcePolicy: false}));

//enregistrer les images
app.use('/images', express.static(path.join(__dirname, 'images')));

//enregistrer les routes sauce et utilisateur 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;