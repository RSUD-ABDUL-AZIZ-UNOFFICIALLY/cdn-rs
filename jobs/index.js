const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { Image, Head } = require("../models");
const path = require('path');
const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
// Integrasi face-api dengan canvas
const { Canvas, ImageFoto, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, ImageFoto, ImageData });

const MODEL_PATH = path.join(__dirname + '/../fr/models'); // Path ke model pre-trained

// Fungsi untuk memuat model pre-trained
async function loadModels() {
    console.log('Memuat model...');
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
}
(async () => {
    await loadModels();
})();

const {
    AUTH_TOKEN,
    FETCH_URL
} = process.env;
const fetchData = async () => {
    const response = await fetch(FETCH_URL, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AUTH_TOKEN, // Ganti dengan token Anda
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const webpUrls = data.data
        .map(item => item.url)
        .filter(url => !url.endsWith('.webp'));
    // console.log(webpUrls);
    let dataExsist = await Image.findAll({
        attibutes: ['url']
    });
    const dataExistUrls = dataExsist.map(item => item.url);
    // console.log(dataExistUrls);
    const newUrls = webpUrls.filter(url => !dataExistUrls.includes(url));
    console.log(newUrls);
    await Image.bulkCreate(newUrls.map(url => ({ url })));

};
fetchData().catch(console.error);

async function indexFace() {
    let dataImage = await Image.findAll({
        where: {
            face: null
        },
        attibutes: ['id', 'url'],
        limit: 1
    });

    // console.log(dataImage);
    for (let item of dataImage) {
        console.log(item.url);
        let patch = './cache/' + item.url.split('/').pop()
        await saveImageWithBuffer(item.url, patch);
        // const descriptors = await detectFaces(patch);
        // console.log(descriptors);
        let img = await canvas.loadImage(patch);

        // Buat canvas untuk menggambar gambar
        let imgCanvas = canvas.createCanvas(img.width, img.height);
        let ctx = imgCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Deteksi wajah
        let detections = await faceapi.detectAllFaces(imgCanvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
        if (detections.length === 0) {
            console.log('Tidak ada wajah yang terdeteksi.');
            await Image.update({
                face: false,
                faces: 0
            }, {
                where: {
                    url: item.url
                }
            });
            continue;
        }
        console.log(`Jumlah wajah terdeteksi: ${detections.length}`);
        await Image.update({
            face: true,
            faces: detections.length
        }, {
            where: {
                url: item.url
            }
        });
        // Pilih wajah pertama yang terdeteksi
        let i = 0;
        for (let face of detections) {
            let { x, y, width, height } = face.detection.box;
            // Potong gambar berdasarkan koordinat bounding box
            let croppedCanvas = canvas.createCanvas(width, height);
            let croppedCtx = croppedCanvas.getContext('2d');
            croppedCtx.drawImage(imgCanvas, x, y, width, height, 0, 0, width, height);

            // Simpan gambar hasil crop
            let cropPath = './cache/' + i + '.jpg';
            let out = fs.createWriteStream(cropPath);
            let stream = croppedCanvas.createJPEGStream();
            stream.pipe(out);
            // console.log(detections[i].descriptor);
            let result = await uploadImage(cropPath);

            console.log(result);
            await Head.create({
                url: result.data.jpg,
                face_landmarks: JSON.stringify(detections[i].descriptor),
                master_url: item.url,
            });
            fs.unlinkSync(cropPath);
            fs.unlinkSync(patch);
            i++;
            console.log('Wajah berhasil dipotong dan disimpan');
        }
    }
}
// indexFace().catch(console.error);

const saveImageWithBuffer = async (url, path) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(path, buffer);
};

// Contoh penggunaan:
// saveImageWithBuffer(imageUrl, savePath)
//     .then(() => console.log('Image saved successfully!'))
//     .catch(console.error);

const uploadImage = async (path) => {
    try {
        console.log(`Uploading: ${path}`);
        let data = fs.createReadStream(path);
        const formdata = new FormData();
        formdata.append("image", data);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + AUTH_TOKEN);
        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: myHeaders,
        };
        let response = await fetch("https://web.rsusaadah.id/api/cdn/upload/img", requestOptions);
        return response.json();

    } catch (err) {
        console.log(err);
        return err;
    }
}