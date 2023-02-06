const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

//const à passer à multer comme configuration contenant la logique nécessaire pour indiquer à multer ou enregistrer les fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //indique à multer quel nom de fichier utiliser, de remplacer les espaces par des underscores et d'ajouter un timestamp comme nom de fichier. Elle utilise ensuite la constante  dictionnaire de MIME pour résoudre l'extension de fichier appropriée
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
module.exports = multer({ storage }).single('image');