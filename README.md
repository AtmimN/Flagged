# Flagged — Corporate Investigation Simulator

**Flagged** adalah game simulasi investigasi keamanan siber berbasis web. Pemain berperan sebagai petugas keamanan TI perusahaan yang bertugas meninjau email dan dokumen yang diteruskan (*forwarded*) oleh karyawan dari berbagai divisi, lalu menentukan apakah pesan tersebut **Aman** atau **Phishing**.

---

## Fitur Utama

- **Investigasi 4 Tipe Dokumen:**
  - **Teks (`TEXT`):** Analisis isi email, gaya bahasa, dan permintaan kredensial atau otorisasi.
  - **Gambar (`IMAGE`):** Pemeriksaan metadata gambar (*pixel anomaly* dan *hidden layer*).
  - **Tautan (`LINK`):** Inspeksi URL melalui **Sandbox Link** (*Redirect Chain*, *SSL Certificate*, *Domain Age*, dan *Form Fields*).
  - **Berkas (`FILE`):** Pemeriksaan lampiran mencurigakan.
- **Alat Bantu Investigasi:**
  - **Guide Book:** Daftar referensi domain resmi internal perusahaan dan vendor mitra.
  - **AI Assistant:** Laporan analisis linguistik dan tingkat kepercayaan (*confidence score*).
  - **Minigame Verifikasi Keamanan:** Untuk membuka fitur **Analisis Gambar**, pemain harus menyelesaikan 2 ronde minigame (**Memory Match** atau **Connect Pipes** berbasis *grid* Kartesius) dalam batas waktu tertentu.
- **Sistem Evaluasi:** Penilaian performa pemain di akhir sesi investigasi.

---

## Teknologi yang Digunakan

- **React 19** (`react`, `react-dom`)
- **Vite** (`@vitejs/plugin-react`)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **FontAwesome 6** & **Google Fonts (Inter)**
- **Docker & Nginx** (untuk *deployment* produksi)

---

## Cara Menjalankan Proyek

### Prasyarat

- [Node.js](https://nodejs.org/) (disarankan versi 20 atau lebih baru)
- npm (terpasang bersama Node.js)

### 1. Instalasi Dependensi

Clone repositori ini lalu masuk ke direktori proyek, kemudian instal seluruh paket yang dibutuhkan:

```bash
npm install
```

### 2. Menjalankan Mode Pengembangan (*Development*)

```bash
npm run dev
```

Buka URL lokal yang ditampilkan oleh Vite di terminal (umumnya `http://localhost:5173`).

### 3. Build Produksi & Preview

Untuk membuat *bundle* produksi ke folder `dist/` dan mengujinya secara lokal:

```bash
npm run build
npm run preview
```

### 4. Menjalankan dengan Docker (Opsional)

Proyek ini dilengkapi `Dockerfile` berbasis `nginx:alpine` yang berjalan pada port `8080`:

```bash
docker build -t flagged .
docker run -p 8080:8080 flagged
```

Kemudian buka `http://localhost:8080` di browser.

---

## Struktur Proyek

```text
├── public/              # Aset statis (favicon)
├── src/
│   ├── App.jsx          # Komponen utama, data skenario, minigame, dan logika game
│   ├── main.jsx         # Entry point React
│   └── index.css        # Konfigurasi Tailwind CSS v4 dan tema Office Blue
├── index.html           # Template HTML utama (Vite)
├── vite.config.js       # Konfigurasi Vite
├── package.json         # Daftar dependensi dan skrip npm
└── Dockerfile           # Konfigurasi kontainer produksi
```

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT — lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
