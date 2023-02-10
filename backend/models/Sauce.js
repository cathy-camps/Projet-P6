const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, //id mongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true }, //nom de la sauce
    manufacturer: { type: String, required: true }, //fabricant de la sauce
    description: { type: String, required: true }, //description de la sauce
    mainPepper: { type: String, required: true }, // principal ingrédient épicé de la sauce
    imageUrl: { type: String }, //url de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true }, //nb entre 1 et 10 décrivant la sauce
    likes: { type: Number, default: 0 }, //nb d'utilisateurs qui aiment la sauce
    dislikes: { type: Number, default: 0 }, //nb d'utilisateurs qui n'aiment pas la sauce
    usersLiked: { type: Array, default: [] }, //tab des id des utilisateurs qui ont aimé la sauce
    usersDisliked: { type: Array, default: [] }, //tab des id des utilisateurs qui n'ont pas aimé la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);