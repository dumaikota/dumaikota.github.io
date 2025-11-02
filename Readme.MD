<p align="center">
  <img src="assets/img/dumai.png" width="80">
  <img src="assets/img/dumai_idaman.png" width="100">
  <img src="assets/img/asn.png" width="80">
</p>

<h2 align="center">🏛️ APLIKASI KONTROL MANAJEMEN CAMAT DUMAI KOTA</h2>
<p align="center">
  <b>Versi v2.3 – Profesional, Interaktif, dan Humanis</b><br>
  <i>Berbasis Permendagri Nomor 1 Tahun 2023 tentang Tata Naskah Dinas</i>
</p>

---

## ✨ Fitur Unggulan
| Fitur | Deskripsi |
|--------|------------|
| **Header Tiga Logo** | Logo Pemerintah Kota Dumai, Dumai Idaman, dan ASN sejajar di bagian atas aplikasi |
| **Fade Transition** | Animasi lembut antar modul seperti portal <i>Srikandi</i> |
| **Markdown Editor** | Input isi surat (Disposisi, Nota Dinas, Surat Tugas) mendukung format **bold**, *italic*, dan daftar |
| **Surat Tugas Dinamis** | Form pegawai ASN yang dapat ditambah, otomatis berdasarkan role Camat/Lurah |
| **Agenda Harian + WhatsApp Output** | Preview format pesan WA lengkap dengan emoji dan bold text |
| **Kutipan ASN + Jam Real-Time** | Footer berisi *💬 Quotes by Camat Dumai Kota* dan jam WIB yang terus berjalan |
| **Animasi Fade-by-Character** | Kutipan muncul huruf demi huruf setiap 5 menit dengan animasi mengetik |
| **User Login + Logout** | Menampilkan nama pengguna aktif dan tombol logout di kanan atas |
| **Log Aktivitas (Camat Only)** | Camat dapat memantau seluruh aktivitas user aplikasi |

---

## 🧩 Struktur Modul
| Modul | Format Cetak | Deskripsi |
|--------|---------------|-----------|
| **Disposisi** | A5 (potret) | Lembar tindak lanjut surat masuk |
| **Nota Dinas** | Legal (potret) | Komunikasi internal resmi antar pejabat |
| **Surat Tugas** | Legal (potret) | Penugasan ASN dengan daftar pegawai dinamis |
| **Agenda Harian** | A4 (lanskap) | Jadwal kegiatan Camat dan staf |
| **Export / Import JSON** | – | Backup dan restore data lokal |
| **Log Aktivitas** | – | Hanya dapat diakses oleh Camat Dumai Kota |

---

## 💬 Quotes & Jam Real-Time
Aplikasi ini menampilkan kutipan ASN setiap 5 menit secara acak dari **300 kutipan inspiratif** bertema:
- Integritas ASN  
- Etos kerja dan kedisiplinan  
- Pelayanan publik dengan hati  
- Humor ringan ASN (sopan dan edukatif)

Tampil di footer transparan seperti berikut:

💬 Quotes by Camat Dumai Kota
"ASN sejati melayani dengan hati, bukan dengan janji."
Sabtu, 1 November 2025 • 21:59:41 WIB

yaml
Salin kode

---

## ⚙️ Teknologi Digunakan
- **HTML5**, **CSS3**, **JavaScript (ES6)**  
- **pdfmake.js** – generator PDF naskah dinas  
- **SimpleMDE Markdown Editor** – editor isi surat  
- **LocalStorage** – penyimpanan data lokal tanpa backend  
- **GitHub Pages** – hosting aplikasi statis  

---

## 🚀 Cara Update & Deploy
1. Jalankan `python3 build_v2_3.py`  
   → menghasilkan `DUMAI_KOTA_PATCH_v2_3.zip`
2. Ekstrak ZIP dan **replace** file berikut:
index.html
css/style.css
js/app.js

markdown
Salin kode
3. Commit via GitHub Desktop:
update: v2.3 footer quotes + fade character + clock

yaml
Salin kode
4. Push ke branch `main`
5. Akses aplikasi di:
👉 [https://dumaikota.github.io/](https://dumaikota.github.io/)

---

## 🧭 Lokasi & Identitas
**Kecamatan Dumai Kota – Pemerintah Kota Dumai, Riau**  
📍 Jl. Pattimura, Kel. Laksamana (Kode Pos 28821)  
📞 Telp. (0765) xxxx • 🌐 dumai.go.id  

---

## 👨‍💻 Pengembang
Dikembangkan untuk mendukung digitalisasi tata naskah dinas dan manajemen kinerja ASN  
**Kecamatan Dumai Kota – Pemerintah Kota Dumai**

© 2025 Aplikasi Kontrol Manajemen Camat Dumai Kota  
💬 *“Melayani dengan hati, bukan sekadar rutinitas.”*