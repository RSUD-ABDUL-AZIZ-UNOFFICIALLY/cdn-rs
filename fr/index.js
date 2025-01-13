const canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const faceapi = require('@vladmandic/face-api');
const { model } = require('@tensorflow/tfjs-node');

// Integrasi face-api dengan canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(__dirname + '/models'); // Path ke model pre-trained

// Fungsi untuk memuat model pre-trained
async function loadModels() {
    console.log('Memuat model...');
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
}

// Fungsi untuk mendeteksi wajah
async function detectFaces(imagePath) {
    // Memuat gambar
    const img = await canvas.loadImage(imagePath);
    // Deteksi wajah dengan embedding
    console.log('Mendeteksi wajah...');
    const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length === 0) {
        console.log('Tidak ada wajah yang terdeteksi.');
        return [];
    }
    console.log(`Jumlah wajah terdeteksi: ${detections.length}`);
    return detections.map(d => d.descriptor);
}
function euclideanDistance(vec1, vec2) {
    return Math.sqrt(vec1.map((val, i) => (val - vec2[i]) ** 2).reduce((a, b) => a + b, 0));
}
async function autoCropFace(imagePath, name) {
    // Muat gambar
    const img = await canvas.loadImage(imagePath);

    // Buat canvas untuk menggambar gambar
    const imgCanvas = canvas.createCanvas(img.width, img.height);
    const ctx = imgCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Deteksi wajah
    const detections = await faceapi.detectAllFaces(imgCanvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length === 0) {
        console.log('Tidak ada wajah yang terdeteksi.');
        return false;
    }

    // Pilih wajah pertama yang terdeteksi
    // const face = detections[0];
    let i = 0;
    for (let face of detections) {
        const { x, y, width, height } = face.detection.box;

        // Potong gambar berdasarkan koordinat bounding box
        const croppedCanvas = canvas.createCanvas(width, height);
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.drawImage(imgCanvas, x, y, width, height, 0, 0, width, height);

        // Simpan gambar hasil crop
        const out = fs.createWriteStream(path.join(__dirname + './../public/fr/images/' + name + i + '.jpg'));
        const stream = croppedCanvas.createJPEGStream();
        stream.pipe(out);
        i++;

        console.log('Wajah berhasil dipotong dan disimpan sebagai cropped_face.jpg');
    }
    return true;

}
// Main function
(async () => {
    await loadModels();
})();
module.exports = {
    detectFaces,
    euclideanDistance,
    autoCropFace
};