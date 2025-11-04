// ========== Footer Quotes Kecamatan Dumai Kota ==========

// Auto-update tahun footer
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Daftar kutipan inspiratif, ASN berAKHLAK, humor ringan, dan semangat kelurahan
const quotes = [
  // --- Motivasi & Pelayanan Publik ---
  "Pelayanan publik yang baik berawal dari hati yang tulus.",
  "Kerja keras itu penting, tapi kerja ikhlas itu yang dihitung Tuhan.",
  "Jangan tunggu sempurna untuk mulai berbuat baik.",
  "Senyum ASN adalah tanda pelayanan dimulai.",
  "Baju dinas boleh sama, tapi niat melayani harus luar biasa.",
  "Disiplin bukan tekanan, tapi bentuk cinta pada pekerjaan.",
  "ASN bukan cuma aparatur, tapi penggerak perubahan.",
  "Setiap tanda tanganmu bisa membawa manfaat atau masalah, pilihlah manfaat.",
  "Pelayanan cepat bukan berarti terburu-buru, tapi tahu prioritas.",
  "Kalau warga datang tiga kali untuk urusan yang sama, artinya ada yang harus diperbaiki.",
  "Kantor yang rapi mencerminkan ASN yang siap melayani.",
  "Datang tepat waktu itu bukan prestasi, itu tanggung jawab.",
  "Kerja di pemerintahan bukan soal gaji, tapi soal arti.",
  "ASN sejati tidak menunggu perintah, tapi bergerak karena panggilan nurani.",
  "Tugas boleh berat, tapi jangan sampai niat jadi ringan.",
  "Pelayanan itu ibadah sosial, senyummu juga bagian dari pelayanan.",
  "ASN tangguh bukan yang tak pernah salah, tapi yang mau memperbaiki diri.",
  "Orang hebat melayani tanpa perlu disorot kamera.",
  "Pelayanan publik yang baik tidak perlu megah, cukup ramah dan cepat.",
  "Kantor yang hidup bukan karena pendingin ruangan, tapi semangat pegawainya.",
  
  // --- ASN berAKHLAK ---
  "BerAKHLAK bukan slogan, tapi pegangan.",
  "ASN yang kompeten tak hanya tahu, tapi mau terus belajar.",
  "Akuntabilitas dimulai dari kejujuran dalam hal kecil.",
  "Kolaborasi bukan soal jabatan, tapi niat kerja bersama.",
  "Harmonis itu ketika kantor tenang, kerja lancar, hati senang.",
  "Loyalitas itu bukan pada orang, tapi pada tugas dan negara.",
  "Adaptif bukan berarti ikut arus, tapi pandai menyesuaikan diri dengan perubahan.",
  "Berorientasi pelayanan itu bukan pilihan, tapi kewajiban.",
  "ASN berAKHLAK itu menjaga etika, bukan mencari celah.",
  "Integritas itu seperti parfum, tak perlu ditunjukkan tapi terasa.",
  "ASN cerdas bukan yang tahu banyak, tapi yang tahu cara membantu.",
  "ASN berAKHLAK bukan hanya di spanduk, tapi di sikap sehari-hari.",
  "Pelayanan dengan senyum itu gratis, tapi dampaknya mahal.",
  "Tegas boleh, tapi tetap sopan dan beretika.",
  "ASN yang baik bukan yang paling sibuk, tapi yang paling bermanfaat.",
  "Kita bukan bekerja untuk dinilai, tapi untuk memberi nilai.",
  "ASN sejati tahu kapan bicara, kapan mendengar.",
  "Bekerja di pemerintahan itu bukan soal posisi, tapi kontribusi.",
  "ASN yang hebat bukan yang banyak bicara, tapi yang banyak kerja nyata.",
  "BerAKHLAK bukan sekadar abjad, tapi arah hidup ASN yang beradab.",
  
  // --- Humor Ringan ASN ---
  "ASN sejati tahu: absen pagi itu ibadah, bukan formalitas.",
  "Kerjo elok tu bukan nunggu disuruh, tapi tahu diri.",
  "Kalau kopi sudah dingin tapi laporan belum kelar, berarti kita masih ASN normal.",
  "ASN tanpa tumpukan berkas ibarat kantor tanpa printer — mustahil!",
  "Hari Jumat tanpa senam pagi itu rasanya kayak gaji tanpa tunjangan.",
  "Kalau komputer error, sabar dulu, jangan langsung nyalahin admin.",
  "Surat masuk datangnya cepat, disposisinya kadang jalan kaki.",
  "ASN sejati tahu: waktu pulang itu fleksibel... tergantung atasan.",
  "WiFi kantor sering putus, tapi semangat pelayanan jangan ikut putus.",
  "Bikin laporan itu kayak masak gulai — butuh sabar dan rasa tanggung jawab.",
  "Birokrasi bukan lambat, cuma perfeksionis katanya 😄",
  "ASN yang suka senyum di pelayanan, bisa jadi baru cair tunjangannya.",
  "Printer kantor itu seperti ASN juga — kalau gak dirawat, mogok.",
  "Jangan tanya ASN, kenapa kerja sambil ngopi, itu SOP tak tertulis.",
  "ASN kalau rapat jam 9, datang jam 9.15 — itu pun prestasi.",
  "ASN itu bukan malas, cuma menyesuaikan kecepatan sistem.",
  "Tanda tangan basah itu bukti perjuangan, bukan sekadar formalitas.",
  "ASN itu kalau cuti, masih mikirin laporan yang belum selesai.",
  "Surat kelurahan itu sakti — kadang bisa lebih cepat dari sinyal.",
  "ASN sejati tahu, yang lebih cepat dari disposisi cuma kabar tunjangan.",
  "ASN kalau senyum ke warga, biasanya habis dapat makan siang enak.",
  "Pelayanan publik kadang mirip sinetron, banyak dramanya tapi tetap selesai juga.",
  "ASN di kecamatan: bisa disuruh semua hal, dari surat sampai bikin kopi.",
  "Senyum ASN itu multitasking — bisa sopan, bisa nyindir halus.",
  "ASN yang sabar menghadapi warga berarti sudah naik pangkat spiritual.",
  "Kalau server ngadat, biasanya doa ASN naik paling kencang.",
  "ASN gak takut perubahan, yang ditakuti cuma listrik padam waktu entry data.",
  "Disposisi lambat bukan malas, kadang kertasnya hilang di tumpukan duniawi.",
  "ASN pinter itu yang bisa nyari berkas tanpa bikin berantakan.",
  "ASN kalau dapat ucapan terima kasih dari warga, rasanya lebih nikmat dari kopi robusta.",
  "ASN itu punya dua keahlian: ngetik cepat dan pura-pura gak stres.",
  "ASN kalau bilang 'bentar ya, Pak', itu bisa berarti lima menit atau lima jam.",
  "ASN di Dumai: kerja pakai hati, bukan pakai jam.",
  "ASN bukan robot — tapi kalau jam 12 belum makan, bisa error juga.",
  "ASN suka bilang 'nanti sore siap' — kadang maksudnya sore minggu depan.",
  "ASN dan fotokopi: dua hal yang tak terpisahkan sejak awal republik.",
  "ASN sejati tahu bedanya 'siap, Pak' dan 'baik, nanti dicek dulu ya, Pak'.",
  "ASN itu bukan sekadar jabatan, tapi gaya hidup tenang tapi pasti.",
  "ASN kalau rapat zoom, pasti ada yang nanya 'suara saya masuk nggak ya?'.",
  "ASN hebat itu bukan yang bisa kerja cepat, tapi yang bisa kerja walau printer ngambek.",
  "ASN dan birokrasi itu seperti cinta lama yang tak bisa lepas.",
  
  // --- Gotong Royong & Semangat Kecamatan ---
  "Kecamatan maju karena lurah dan warganya bersatu.",
  "Kelurahan kuat karena warganya kompak dan peduli.",
  "Camat bukan bos, tapi koordinator semangat.",
  "Kerja di kelurahan itu bukan cuma urus surat, tapi urus kepercayaan warga.",
  "Gotong royong itu tradisi, bukan kegiatan tahunan.",
  "Sapu lidi kuat karena diikat, begitu juga masyarakat karena kerja sama.",
  "Kecamatan yang hebat bukan yang punya gedung tinggi, tapi pelayanan yang rendah hati.",
  "Lurah bijak bukan yang paling banyak bicara, tapi paling banyak mendengar.",
  "Warga tertib karena teladan, bukan karena pengawasan.",
  "Senyum perangkat kelurahan bisa menenangkan warga lebih dari pengumuman formal.",
  "Kecamatan itu rumah besar, di mana semua warga punya peran.",
  "Kelurahan yang baik bukan yang sepi keluhan, tapi cepat tanggap bila ada keluhan.",
  "Camat yang kuat karena punya lurah-lurah hebat.",
  "Kecamatan sukses karena ada operator yang setia meski hujan data datang.",
  "Pelayanan kelurahan itu ibarat nasi uduk — sederhana tapi bikin nyaman.",
  "Kecamatan Dumai Kota itu bukan sekadar wilayah, tapi keluarga besar yang bekerja untuk warga.",
  "Di kantor camat, kerja keras tak butuh sorotan, cukup hasil yang terasa.",
  "Warga datang bukan gangguan, tapi alasan kita ada di sini.",
  "Kecamatan itu jantung pelayanan publik, detaknya adalah ASN-nya.",
  "Lurah dan camat bukan dua jabatan, tapi dua tangan yang saling bantu.",
  "Gotong royong itu bukan nostalgia, tapi solusi nyata.",
  "Kantor kecil tak masalah, asal semangatnya besar.",
  "ASN kecamatan itu serba bisa — dari tanda tangan sampai masang spanduk.",
  "Warga puas, ASN pun tenang. Itu baru pelayanan tuntas.",
  "Kelurahan hidup kalau pegawainya turun ke lapangan, bukan hanya ke rapat.",
  "Sampah bisa diangkat, tapi semangat jangan sampai turun.",
  "Kecamatan yang bersih dimulai dari ASN yang peduli.",
  "Kerjasama antar kelurahan bikin Dumai makin nyaman.",
  "ASN kelurahan itu super hero tanpa jubah.",
  "Bersama kita melayani, bukan bersaing."
];

// Ganti kutipan setiap 5 menit
function updateQuote() {
  const quoteBox = document.getElementById("quote-text");
  if (quoteBox) {
    const random = Math.floor(Math.random() * quotes.length);
    quoteBox.textContent = `"${quotes[random]}"`;
  }
}

updateQuote();
setInterval(updateQuote, 300000);
