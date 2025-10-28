// === AGENDA PEJABAT DUMAI KOTA - VERSI ROLE OTOMATIS ===

// Identifikasi user login
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
  window.location.href = '../pages/login.html';
}

// Tentukan wilayah sesuai role user
let wilayah = "kecamatan"; // default
let judulWilayah = "Kecamatan Dumai Kota";

if (currentUser.role.includes("LURAH") || currentUser.role.includes("SEKEL")) {
  wilayah = currentUser.role.split("_")[1].toLowerCase(); // contoh: lurah_sukajadi -> "sukajadi"
  judulWilayah = "Kelurahan " + wilayah.charAt(0).toUpperCase() + wilayah.slice(1);
}

const storageKey = `agenda_${wilayah}`;
let agendaList = JSON.parse(localStorage.getItem(storageKey)) || [];

// Simpan data agenda sesuai wilayah
function saveAgenda() {
  localStorage.setItem(storageKey, JSON.stringify(agendaList));
}

// === Fungsi Urut Berdasarkan Waktu ===
function sortAgendaByTime(list) {
  return list.sort((a, b) => {
    const t1 = a.pukul || '00:00';
    const t2 = b.pukul || '00:00';
    return t1.localeCompare(t2);
  });
}

// === Elemen Form dan Tombol ===
const form = document.getElementById('agendaForm');
const tableBody = document.querySelector('#agendaTable tbody');
const copyBtn = document.getElementById('copyWA');
const printBtn = document.getElementById('printPDF');

// === Render Tabel ===
function renderTable() {
  tableBody.innerHTML = '';
  const sorted = sortAgendaByTime(agendaList);
  sorted.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.tanggal || '-'}</td>
      <td>${item.pukul || '-'}</td>
      <td>${item.acara || '-'}</td>
      <td>${item.lokasi || '-'}</td>
      <td>${item.pejabat || '-'}</td>
      <td><button onclick="deleteAgenda(${index})">Hapus</button></td>
    `;
    tableBody.appendChild(tr);
  });

  // Update judul halaman
  document.querySelector('h2').textContent = `📅 Agenda ${judulWilayah}`;
}

// === Hapus Agenda ===
function deleteAgenda(i) {
  agendaList.splice(i, 1);
  saveAgenda();
  renderTable();
}

// === Tambah Agenda Baru ===
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    tanggal: document.getElementById('tanggal').value,
    pukul: document.getElementById('pukul').value || 'Belum ditentukan',
    acara: document.getElementById('acara').value.trim() || 'Belum ditentukan',
    lokasi: document.getElementById('lokasi').value.trim() || 'Belum ditentukan',
    pejabat: document.getElementById('pejabat').value.trim() || 'Belum ditentukan'
  };
  agendaList.push(data);
  saveAgenda();
  form.reset();
  renderTable();
});

// === Salin ke WhatsApp (Format Final + Role-Aware) ===
copyBtn.addEventListener('click', () => {
  if (!agendaList.length) return alert('Belum ada agenda hari ini.');

  const sorted = sortAgendaByTime(agendaList);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  let output = `**AGENDA PEJABAT ${judulWilayah.toUpperCase()} HARI INI:**\n📅: ${today}\n-------------------------\n`;

  sorted.forEach((item, index) => {
    output += `\n⏰: \`${item.pukul}\` WIB\n\n`;
    output += `📝: \`${item.acara}\`\n\n`;
    output += `📍: \`${item.lokasi}\`\n\n`;
    output += `*Dihadiri oleh :*\n*${item.pejabat}*`;

    // Tambahkan separator hanya jika bukan agenda terakhir
    if (index < sorted.length - 1) {
      output += `\n===================================\n`;
    }
    output += `\n\n`;
  });

  // Footer
  output += `\n\n**_CATATAN: Harap hadir lebih awal._**`;

  navigator.clipboard.writeText(output);
  alert('Agenda berhasil disalin ke clipboard (format WA).');
});

// === Cetak PDF (pakai print.js) ===
printBtn.addEventListener('click', () => {
  printAgendaLog(sortAgendaByTime(agendaList));
});

// === Render Saat Pertama Dijalankan ===
renderTable();
