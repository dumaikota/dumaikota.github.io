// Modul Agenda Harian Pejabat
const form = document.getElementById('agendaForm');
const tableBody = document.querySelector('#agendaTable tbody');
const copyBtn = document.getElementById('copyWA');
const printBtn = document.getElementById('printPDF');

let agendaList = JSON.parse(localStorage.getItem('agendaList')) || [];

// Render tabel
function renderTable() {
  tableBody.innerHTML = '';
  agendaList.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.pukul}</td>
      <td>${item.acara}</td>
      <td>${item.lokasi}</td>
      <td>${item.pejabat}</td>
      <td><button onclick="deleteAgenda(${index})">Hapus</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

// Hapus agenda
function deleteAgenda(i) {
  agendaList.splice(i, 1);
  localStorage.setItem('agendaList', JSON.stringify(agendaList));
  renderTable();
}

// Tambah agenda
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    tanggal: document.getElementById('tanggal').value,
    pukul: document.getElementById('pukul').value,
    acara: document.getElementById('acara').value.trim(),
    lokasi: document.getElementById('lokasi').value.trim(),
    pejabat: document.getElementById('pejabat').value.trim()
  };
  agendaList.push(data);
  localStorage.setItem('agendaList', JSON.stringify(agendaList));
  form.reset();
  renderTable();
});

// Salin ke WA semua agenda hari ini
copyBtn.addEventListener('click', () => {
  if (!agendaList.length) return alert('Belum ada agenda hari ini.');

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  let output = `Agenda per :\n📅: ${today}\n-------------------------\n`;

  agendaList.forEach(item => {
    output += `⏰: ${item.pukul} WIB\n✉ : ${item.acara}\n📍: ${item.lokasi}\nDihadiri oleh :\n**\n${item.pejabat}\n\n`;
  });

  navigator.clipboard.writeText(output);
  alert('Agenda berhasil disalin ke clipboard (format WA).');
});

// Cetak PDF
printBtn.addEventListener('click', () => {
  printAgendaLog(agendaList);
});

// Render awal
renderTable();
