const express = require('express');
const app = express();
// var favicon = require('serve-favicon');
// app.use(favicon(__dirname + '/public/favicon.ico'));
require('dotenv').config();
const {
    PORT = 3110
} = process.env;
const morgan = require('morgan');
const cors = require('cors')
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())
app.enable('trust proxy');

app.use("/api/cdn/image/", express.static("public/imagekit"), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=120');
        res.set('ETag', package.version); // add etag
    }
});
app.use("/api/cdn/file/", express.static("public/filekit"), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=120');
        res.set('ETag', package.version); // add etag
    }
});
app.use("/api/cdn/video/", express.static("public/video"), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=180');
        res.set('ETag', package.version); // add etag
    }
});

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