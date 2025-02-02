const express = require('express');
const router = express.Router();
const { upload, upload_file, upload_video, upload_fr } = require('../middlewares/storage');
const auth = require('../middlewares/');
const media = require('../controllers/mediaController');
const webpController = require('../controllers/webpController');
const fr = require('../controllers/fr');
const links = require('../controllers/links');
const webviews = require('../controllers/webviews');

// router.post('/upload/img', auth.check, storage.single('image'), webpController.webp, media.single);
router.post('/upload/img', upload.single('image'), webpController.webp, media.single);
router.post('/upload/file', upload_file.single('file'), media.file);
router.post('/upload/video', upload_video.single('video'), media.video);
router.get('/media/patch', media.patch);
router.get('/media/fs/:id', auth.check, media.getDataFs);
router.delete('/media/fs/:id', auth.check, media.deleteFs);
// router.post('/upload/multi', storage.array('image', 10), media.multi);

router.post('/upload/fr/recognition', upload_fr.single('image'), fr.embed);
router.put('/upload/fr/recognition', upload_fr.single('image'), fr.compare);
router.get('/upload/fr/recognition', fr.metadata);
router.get('/metadata/fr/all', fr.allMetadata);
router.get('/metadata/fr/all/open', fr.openMetadata);
router.get('/metadata/fr/by/:metadata', fr.MetadataFR);
router.get('/metadata/fr/all/dump', fr.MetadumpFR);

router.get('/media/fr/viewAll', webviews.media);
router.get('/media/fr/dump/viewAll', webviews.mediadump);

router.get('/short', links.short);
// router.get('/s/:id', links.getShort);


module.exports = router;