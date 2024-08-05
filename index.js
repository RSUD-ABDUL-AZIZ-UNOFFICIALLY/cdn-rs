const express = require('express');
const app = express();
const path = require('path');
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

app.use("/api/cdn/image/", express.static(path.join(__dirname + "/public/imagekit/")));
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