// Modul Disposisi v3 (A5 Resmi)
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) window.location.href = '../pages/login.html';

const tableBody = document.querySelector('#disposisiTable tbody');
const form = document.getElementById('disposisiForm');
const logoutBtn = document.getElementById('logoutBtn');
let disposisiList = JSON.parse(localStorage.getItem('disposisiList')) || [];

function saveDisposisi() {
  localStorage.setItem('disposisiList', JSON.stringify(disposisiList));
}

function renderTable() {
  tableBody.innerHTML = '';
  let visibleList = [];

  if (["CAMAT", "KASUBAG_TU", "SEKCAM"].includes(currentUser.role)) visibleList = disposisiList;
  else visibleList = disposisiList.filter(d => d.tujuan.some(t => t.toLowerCase().includes(currentUser.username.toLowerCase())));

  visibleList.forEach((d, i) => {
    let actions = `<button onclick="printDisposisi(${i})">🖨 Cetak</button>`;
    if (currentUser.role === "SEKCAM" && d.status === "baru") actions += `<button onclick="teruskanDisposisi(${i})">↪️ Teruskan</button>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.noSurat}</td><td>${d.tanggalSurat}</td><td>${d.perihal}</td><td>${d.dari}</td>
      <td>${d.sifat}</td><td>${d.tujuan.join(", ")}</td>
      <td>${d.catatan || '-'}${d.catatanSekcam ? '<br><b>Instruksi Sekcam:</b> ' + d.catatanSekcam : ''}</td>
      <td>${actions}</td>`;
    tableBody.appendChild(tr);
  });
}

if (!["CAMAT", "KASUBAG_TU"].includes(currentUser.role)) form.style.display = "none";

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    noSurat: document.getElementById('noSurat').value.trim(),
    tanggalSurat: document.getElementById('tanggalSurat').value,
    dari: document.getElementById('dari').value.trim(),
    perihal: document.getElementById('perihal').value.trim(),
    sifat: document.getElementById('sifat').value,
    tujuan: document.getElementById('tujuan').value.split(',').map(t => t.trim()).filter(t => t !== ""),
    catatan: document.getElementById('catatan').value.trim(),
    catatanSekcam: "", status: "baru"
  };
  disposisiList.push(data); saveDisposisi(); form.reset(); renderTable();
  alert('Disposisi berhasil disimpan!');
});

function teruskanDisposisi(i) {
  const data = disposisiList[i];
  const tambahanTujuan = prompt("Tambahkan tujuan tambahan (pisahkan dengan koma):", "");
  const tambahanCatatan = prompt("Tambahkan instruksi tambahan:", "");
  if (!tambahanTujuan && !tambahanCatatan) return;
  if (tambahanTujuan) data.tujuan.push(...tambahanTujuan.split(',').map(t => t.trim()).filter(t => t !== ""));
  if (tambahanCatatan) data.catatanSekcam = tambahanCatatan;
  data.status = "diteruskan"; saveDisposisi();
  alert("Disposisi berhasil diteruskan oleh Sekcam!"); renderTable();
}

function printDisposisi(i) {
  const data = disposisiList[i];
  const doc = new jsPDF({ format: "a5" });
  doc.addImage("../img/bw_dumai.png", "PNG", 20, 10, 20, 20);
  doc.setFont("Times", "Bold"); doc.setFontSize(12);
  doc.text("PEMERINTAH KOTA DUMAI", 105, 18, { align: "center" });
  doc.text("KECAMATAN DUMAI KOTA", 105, 25, { align: "center" });
  doc.setFont("Times", "Normal"); doc.setFontSize(9);
  doc.text("Jl. Pattimura 28821 Dumai - Riau", 105, 31, { align: "center" });
  doc.line(20, 34, 190, 34); doc.setFont("Times", "Bold");
  doc.setFontSize(11); doc.text("LEMBAR DISPOSISI", 105, 42, { align: "center" });
  doc.line(80, 43, 130, 43);

  doc.setFont("Helvetica", "Normal"); doc.setFontSize(9);
  let y = 55;
  doc.text(`Nomor Surat : ${data.noSurat}`, 20, y);
  doc.text(`Tanggal Surat : ${data.tanggalSurat}`, 100, y);
  y += 7; doc.text(`Dari : ${data.dari}`, 20, y);
  y += 7; doc.text(`Perihal : ${data.perihal}`, 20, y);
  y += 7; doc.text(`Sifat : ${data.sifat}`, 20, y);
  y += 7;
  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`Tanggal Disposisi : Dumai, ${today}`, 20, y);
  y += 8; doc.text("Diteruskan Kepada :", 20, y);
  y += 6; data.tujuan.forEach((t, i2) => doc.text(`- ${t}`, 25, y + (i2 * 6)));
  y += data.tujuan.length * 6 + 7; doc.text("Catatan :", 20, y);
  y += 6; doc.text(data.catatan || "-", 25, y, { maxWidth: 150 });

  if (data.catatanSekcam) {
    y += 10; doc.setFont("Helvetica", "Bold");
    doc.text("Instruksi Sekcam :", 20, y);
    y += 6; doc.setFont("Helvetica", "Normal");
    doc.text(data.catatanSekcam, 25, y, { maxWidth: 150 });
  }

  const now = new Date();
  const jamCetak = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const footerText = "Dicetak otomatis via\nAplikasi Manajemen Kontrol Kecamatan Dumai Kota\n" + `pada pukul: ${jamCetak} WIB`;
  y += 12; doc.setFont("Helvetica", "Italic"); doc.setFontSize(7);
  doc.text(footerText, 105, y, { align: "center" });
  doc.save(`Disposisi_${data.noSurat}.pdf`);
}

logoutBtn.addEventListener('click', () => { localStorage.removeItem('currentUser'); window.location.href = '../pages/login.html'; });
renderTable();