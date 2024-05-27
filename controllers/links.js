require('dotenv').config();
const http = process.env.URL_STATE || "http";
const fs = require('fs');
module.exports = {
    short: async (req, res) => {
        try {
            const Url = http + '://' + req.get('host');
            const { author, link, newlink, description } = req.query;
            const shortUrl = Url + '/s/' + newlink;
            const data = {
                author: author,
                link: link,
                newlink: newlink,
                description: description,
                shortUrl: shortUrl
            }
            let isExist = fs.existsSync(`./jsonDB/links/${author}.json`);
            console.log(isExist);
            if (!isExist) {
                fs.writeFileSync(`./jsonDB/links/${author}.json`, JSON.stringify([]), 'utf8');
            }
            let cekFile = JSON.parse(fs.readFileSync(`./jsonDB/links/${author}.json`, 'utf8'));
            cekFile.push(data);


            // console.log(gfs);
            res.status(200).json({
                status: true,
                message: "success",
                data: {
                    Url: Url,
                    shortUrl: shortUrl,
                }
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    }
};