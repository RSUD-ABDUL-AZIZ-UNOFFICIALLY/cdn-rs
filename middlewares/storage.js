require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DIR = process.env.DIR || './public/defaultDir';



const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/imagekit');
    },

    filename: function (req, file, callback) {
        const namaFile = Date.now() + '-' + file.originalname.split(' ').join('');
        callback(null, namaFile);
    }
});
const storage_file = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/filekit');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname.split(' ').join(''));
      }
});
const storage_video = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/video');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname.split(' ').join(''));
    }
});
const storage_subDir = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("CARISS")
        let mainRoot = DIR + '/' + req.query.file;
        const uploadPath = path.join( mainRoot);
        console.log(uploadPath);
        console.log(!fs.existsSync(uploadPath))
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-'
        cb(null, uniqueSuffix + file.originalname.split(' ').join(''));
      }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/png'
            || file.mimetype == 'image/jpg'
            || file.mimetype == 'image/jpeg'
            || file.mimetype == 'image/svg+xml') {
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



const upload_file = multer({
    storage: storage_file,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/png'
            || file.mimetype == 'image/jpg'
            || file.mimetype == 'image/jpeg'
            || file.mimetype == 'image/svg+xml'
            || file.mimetype == 'application/pdf'
            || file.mimetype == 'application/json'
            || file.mimetype == 'text/csv'
            || file.mimetype == 'text/javascript'
            || file.mimetype == 'application/msword'
            || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || file.mimetype == 'application/vnd.ms-excel'
            || file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            || file.mimetype == 'application/vnd.ms-powerpoint'
            || file.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            || file.mimetype == 'text/plain'
        ) {
            callback(null, true);
        } else {
            callback(null, false);
            callback(new Error('only png, jpg,svg+xml,pdf, and officedocument allowed to upload!'));
        }
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
});

const upload_video = multer({
    storage: storage_video,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'video/mp4'
            || file.mimetype == 'video/mkv'
            || file.mimetype == 'video/avi'
            || file.mimetype == 'video/mpeg'
            || file.mimetype == 'video/webm'
        ) {
            callback(null, true);
        } else {
            callback(null, false);
            callback(new Error('only mp4, mkv,avi,mpeg, and jped allowed to upload!'));
        }
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
});
const upload_subDir = multer({
     storage: storage_subDir,
    fileFilter: (req, file, callback) => {
       if (file.mimetype == 'image/png'
            || file.mimetype == 'image/jpg'
            || file.mimetype == 'image/jpeg'
            || file.mimetype == 'image/svg+xml'
            || file.mimetype == 'application/pdf'
            || file.mimetype == 'application/json'
            || file.mimetype == 'text/csv'
            || file.mimetype == 'text/javascript'
            || file.mimetype == 'application/msword'
            || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || file.mimetype == 'application/vnd.ms-excel'
            || file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            || file.mimetype == 'application/vnd.ms-powerpoint'
            || file.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            || file.mimetype == 'text/plain'
        ) {
            callback(null, true);
        } else {
            callback(null, false);
            callback(new Error('only png, jpg,svg+xml,pdf, and officedocument allowed to upload!'));
        }
    },
})
module.exports = {
    upload,
    upload_file,
    upload_video,
    upload_subDir
    };