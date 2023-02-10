const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

//Configuration de Multer pour lui indiquer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //indique à Multer quel type de fichier utiliser, remplacer les espaces par des underscores et ajouter un timestamp comme nom de fichier. Elle utilise ensuite la constante  dictionnaire de MIME pour résoudre l'extension de fichier appropriée
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Export de l'élément multer configuré, avec la constante storage, seront gérés uniquement les téléchargements de fichiers image.
module.exports = multer({ storage }).single('image');