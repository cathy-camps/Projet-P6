const User = require("../models/User");
console.log(User)

//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
exports.createUser = (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
    .then(() => res.status(201).json({message: 'Utilisateur enregistré !'}))
    .catch(error => res.status(400).json({error}));
}
