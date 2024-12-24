const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');


// Integrasi face-api dengan canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Path ke model pre-trained
const MODEL_PATH = path.join(__dirname + '/models');
const IMAGE_PATH = path.join(__dirname + './../public/fr/images/1735019679383-673807480IMG_9196.JPG');  // Gambar yang ingin dipotong
console.log(IMAGE_PATH);

// Memuat model pre-trained
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
}

// Fungsi untuk mendeteksi wajah dan auto-crop
async function autoCropFace(imagePath) {
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
        return;
    }

    // Pilih wajah pertama yang terdeteksi
    const face = detections[0];
    const { x, y, width, height } = face.detection.box;

    // Potong gambar berdasarkan koordinat bounding box
    const croppedCanvas = canvas.createCanvas(width, height);
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCtx.drawImage(imgCanvas, x, y, width, height, 0, 0, width, height);

    // Simpan gambar hasil crop
    const out = fs.createWriteStream(path.join(__dirname + '/foto') + '/cropped_face.jpg');
    const stream = croppedCanvas.createJPEGStream();
    stream.pipe(out);

    console.log('Wajah berhasil dipotong dan disimpan sebagai cropped_face.jpg');
}
// Main function
(async () => {
    console.log('Memuat model...');
    await loadModels();

    console.log('Memotong wajah...');
    await autoCropFace(IMAGE_PATH);
})();
