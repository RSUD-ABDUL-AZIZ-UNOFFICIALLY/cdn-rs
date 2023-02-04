const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/imagekit');
    },

    filename: function (req, file, callback) {
        // const namaFile = Date.now() + '-' + file.originalname.split(' ').join('') + path.extname(file.originalname);
        const namaFile = Date.now() + '-' + file.originalname.split(' ').join('');
        console.log(file);
        callback(null, namaFile);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/svg+xml') {
            callback(null, true);
        } else {
            callback(null, false);
            callback(new Error('only png, jpg, and jped allowed to upload!'));
        }
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
});

module.exports = upload;