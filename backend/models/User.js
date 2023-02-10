const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Schéma de l'user 
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

//Vérifier que l'adresse email est unique 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);