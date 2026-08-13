# Girls Nite Ouch! - Nebula Arena Prototype 🐍✨

Repositori ini memuat prototipe *website* untuk pendaftaran turnamen komunitas **Black Mamba**, bertema "Girls Nite Ouch! — Dueling Ground 1v1". Desain dibangun dengan konsep *Cyberpunk/Neon*, menggunakan palet warna *Deep Purple*, *Neon Pink*, dan *Neon Yellow* yang berfokus pada pengalaman *mobile-first*.

## 🚀 Fitur Utama
- **Landing Page Interaktif**: Menampilkan jadwal, cara pendaftaran, efek partikel nebula dinamis di latar belakang, dan tombol aksi (Call-to-Action) yang responsif.
- **Formulir Pendaftaran**: Formulir *mobile-friendly* bergaya *glassmorphism* dengan validasi cerdas (termasuk *auto-formatting* untuk username TikTok) dan pengecekan kotak persetujuan.
- **Halaman Buku Regulasi (`rules.html`)**: Dokumentasi *rules* (peraturan turnamen) yang rapi, mudah dibaca, dan konsisten dengan tema desain.
- **Dashboard Admin Khusus (`admin.html`)**: Halaman *desktop-optimized* tersembunyi yang ditujukan khusus bagi panitia untuk melakukan kurasi:
  - Dilengkapi keamanan sederhana (*passcode: MAMBA2026*).
  - Integrasi dengan `localStorage` (angka berjalan *real-time*).
  - Alur kurasi cerdas: Panitia memverifikasi status `Pending` ➔ `Lolos Verif`.
  - Sistem pengundian (*Smart Raffle*) yang otomatis menyeleksi 8 slot `Utama` secara acak HANYA dari peserta berstatus `Lolos Verif`.

## 📂 Struktur Direktori
- `/prototype/` : Akar (*root*) utama *website*.
  - `index.html` : Halaman depan pendaftaran.
  - `rules.html` : Halaman buku regulasi.
  - `admin.html` : Dashboard Panitia (Tabel desktop).
  - `/css/style.css` : File *stylesheet* sentral menggunakan variabel CSS.
  - `/js/prototype.js` : Sentra logika interaksi, validasi *form*, dan *localStorage*.
  - `/assets/` : Aset gambar/logo.
- `/rules/` : Cadangan salinan *markdown* mentah untuk peraturan.

## 💻 Cara Menjalankan Secara Lokal
Prototipe ini adalah situs statis murni tanpa ketergantungan (dependensi) *backend* atau *Node.js* kompleks. Anda bisa menjalankannya langsung di peramban web mana saja.
1. *Clone* repositori ini.
2. Buka file `/prototype/index.html` pada peramban web Anda.
3. Seluruh alur mulai dari mengisi form hingga melihat hasil di `/prototype/admin.html` akan langsung bekerja dengan menyimpan data di dalam memori lokal (*browser's localStorage*).

*Desain oleh: Tim Black Mamba Community*
