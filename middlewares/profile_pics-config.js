const multer = require("multer");

const MIME_TYPES = {
    'image/jpa':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
    'image/gif':'gif'
};

const storage = multer.diskStorage({
    destination : (request, file, callback) => {
        callback(null, 'public/profile_pics');
    },
    filename : (request, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        const nameWithoutExt = name.replace(/.\w+$/, "");
        callback(null, nameWithoutExt + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('profilePicture');