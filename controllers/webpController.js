const webp = require('webp-converter');
module.exports = {
    webp: async (req, res, next) => {
        try {
            let filedir = './public/imagekit/' + req.file.filename;

            //cwebp(input,output,option)
            const result = webp.cwebp('./public/imagekit/' + req.file.filename, './public/imagekit/' + req.file.filename.split('.')[0] + ".webp", "-q 80", logging = "-v");
            result.then((response) => {
                console.log(response);
            });
            next();

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
};