# Panduan Penggunaan Indonesia Virtual Tour

Panduan ini ditujukan untuk pengelola/admin website Indonesia Virtual Tour untuk menambah, mengedit, dan mengelola destinasi, rute wisata, serta media panorama 360°.

## A. Akses Admin
1. Buka halaman login: `https://[domain-aplikasi-anda]/login`
2. Masuk menggunakan akun admin yang telah terdaftar.
3. Setelah berhasil login, Anda akan diarahkan ke Admin Dashboard (`/admin`).

## B. Menambah Destinasi Baru
1. Masuk ke **Admin** → **Destinasi** → **Tambah Destinasi**.
2. Isi formulir:
   - **Judul**: Nama destinasi wisata.
   - **Slug**: URL-friendly (contoh: `nama-destinasi`).
   - **Deskripsi**: Penjelasan singkat.
   - **Kategori**: Jenis destinasi (Alam, Budaya, dll).
   - **Kota/Kabupaten**: Lokasi.
   - **Gambar Cover**: URL thumbnail.
   - **URL Panorama 360°**: URL foto equirectangular.
   - **Latitude & Longitude**: Koordinat lokasi.
   - **Info Tiket**: Data JSON (harga/notes).
   - **Jam Buka**: Data JSON (waktu buka/tutup).
   - **Fasilitas**: List fasilitas.
3. Klik **Simpan**.

## C. Menambah Rute Wisata
1. Masuk ke **Admin** → **Rute Wisata** → **Tambah Rute**.
2. Isi data: Judul, Slug, Deskripsi, Jumlah Hari, Status (Draft/Published), dan Gambar Cover.
3. Tambahkan destinasi ke rute (Urutan Kunjungan).
4. Isi jadwal & catatan per titik.
5. Klik **Simpan**.

## D. Mengunggah Gambar & Panorama
Anda bisa mengunggah file gambar (JPG, PNG, WebP) via API:
- **Endpoint**: `POST /api/upload`
- **Field FormData**:
  - `file`: File gambar yang ingin diunggah.
  - `bucket`: Kategori (`covers` untuk gambar cover, `panoramas` untuk panorama 360°).
- **Respon**: JSON `{ "url": "..." }`. Gunakan URL tersebut pada form Tambah Destinasi/Rute.

## E. Referensi Mencari Gambar
Untuk mencari referensi visual:
- **Gambar Cover**: [Pinterest](https://id.pinterest.com/) (Cari dengan kata kunci destinasi).
- **Panorama 360°**: [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Equirectangular_panoramas) (Cari dengan kategori "Equirectangular panoramas").
*Pastikan memperhatikan lisensi gambar sebelum digunakan.*

## F. Spesifikasi Panorama 360° (Pannellum)

| Spesifikasi | Rekomendasi |
| :--- | :--- |
| **Bentuk** | Equirectangular (Wajib) |
| **Rasio Aspek** | 2:1 |
| **Resolusi Min** | 2000 × 1000 px |
| **Resolusi Rekomendasi** | 4096 × 2048 px |
| **Format File** | .jpg / .jpeg |
| **Ukuran File** | < 4 MB |

## G. Troubleshooting Singkat

| Masalah | Solusi |
| :--- | :--- |
| Panorama tidak muncul | Pastikan format **equirectangular 2:1** & URL valid |
| Data tidak update | Lakukan **Redeploy** di Vercel Dashboard |
| Rute tidak tampil | Pastikan status rute **Published** |
| Gambar tidak muncul | Cek validitas URL gambar |
