//vérifier que l'utilisateur a bien rempli tous les champs requis 
exports.validateSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    if (!sauceObject.name || !sauceObject.description || !sauceObject.manufacturer || !sauceObject.mainPepper) {
        return res.status(400).json({ error: 'Tous les champs doivent être remplis.' });
    }

    next();
};
