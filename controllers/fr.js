require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { loadModels, detectFaces, euclideanDistance, autoCropFace } = require('../fr');
const { rand, data } = require('@tensorflow/tfjs-node');
const { file } = require('./mediaController');
const http = process.env.URL_STATE || "http";
module.exports = {
    embed: async (req, res) => {
        try {
            let IMAGE_PATH = path.join(__dirname + './../public/fr/images/' + req.file.filename);
            console.log(IMAGE_PATH);
            await loadModels();

            const descriptors = await detectFaces(IMAGE_PATH);
            // delete file after use
            let crop = await autoCropFace(IMAGE_PATH, req.body.name);
            fs.unlinkSync(path.join(__dirname + './../public/fr/images/' + req.file.filename));
            if (descriptors.length === 0) {
                return res.status(201).json({
                    status: true,
                    message: "Tidak ada wajah yang terdeteksi",
                });
            }
            let i = 0;
            let data = []
            for (let dest of descriptors) {
                let filemeta = i + '_' + req.body.nik + '.json';
                let meta = {
                    name: req.body.name,
                    nik: req.body.nik,
                    metadata: filemeta,
                    image: '/api/cdn/fr/' + req.body.name + i + '.jpg',
                }
                data.push(filemeta);
                fs.writeFileSync(path.join(__dirname + './../public/fr/metadata/' + filemeta), JSON.stringify(dest), 'utf8');
                fs.writeFileSync(path.join(__dirname + './../public/fr/metadata/static_' + filemeta), JSON.stringify(meta), 'utf8');

                i++;
            }
            return res.status(200).json({
                status: true,
                message: "success",
                data: data
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    compare: async (req, res) => {
        try {
            let IMAGE_PATH = path.join(__dirname + './../public/fr/images/' + req.file.filename);
            console.log(IMAGE_PATH);
            let metadata = req.body.metadata;
            await loadModels();
            const descriptors = await detectFaces(IMAGE_PATH);
            if (descriptors.length === 0) {
                return res.status(201).json({
                    status: true,
                    message: "Tidak ada wajah yang terdeteksi",
                });
            }
            let datameta = fs.readFileSync(path.join(__dirname + './../public/fr/metadata/' + metadata), 'utf8');
            datameta = JSON.parse(datameta);
            datameta = Object.keys(datameta).map((key) => datameta[key]);
            let dataCompare = euclideanDistance2(datameta, descriptors[0]);
            let stat = {};
            if (dataCompare > 0.6) {
                stat = {
                    status: 'tidak cocok',
                    data: false
                }
            } else {
                stat = {
                    status: 'cocok',
                    data: true
                }
            }
            fs.unlinkSync(path.join(__dirname + './../public/fr/images/' + req.file.filename));
            return res.status(200).json({
                status: true,
                message: "success",
                data: dataCompare,
                output: stat
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
}
function euclideanDistance2(descriptor1, descriptor2) {
    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
    }
    return Math.sqrt(sum);
}