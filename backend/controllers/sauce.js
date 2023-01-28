const Sauce = require("../models/Sauce");
const jwt = require('jsonwebtoken');

exports.createSauce = (req, res, next) => {
    //delete req.body._id;
    const sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        disLikes: req.body.disLikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        price: req.body.price,
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
}

//récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id 
        }).then((sauce) => {
                res.status(200).json(sauce);
            }).catch((error) => {
                        res.status(404).json({ 
                            error: error 
                        });
                    });
            };

exports.modifySauce = (req, res, next) => {
    const sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        disLikes: req.body.disLikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        price: req.body.price,
    });
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
            res.status(201).json({ 
                message: 'Sauce modifiée avec succès!' 
            });
        }).catch(
                (error) => {
                    res.status(400).json({ 
                        error: error 
                    });
                });
        };

//supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({ 
                message: 'Sauce supprimée !' 
            });
        }).catch((error) => {
            res.status(400).json({ 
                error: error 
            });
        });
};

//récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
                res.status(200).json(sauces);
            } ).catch(
            (error) => {
                res.status(400).json({ 
                    error: error 
                });
            });
};