const multer = require("multer");

const MIME_TYPES = {
    'image/jpp':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
};

const storage = multer.diskStorage({
    destination : (request, file, callback) => {
        callback(null, 'public/game_pics');
    },
    filename : (request, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        const nameWithoutExt = name.replace(/.\w+$/, "");
        const tmstmp = Date.now();
        request.body.tmstmp = tmstmp;
        callback(null, nameWithoutExt + tmstmp + '.' + extension);
    }
});

module.exports = multer({storage}).single('game_picture');