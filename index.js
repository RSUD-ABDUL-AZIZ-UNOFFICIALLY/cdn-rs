const express = require('express');
const app = express();
const path = require('path');
const sharp = require('sharp');
// var favicon = require('serve-favicon');
// app.use(favicon(__dirname + '/public/favicon.ico'));
require('dotenv').config();
const {
    PORT = 3110
} = process.env;
console.log(process.env.JWT_SECRET_KEY);
const morgan = require('morgan');
const cors = require('cors')
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())
app.enable('trust proxy');

// app.use("/api/cdn/image/", express.static(path.join(__dirname + "/public/imagekit/"), {
//     setHeaders: (res, path, stat) => {
//         res.set('Cache-Control', 'public, max-age=3600');
//     }
// }));

app.get('/api/cdn/image/:imageName', async (req, res) => {
    const { imageName } = req.params;
    const { w, h } = req.query;

    const imagePath = path.join(__dirname, '/public/imagekit/', imageName);
    console.log(imagePath);

    try {
        // Validasi jika width/height diberikan
        const resizeOptions = {};
        if (w) resizeOptions.width = parseInt(w);
        if (h) resizeOptions.height = parseInt(h);

        // Mengubah ukuran gambar dengan sharp
        const resizedImageBuffer = await sharp(imagePath).resize(resizeOptions).toBuffer();

        // Mengirim gambar sebagai response
        res.set('Content-Type', 'image/png'); // Sesuaikan format sesuai kebutuhan
        res.send(resizedImageBuffer);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'Image not found or invalid parameters' });
    }
});
app.use("/api/cdn/file/", express.static(path.join(__dirname + "/public/filekit/"), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=120');
    }
}));
app.use("/api/cdn/video/", express.static(path.join(__dirname + "/public/video/"), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=180');
    }
}));
app.use("/api/cdn/fr/", express.static(path.join(__dirname + "/public/fr/images/"), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=180');
    }
}));

const routes = require('./routes');
app.use('/api/cdn', routes);

app.use(function (err, req, res, next) {
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

app.listen(PORT, () => {
    console.log('listening on port', PORT);

});