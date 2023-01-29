const Sauce = require("../models/Sauce");
const jwt = require('jsonwebtoken');
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non autorisé'});
        } else {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id:
            req.params.id})
                .then(() => {
                    res.status(200).json({
                        message: 'Sauce modifiée avec succès!'
                    });
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
            if (sauce.userId != req.auth.userId) {
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
            } ).catch(
            (error) => {
                res.status(400).json({ 
                    error: error 
                });
            });
};