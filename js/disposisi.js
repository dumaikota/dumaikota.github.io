// Modul Disposisi v4 Hybrid Input
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { role: 'CAMAT', username: 'camat' };
const { jsPDF } = window.jspdf;
const tableBody = document.querySelector('#disposisiTable tbody');
const form = document.getElementById('disposisiForm');
const inputMode = document.getElementById('inputMode');
const uploadSection = document.getElementById('uploadSection');
const extractBtn = document.getElementById('extractBtn');
const statusEl = document.getElementById('extractStatus');
let disposisiList = JSON.parse(localStorage.getItem('disposisiList')) || [];

inputMode.addEventListener('change', () => {
  uploadSection.style.display = inputMode.value === 'manual' ? 'none' : 'block';
});

extractBtn.addEventListener('click', async () => {
  const file = document.getElementById('fileUpload').files[0];
  if (!file) return alert('Pilih file surat terlebih dahulu.');
  statusEl.textContent = '🔄 Memproses file...';

  if (inputMode.value === 'gambar') {
    const { data: { text } } = await Tesseract.recognize(file, 'ind');
    parseAndFill(text);
  } else if (inputMode.value === 'srikandi') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(it => it.str).join(' ');
    }
    parseAndFill(fullText);
  }
});

function parseAndFill(text) {
  statusEl.textContent = '✅ Data berhasil dibaca.';
  const nomor = text.match(/Nomor[:\s]*([A-Z0-9\/.-]+)/i);
  const perihal = text.match(/Perihal[:\s]*(.+)/i);
  const tanggal = text.match(/\d{1,2}\s[a-zA-Z]+\s\d{4}/i);
  const dari = text.match(/Dari[:\s]*(.+)/i);
  if (nomor) document.getElementById('noSurat').value = nomor[1].trim();
  if (perihal) document.getElementById('perihal').value = perihal[1].trim();
  if (tanggal) document.getElementById('tanggalSurat').value = new Date(tanggal[0]).toISOString().split('T')[0];
  if (dari) document.getElementById('dari').value = dari[1].trim();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    noSurat: noSurat.value,
    tanggalSurat: tanggalSurat.value,
    dari: dari.value,
    perihal: perihal.value,
    sifat: sifat.value,
    tujuan: tujuan.value.split(',').map(t => t.trim()).filter(Boolean),
    catatan: catatan.value,
    status: 'baru'
  };
  disposisiList.push(data);
  localStorage.setItem('disposisiList', JSON.stringify(disposisiList));
  renderTable();
  alert('✅ Disposisi disimpan!');
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = '';
  disposisiList.forEach((d, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.noSurat}</td><td>${d.tanggalSurat}</td><td>${d.perihal}</td>
    <td>${d.dari}</td><td>${d.sifat}</td><td>${d.tujuan.join(', ')}</td><td>${d.catatan}</td>
    <td><button onclick="printDisposisi(${i})">🖨 Cetak</button></td>`;
    tableBody.appendChild(tr);
  });
}

function printDisposisi(i) {
  const d = disposisiList[i];
  const doc = new jsPDF({ format: 'a5' });
  doc.addImage('../img/bw_dumai.png', 'PNG', 20, 10, 20, 20);
  doc.setFont('Times', 'Bold'); doc.setFontSize(12);
  doc.text('PEMERINTAH KOTA DUMAI', 105, 18, { align: 'center' });
  doc.text('KECAMATAN DUMAI KOTA', 105, 25, { align: 'center' });
  doc.setFont('Times', 'Normal'); doc.setFontSize(9);
  doc.text('Jl. Pattimura 28821 Dumai - Riau', 105, 31, { align: 'center' });
  doc.line(20, 34, 190, 34);
  doc.setFont('Times', 'Bold'); doc.setFontSize(11);
  doc.text('LEMBAR DISPOSISI', 105, 42, { align: 'center' });
  doc.line(80, 43, 130, 43);
  doc.setFont('Helvetica', 'Normal'); doc.setFontSize(9);
  let y = 55;
  doc.text(`Nomor Surat : ${d.noSurat}`, 20, y);
  doc.text(`Tanggal Surat : ${d.tanggalSurat}`, 100, y);
  y += 7; doc.text(`Dari : ${d.dari}`, 20, y);
  y += 7; doc.text(`Perihal : ${d.perihal}`, 20, y);
  y += 7; doc.text(`Sifat : ${d.sifat}`, 20, y);
  y += 7;
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Tanggal Disposisi : Dumai, ${today}`, 20, y);
  y += 8;
  doc.text('Diteruskan Kepada :', 20, y);
  y += 6; d.tujuan.forEach((t, i2) => doc.text(`- ${t}`, 25, y + (i2 * 6)));
  y += d.tujuan.length * 6 + 7;
  doc.text('Catatan :', 20, y);
  y += 6; doc.text(d.catatan || '-', 25, y, { maxWidth: 150 });
  const jamCetak = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const footer = 'Dicetak otomatis via\nAplikasi Manajemen Kontrol Kecamatan Dumai Kota\n' + `pada pukul: ${jamCetak} WIB`;
  y += 15; doc.setFont('Helvetica', 'Italic'); doc.setFontSize(7);
  doc.text(footer, 105, y, { align: 'center' });
  doc.save(`Disposisi_${d.noSurat}.pdf`);
}

renderTable();