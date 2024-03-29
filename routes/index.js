const express = require('express');
const router = express.Router();
const { upload, upload_file, upload_video } = require('../middlewares/storage');
const auth = require('../middlewares/');
const media = require('../controllers/mediaController');
const webpController = require('../controllers/webpController');

// router.post('/upload/img', auth.check, storage.single('image'), webpController.webp, media.single);
router.post('/upload/img', upload.single('image'), webpController.webp, media.single);
router.post('/upload/file', upload_file.single('file'), media.file);
router.post('/upload/video', upload_video.single('video'), media.video);
// router.post('/upload/multi', storage.array('image', 10), media.multi);
module.exports = router;