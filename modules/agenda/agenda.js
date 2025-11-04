// ========================= AGENDA FINAL BARANG BARU RASA LAMA =========================
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role") || "";
  const username = localStorage.getItem("username") || "";
  const roleInfo = document.getElementById("role-info");
  const inputSection = document.getElementById("agenda-input");
  const agendaList = document.getElementById("agendaList");
  const agendaForm = document.getElementById("agenda-form");
  const jenisSelect = document.getElementById("jenis");
  const jenisManual = document.getElementById("jenisManual");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const clearBtn = document.getElementById("clearStorage");

  // ====== PETA ROLE KE LOKASI ======
  const lokasiKerjaMap = {
    "Camat Dumai Kota": "Kecamatan Dumai Kota",
    "Sekretaris Camat Dumai Kota": "Kecamatan Dumai Kota",
    "Subbag Umum dan Kepegawaian": "Kecamatan Dumai Kota",
    "Subbag Perencanaan dan Keuangan": "Kecamatan Dumai Kota",
    "Kasi Pemerintahan": "Kecamatan Dumai Kota",
    "Kasi Ekonomi dan Pembangunan": "Kecamatan Dumai Kota",
    "Kasi Kesejahteraan Sosial": "Kecamatan Dumai Kota",
    "Kasi Ketentraman dan Ketertiban Umum": "Kecamatan Dumai Kota",

    "Lurah Dumai Kota": "Kelurahan Dumai Kota",
    "Sekretaris Kelurahan Dumai Kota": "Kelurahan Dumai Kota",
    "Lurah Bintan": "Kelurahan Bintan",
    "Sekretaris Kelurahan Bintan": "Kelurahan Bintan",
    "Lurah Laksamana": "Kelurahan Laksamana",
    "Sekretaris Kelurahan Laksamana": "Kelurahan Laksamana",
    "Lurah Sukajadi": "Kelurahan Sukajadi",
    "Sekretaris Kelurahan Sukajadi": "Kelurahan Sukajadi",
    "Lurah Rimba Sekampung": "Kelurahan Rimba Sekampung",
    "Sekretaris Kelurahan Rimba Sekampung": "Kelurahan Rimba Sekampung",
  };

  const lokasiKerja = lokasiKerjaMap[role] || "Wilayah Tidak Dikenal";
  roleInfo.textContent = `Anda login sebagai: ${role} (${lokasiKerja})`;

  // ====== LEVEL ROLE ======
  const isKecamatan = lokasiKerja.startsWith("Kecamatan");
  const isKelurahan = lokasiKerja.startsWith("Kelurahan");
  const storageKey = "agenda_global";
  let data = JSON.parse(localStorage.getItem(storageKey)) || [];

  // ====== Tambah Dropdown Filter Wilayah (Camat/Sekcam) ======
  const filterContainer = document.querySelector(".agenda-controls");
  let filterWilayah;

  if (role.includes("Camat") || role.includes("Sekretaris Camat")) {
    filterWilayah = document.createElement("select");
    filterWilayah.id = "filterWilayah";
    filterWilayah.innerHTML = `
      <option value="all">Semua Wilayah</option>
      <option value="Kecamatan Dumai Kota">Kecamatan Dumai Kota</option>
      <option value="Kelurahan Dumai Kota">Kelurahan Dumai Kota</option>
      <option value="Kelurahan Bintan">Kelurahan Bintan</option>
      <option value="Kelurahan Laksamana">Kelurahan Laksamana</option>
      <option value="Kelurahan Sukajadi">Kelurahan Sukajadi</option>
      <option value="Kelurahan Rimba Sekampung">Kelurahan Rimba Sekampung</option>
    `;
    filterContainer.appendChild(filterWilayah);
  }

  // ====== Input Jenis Manual ======
  jenisSelect.addEventListener("change", () => {
    if (jenisSelect.value === "manual") {
      jenisManual.style.display = "block";
      jenisManual.required = true;
    } else {
      jenisManual.style.display = "none";
      jenisManual.required = false;
    }
  });

  // ====== Format Pesan WhatsApp ======
  function formatWA(item) {
    return `📅 *${item.judul}*
🗓️ ${item.tanggal} | 🕐 ${item.waktu}
📍 ${item.lokasi} — ${item.lokasiKerja}
📂 ${item.jenis}
👤 ${item.pejabat}
📝 ${item.keterangan || "-"}`
  }

  // ====== Render Daftar Agenda ======
  function render(list) {
    agendaList.innerHTML = "";
    if (!list.length) {
      agendaList.innerHTML = "<p><em>Belum ada kegiatan.</em></p>";
      return;
    }

    list.forEach((a, i) => {
      const div = document.createElement("div");
      div.className = "agenda-card";
      const text = formatWA(a);
      const encoded = encodeURIComponent(text);
      div.innerHTML = `
        <pre>${text}</pre>
        <div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn-hapus" data-index="${i}" style="background:#dc3545;">Hapus</button>
          <button class="btn-simpan" onclick="navigator.clipboard.writeText(\`${text}\`)">Salin ke WhatsApp</button>
          <a class="btn-simpan" style="background:#25D366;text-decoration:none;" href="https://wa.me/?text=${encoded}" target="_blank">📤 Kirim ke WA Web</a>
        </div>
      `;
      agendaList.appendChild(div);
    });

    // Tombol Hapus
    document.querySelectorAll(".btn-hapus").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.dataset.index;
        data.splice(idx, 1);
        saveData();
        render(filterForUser());
      });
    });
  }

  function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  // ====== Tambah Agenda ======
  agendaForm.addEventListener("submit", e => {
    e.preventDefault();
    const jenisValue = jenisSelect.value === "manual" ? jenisManual.value : jenisSelect.value;

    const agenda = {
      judul: document.getElementById("judul").value.trim(),
      tanggal: document.getElementById("tanggal").value,
      waktu: document.getElementById("waktu").value,
      lokasi: document.getElementById("lokasi").value.trim(),
      jenis: jenisValue,
      pejabat: document.getElementById("pejabat").value.trim(),
      keterangan: document.getElementById("keterangan").value.trim(),
      lokasiKerja: lokasiKerja,
      dibuatOleh: `${username} (${role})`,
      dibuatPada: new Date().toLocaleString("id-ID")
    };

    data.push(agenda);
    saveData();
    render(filterForUser());
    agendaForm.reset();
    jenisManual.style.display = "none";
  });

  // ====== Filter Data ======
  function filterForUser() {
    let filtered = data;

    if (filterWilayah && filterWilayah.value !== "all") {
      filtered = filtered.filter(a => a.lokasiKerja === filterWilayah.value);
    }

    if (isKelurahan) {
      filtered = filtered.filter(a => a.lokasiKerja === lokasiKerja);
    }

    const key = searchInput.value.toLowerCase();
    const jenis = filterSelect.value;
    filtered = filtered.filter(a => {
      const matchText =
        a.judul.toLowerCase().includes(key) ||
        a.keterangan.toLowerCase().includes(key);
      const matchJenis = jenis === "all" || a.jenis === jenis;
      return matchText && matchJenis;
    });

    return filtered;
  }

  function applyFilters() {
    render(filterForUser());
  }

  searchInput.addEventListener("input", applyFilters);
  filterSelect.addEventListener("change", applyFilters);
  if (filterWilayah) filterWilayah.addEventListener("change", applyFilters);

  // ====== Hapus Semua ======
  clearBtn.addEventListener("click", () => {
    if (confirm("Hapus semua agenda di penyimpanan lokal?")) {
      localStorage.removeItem(storageKey);
      data = [];
      render(filterForUser());
    }
  });

  // ====== Render Awal ======
  render(filterForUser());

  // ====== EXPORT TO PDF ======
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "🖨️ Cetak Laporan PDF";
  exportBtn.className = "btn-simpan";
  exportBtn.style.background = "#ffc107";
  exportBtn.style.color = "#000";
  exportBtn.style.fontWeight = "600";
  exportBtn.style.marginLeft = "0.5rem";
  filterContainer.appendChild(exportBtn);

  exportBtn.addEventListener("click", () => {
    const filtered = filterForUser();
    if (filtered.length === 0) {
      alert("Tidak ada data agenda untuk dicetak.");
      return;
    }

    const printWindow = window.open("", "_blank");
    const tanggalCetak = new Date().toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const wilayahDipilih =
      filterWilayah && filterWilayah.value !== "all"
        ? filterWilayah.value
        : lokasiKerja;

    let html = `
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Agenda - ${wilayahDipilih}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
        h1, h2, h3 { text-align: center; margin-bottom: 10px; }
        h1 { font-size: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; font-size: 12px; }
        th { background-color: #eee; }
        .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #555; }
      </style>
    </head>
    <body>
      <h1>AGENDA KEGIATAN ${wilayahDipilih.toUpperCase()}</h1>
      <h3>Kecamatan Dumai Kota</h3>
      <p style="text-align:center;font-size:12px;">Dicetak: ${tanggalCetak}</p>
      <table>
        <tr>
          <th>No</th>
          <th>Judul Kegiatan</th>
          <th>Tanggal</th>
          <th>Waktu</th>
          <th>Lokasi</th>
          <th>Jenis</th>
          <th>Pejabat yang Menghadiri</th>
          <th>Keterangan</th>
        </tr>
    `;

    filtered.forEach((a, i) => {
      html += `
        <tr>
          <td>${i + 1}</td>
          <td>${a.judul}</td>
          <td>${a.tanggal}</td>
          <td>${a.waktu}</td>
          <td>${a.lokasi} — ${a.lokasiKerja}</td>
          <td>${a.jenis}</td>
          <td>${a.pejabat}</td>
          <td>${a.keterangan || "-"}</td>
        </tr>
      `;
    });

    html += `
      </table>
      <div class="footer">
        Dicetak oleh: ${username} (${role})<br>
        ${lokasiKerja}
      </div>
    </body>
    </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  });
});
