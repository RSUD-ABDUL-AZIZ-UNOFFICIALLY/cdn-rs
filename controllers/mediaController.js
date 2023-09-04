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
    }
}