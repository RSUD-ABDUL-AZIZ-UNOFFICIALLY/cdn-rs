const express = require('express');
const router = express.Router();
const storage = require('../middlewares/storage');
const media = require('../controllers/mediaController');
const webpController = require('../controllers/webpController');

router.post('/upload/img', storage.single('image'), webpController.webp, media.single);
// router.post('/upload/multi', storage.array('image', 10), media.multi);
module.exports = router;