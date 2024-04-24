require('dotenv').config();
const http = process.env.URL_STATE || "http";
module.exports = {
    single: async (req, res) => {
        try {

            const Url = http + '://' + req.get('host');
            const imageUrl = Url + '/api/cdn/image/' + req.file.filename;
            const imageWebpUrl = Url + '/api/cdn/image/' + req.file.filename.split('.')[0] + ".webp";

            const image = ({
                title: req.file.filename,
                url: imageWebpUrl,
                size: req.file.size,
                jpg: imageUrl,
            });

            res.status(200).json({
                status: true,
                message: "success",
                data: image
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    }, multi: (req, res) => {
        try {
            res.json(req.files);
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },file: async (req, res) => {
        try {
            const Url = http + '://' + req.get('host');
            console.log(req);
            const fileUrl = Url + '/api/cdn/file/' + req.file.filename;

            const file = ({
                title: req.file.filename,
                url: fileUrl,
                size: req.file.size,
            });

            res.status(200).json({
                status: true,
                message: "success",
                data: file
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    video: async (req, res) => {
        try {
            const Url = http + '://' + req.get('host');
            console.log(req);
            const fileUrl = Url + '/api/cdn/video/' + req.file.filename;

            const file = ({
                title: req.file.filename,
                url: fileUrl,
                size: req.file.size,
            });

            res.status(200).json({
                status: true,
                message: "success",
                data: file
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    patch: async (req, res) => {
        try {
            const Url = http + '://' + req.get('host');
            const image = Url + '/api/cdn/image/';
            const file = Url + '/api/cdn/file/';
            const video = Url + '/api/cdn/video/';

            res.status(200).json({
                status: true,
                message: "success",
                data: {
                    image: image,
                    file: file,
                    video: video,
                }
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    getDataFs: async (req, res) => {
        try {
            let params = req.params;
            let fs = require('fs');
            let path = require('path');
            let dir = path.join(__dirname, '../public/' + params.id);
            let files = fs.readdirSync(dir);
            // filter .gitkeep
            files = files.filter((file) => file !== '.gitkeep');
            const Url = http + '://' + req.get('host');
            // imagekit,filekit,video
            if (params.id === 'imagekit') {
                const image = Url + '/api/cdn/image/';
                files = files.map((file) => {
                    return {
                        title: file,
                        url: image + file,
                    }
                });
            }
            if (params.id === 'filekit') {
                const filess = Url + '/api/cdn/file/';
                files = files.map((file) => {
                    return {
                        title: file,
                        url: filess + file,
                    }
                });
            }
            if (params.id === 'video') {
                const video = Url + '/api/cdn/video/';
                files = files.map((file) => {
                    return {
                        title: file,
                        url: video + file,
                    }
                });
            }

            res.status(200).json({
                status: true,
                message: "success",
                data: files
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    deleteFs: async (req, res) => {
        try {
            let params = req.params;
            let { title } = req.query;
            let fs = require('fs');
            let path = require('path');
            let dir = path.join(__dirname, '../public/' + params.id);
            fs.unlinkSync(dir + '/' + title);

            res.status(200).json({
                status: true,
                message: "success",
                data: null
            });

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    }
}