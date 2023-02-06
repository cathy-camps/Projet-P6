const Sauce = require("../models/Sauce");
const jwt = require('jsonwebtoken');
const fs = require('fs-extra')

//créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject, //copie tous les éléments de sauceObject
        //userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        disLikes: 0,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée avec succès!' }))
        .catch(error => res.status(400).json({ error }));
}

//récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
};

//modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(req.auth);
            if (sauce.userId != req.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const oldImage = sauce.imageUrl.split('/images/')[1];
                Sauce.updateOne({ _id: req.params.id }, {
                    ...sauceObject, _id:
                        req.params.id
                })
                    .then(() => {
                        if (req.file) {
                            fs.unlink(`images/${oldImage}`, () => {
                                res.status(200).json({
                                    message: 'Sauce modifiée avec succès!'
                                });
                            });
                        } else {
                            res.status(200).json({
                                message: 'Sauce modifiée avec succès!'
                            });
                        }
                    }).catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        })
};

//supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

//récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            });
};

//fonction like/dislike
exports.likeOrDislike = (req, res, next) => {
    //req du frontend contenant l'userId et le like
    //récupérer l'id de la sauce passé dans l'url
    const userId = req.body.userId;
    //récupère le corps de la requete du champ like
    const like = req.body.like;
    const sauceId = req.params.id;
    //aller chercher la sauce dans la BDD correspondant au like ou dislike, avec l'id passé en paramètre de la requete
    //3 cas possibles : like = 1 (like), like = 0 annule le like ou dislike, like = -1 (dislike)
    //aller chercher la sauce dans la base de données
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            //res.status(200).json(sauce)
            //traitement des 3 cas possibles :
            switch (like) {
                //l'utilisateur like la sauce 
                case 1:
                    sauce.usersLiked.push(userId);
                    sauce.likes = sauce.likes + 1;
                    break;
                //l'utilisateur dislike la sauce
                case -1:
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes = sauce.dislikes + 1;
                    break;
                //l'utilisateur veut annuler son like ou son dislike
                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        sauce.likes = sauce.likes - 1;
                        const index = sauce.usersLiked.indexOf(userId); //renvoit l'userId dans le tableau correspondant
                        sauce.usersLiked.splice(index, 1) //retirer 1 à l'index du tableau correspondant si l'utilisateur retire son like ou son dislike
                    } else {
                        //l'utilisateur veut annuler son dislike
                        const index = sauce.usersDisliked.indexOf(userId);
                        sauce.usersDisliked.splice(index, 1);
                        sauce.dislikes = sauce.dislikes - 1;
                    }
                    break;
            }
            delete sauce._id;
            //mise à jour des nouvelles valeurs et renvoyer un succès ou une erreur 
            Sauce.updateOne({ _id: sauceId }, sauce)
                .then(() => { res.status(200).json({ message: "Sauce like +1" }) })
                .catch((error) => {
                    console.log("\n\n" + error + "\n\n");
                    res.status(500).json({ error })
                });
        })
        .catch((error) => { res.status(500).json({ error })
     })
    };