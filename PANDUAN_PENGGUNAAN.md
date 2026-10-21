# Panduan Penggunaan Indonesia Virtual Tour

Panduan ini ditujukan untuk pengelola/admin website untuk menambah, mengedit, dan mengelola destinasi, rute wisata, serta media panorama 360°.

## A. Akses Admin

1. Buka halaman login: `https://[domain-anda]/login`
2. Masuk menggunakan akun admin yang telah terdaftar
3. Setelah berhasil login, Anda akan diarahkan ke halaman Admin Dashboard (`/admin`)

## B. Menambah Destinasi Baru

1. Masuk ke Admin → **Destinasi** → **Tambah Destinasi**
2. Isi formulir dengan data berikut:
   - **Judul** (wajib) - Nama destinasi wisata
   - **Slug** (wajib) - URL-friendly, otomatis terisi atau bisa diisi manual (huruf kecil, tanpa spasi, pakai `-`)
   - **Deskripsi** - Penjelasan singkat tentang destinasi
   - **Kategori** - Contoh: `Alam`, `Budaya`, `Kuliner`, `Belanja`, dll
   - **Kota/Kabupaten** - Contoh: `Banyuwangi`, `Jember`, dll
   - **Gambar Cover** - URL gambar untuk thumbnail/kartu destinasi
   - **URL Panorama 360°** - URL foto panorama equirectangular untuk ditampilkan di halaman detail & hero carousel
   - **Latitude & Longitude** - Koordinat lokasi (opsional tapi berguna untuk peta)
   - **Info Tiket** (JSON) - Contoh: `{"adult": 15000, "child": 10000, "notes": "..." }`
   - **Jam Buka** (JSON) - Contoh: `{"open": "07:00", "close": "17:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}`
   - **Fasilitas** - Pisahkan dengan koma atau sesuaikan form yang tersedia

3. Klik **Simpan** untuk menambahkan destinasi

## C. Menambah/Mengelola Rute Wisata

1. Masuk ke Admin → **Rute Wisata** → **Tambah Rute**
2. Isi informasi rute:
   - **Judul Rute**
   - **Slug**
   - **Deskripsi/Summary**
   - **Jumlah Hari** (`duration_days`)
   - **Status**: `Draft` (tidak tampil di publik) atau `Published` (tampil di publik)
   - **Gambar Cover**
3. Pada bagian **Daftar Destinasi (Urutan Kunjungan)**, tambahkan destinasi yang ingin dimasukkan ke dalam rute beserta urutannya
4. Isi **Jam/Jadwal** dan **Catatan** per titik kunjungan jika diperlukan
5. Klik **Simpan**

## D. Mencari Gambar & Panorama 360°

### Mencari Gambar (Cover/Thumbnail)
Untuk mencari referensi foto destinasi yang bagus:

- **[Pinterest](https://id.pinterest.com/)** - Sangat rekomendasi. Cari dengan kata kunci seperti `Kawah Ijen`, `Pantai Pulau Merah`, dll. Perhatikan lisensi gambar (prioritaskan gambar yang bisa digunakan untuk keperluan website Anda)

### Mencari Panorama 360° Equirectangular
Untuk mencari foto panorama 360° yang bisa digunakan di website ini:

- **[Wikimedia Commons - Equirectangular Panoramas](https://commons.wikimedia.org/wiki/Category:Equirectangular_panoramas)** - Gratis, kebanyakan berlisensi bebas untuk digunakan (cek lisensi per file: Public Domain / CC BY / CC BY-SA)
- Bisa juga mencari di sumber lain dengan catatan tetap memperhatikan hak cipta/lisensi

## E. Spesifikasi Panorama 360° (Pannellum)

Website ini menggunakan [Pannellum](https://pannellum.org/) untuk menampilkan panorama 360°. Agar hasilnya maksimal dan loading tidak terlalu berat:

| Spesifikasi | Rekomendasi | Keterangan |
|-------------|-------------|-------------|
| **Bentuk** | Equirectangular | Wajib berbentuk equirectangular (proyeksi persegi panjang melengkung seperti peta dunia). Bukan cubemap. |
| **Rasio Aspek** | **2:1** (width : height) | Rasio paling ideal & stabil untuk Pannellum. Contoh: 2000 × 1000, 4096 × 2048 |
| **Resolusi Minimal** | **2000 × 1000 px** | Resolusi minimum agar panorama tidak terlalu pecah saat dibuka |
| **Resolusi Rekomendasi** | **4096 × 2048 px** | Keseimbangan terbaik antara kualitas & performa |
| **Resolusi Maksimal (aman)** | **6144 × 3072 px** | Bisa digunakan, namun loading lebih lama tergantung koneksi pengunjung |
| **Format File** | `.jpg` / `.jpeg` | Lebih ringan dibanding PNG. Hindari format lain |
| **Ukuran File** | **< 2 - 4 MB** (ideal) | Usahakan semaksimal mungkin < 4MB. Bisa dikompres dengan tools seperti [TinyPNG](https://tinypng.com/) atau [Squoosh](https://squoosh.app/) |
| **FOV/Proyeksi** | Equirectangular (360×180) | Menutupi seluruh lingkaran 360° horizontal dan 180° vertikal |

> **Tips:** Jika file terlalu besar (>5-6MB), kemungkinan akan terasa lambat saat dimuat di halaman beranda/carousel. Kompreslah terlebih dahulu agar pengalaman browsing tetap nyaman.

## F. Tips Penggunaan

- **Hero Carousel** - Destinasi yang muncul di carousel beranda adalah **destinasi unggulan (featured)** yang memiliki **URL Panorama 360°**. Semakin banyak destinasi berpanorama, semakin beragam slideshow-nya.
- **Urutan Rute** - Perhatikan urutan pada rute wisata, karena ini yang akan ditampilkan sebagai itinerary pengunjung.
- **Status Rute** - Selalu pastikan rute dalam status **Published** jika ingin ditampilkan ke publik.
- **Slug Unik** - Pastikan slug destinasi dan rute **tidak duplikat** karena digunakan sebagai URL.
- **Kompres Panorama** - Selalu kompres panorama 360° sebelum mengunggah/menggunakan URL-nya untuk menjaga performa website.

## G. Troubleshooting Singkat

| Masalah | Solusi |
|---------|--------|
| Panorama tidak muncul | Pastikan file berbentuk **equirectangular 2:1** dan URL bisa diakses langsung (bisa dibuka di browser) |
| Data tidak update di Vercel | Lakukan **Redeploy** di Vercel Dashboard (bisa pakai *Clear Cache & Redeploy*) |
| Rute tidak tampil di publik | Pastikan status rute diubah menjadi **Published** |
| Gambar tidak muncul | Periksa kembali URL gambar (pastikan valid dan dapat diakses) |
