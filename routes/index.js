const express = require('express');
const router = express.Router();
const { upload, upload_file, upload_video } = require('../middlewares/storage');
const auth = require('../middlewares/');
const media = require('../controllers/mediaController');
const webpController = require('../controllers/webpController');
const links = require('../controllers/links');

// router.post('/upload/img', auth.check, storage.single('image'), webpController.webp, media.single);
router.post('/upload/img', upload.single('image'), webpController.webp, media.single);
router.post('/upload/file', upload_file.single('file'), media.file);
router.post('/upload/video', upload_video.single('video'), media.video);
router.get('/media/patch', media.patch);
router.get('/media/fs/:id', auth.check, media.getDataFs);
router.delete('/media/fs/:id', auth.check, media.deleteFs);
// router.post('/upload/multi', storage.array('image', 10), media.multi);

router.get('/short', links.short);
// router.get('/s/:id', links.getShort);


module.exports = router;