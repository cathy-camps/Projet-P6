const jwt = require('jsonwebtoken');

//paramètres d'authentification 
module.exports = (req, res, next) => {
    try {
        //récupérer les 2 éléments du tableau
        const token = req.headers.authorization.split(' ')[1];
        //vérifier le token et la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.userId = userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw "Identifiant non valide !";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
};