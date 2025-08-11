const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, degrees, StandardFonts } = require("pdf-lib");
const DIR = process.env.DIR || "./public/defaultDir";
const http = process.env.URL_STATE || "http";
const watermarkDir = path.join(DIR + "/" + "watermark/");
if (!fs.existsSync(watermarkDir)) {
  fs.mkdirSync(watermarkDir, { recursive: true });
}
const axios = require('axios');


const downloadFile = async (url, outputFilename) => {
    const filePath = watermarkDir+ '/'+ outputFilename;

    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });

        response.data.pipe(fs.createWriteStream(filePath));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => resolve(filePath));
            response.data.on('error', reject);
        });

    } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
    }
};
async function addWatermark(inputPath, watermarkText, filename) {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    

    for (const page of pages) {
        const { width, height } = page.getSize();
        // Hitung panjang diagonal
        const diagonalLength = Math.sqrt(width ** 2 + height ** 2);
        const targetWidth = diagonalLength * 0.9;

        // Font size sesuai diagonal
        const fontSize = targetWidth / font.widthOfTextAtSize(watermarkText, 1);

        // Spasi antar watermark
        const xSpacing = font.widthOfTextAtSize(watermarkText, fontSize) + 50;
        const ySpacing = fontSize * 3;

        // Loop grid watermark
        for (let row = 0, y = -height; y < height * 2; y += ySpacing, row++) {
            // Geser setiap baris bergantian setengah jarak X
            const xOffset = (row % 2) * (xSpacing / 2);
            for (let x = -width - xSpacing; x < width * 2; x += xSpacing) {
                page.drawText(watermarkText, {
                    x: x + xOffset,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(1, 0, 0),
                    opacity: 0.15,
                    rotate: degrees(45)
                });
            }
        }
    }
  const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(watermarkDir + filename, pdfBytes);
  return
}

module.exports = {
  pdfMark: async (req, res) => {
    try {
      let body = req.body;
      let uRL = req.body.uRL;
      const Url = http + '://' + req.get('host');
      if (!uRL || !body.message) {
        return res.status(400).json({
          status: false,
          message: "uRL dan message wajib diisi",
        });
      }
      let fileURL = uRL.split(".");
      if (fileURL[fileURL.length - 1] !== "pdf") {
        return res.status(400).json({
          status: false,
          message: "uRL must be pdf",
        });
      }
      let filename = uRL.match(/[^/]+$/);
      let fileLocation = uRL.match(/^https?:\/\/[^\/]+(\/api\/cdn\/file\/)/);
      if (fileLocation) {
          await addWatermark("./public/filekit/" + filename, body.message, body.filename);
          let fileUrl = Url + '/api/cdn/document/watermark/' + body.filename;
          return res.status(400).json({
          status: false,
          message: "success",
          data: {
            fileUrl: fileUrl,
          },
        });
      }
      let fileSubdir = uRL.match(/^https?:\/\/[^\/]+(\/api\/cdn\/document\/)/);
      if (fileSubdir) {
          let subdir = uRL.match(/\/document\/([^/]+)/);
     
          await addWatermark(DIR + "/" + subdir[1] + "/" + filename, body.message, body.filename);
          let fileUrl = Url + '/api/cdn/document/watermark/' + body.filename;
        return res.status(400).json({
          status: false,
          message: fileSubdir,
            data: {
                fileUrl: fileUrl,
            },
        });
      }
     let randomString = Math.random().toString(36).slice(2);
     console.log(randomString);
     await downloadFile(uRL, randomString + '.pdf')
        await addWatermark(watermarkDir + "/" + randomString + '.pdf', body.message, body.filename);


      res.status(200).json({
        status: true,
        message: "success",
        data: null,
      });
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },
};
