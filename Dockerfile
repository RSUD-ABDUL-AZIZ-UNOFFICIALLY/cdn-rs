FROM node:20-alpine

# Set working directory di dalam container
WORKDIR /usr/src/app

# Set environment ke production (hapus baris ini jika untuk development)
ENV NODE_ENV=production
ENV PORT=8000

# Copy file package.json dan package-lock.json terlebih dahulu
# Ini penting agar Docker bisa melakukan cache pada layer instalasi dependensi
COPY package*.json ./

# Install dependensi aplikasi (gunakan 'npm install' biasa jika butuh devDependencies)
RUN npm ci --only=production

# Copy seluruh source code aplikasi ke dalam container
COPY . .

# Expose port yang digunakan oleh aplikasi Node.js
EXPOSE 8000

# Perintah untuk menjalankan aplikasi (sesuaikan path file utama)
CMD ["node", "index.js"]