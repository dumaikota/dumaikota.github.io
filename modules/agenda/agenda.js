document.addEventListener("DOMContentLoaded", () => {
  const agendaList = document.getElementById("agendaList");
  const agendaForm = document.getElementById("agendaForm");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const clearBtn = document.getElementById("clearStorage");
  const jenisSelect = document.getElementById("jenis");
  const jenisManualInput = document.getElementById("jenisManual");

  let agendaData = JSON.parse(localStorage.getItem("agendaData")) || [];

  // Tampilkan field manual bila user pilih "manual"
  jenisSelect.addEventListener("change", () => {
    if (jenisSelect.value === "manual") {
      jenisManualInput.style.display = "block";
      jenisManualInput.required = true;
    } else {
      jenisManualInput.style.display = "none";
      jenisManualInput.required = false;
    }
  });

  // Format output WhatsApp-friendly
  function formatForWhatsApp(item) {
    return (
`📅 *${item.judul}*
🗓️ ${item.tanggal} | 🕐 ${item.waktu}
📍 ${item.lokasi}
📂 ${item.jenis}
👤 ${item.pejabat}
📝 ${item.keterangan || "-"}`
    );
  }

  // Render daftar agenda
  function renderAgenda(list) {
    agendaList.innerHTML = "";
    if (list.length === 0) {
      agendaList.innerHTML = "<p>Tidak ada kegiatan yang sesuai.</p>";
      return;
    }

    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "agenda-card";
      card.innerHTML = `
        <pre>${formatForWhatsApp(item)}</pre>
        <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
          <button class="btn-hapus" data-index="${index}" style="background:#dc3545;">Hapus</button>
          <button class="btn-simpan" onclick="navigator.clipboard.writeText(\`${formatForWhatsApp(item)}\`)">Salin ke WhatsApp</button>
        </div>
      `;
      agendaList.appendChild(card);
    });

    document.querySelectorAll(".btn-hapus").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = e.target.dataset.index;
        agendaData.splice(i, 1);
        saveData();
        renderAgenda(agendaData);
      });
    });
  }

  function saveData() {
    localStorage.setItem("agendaData", JSON.stringify(agendaData));
  }

  function applyFilters() {
    const keyword = searchInput.value.toLowerCase();
    const jenis = filterSelect.value;
    const filtered = agendaData.filter(item => {
      const matchText =
        item.judul.toLowerCase().includes(keyword) ||
        item.keterangan.toLowerCase().includes(keyword);
      const matchJenis = jenis === "all" || item.jenis === jenis;
      return matchText && matchJenis;
    });
    renderAgenda(filtered);
  }

  // Tambah data
  agendaForm.addEventListener("submit", e => {
    e.preventDefault();
    const jenisValue =
      jenisSelect.value === "manual"
        ? jenisManualInput.value
        : jenisSelect.value;

    const newAgenda = {
      judul: document.getElementById("judul").value.trim(),
      tanggal: document.getElementById("tanggal").value,
      waktu: document.getElementById("waktu").value,
      lokasi: document.getElementById("lokasi").value.trim(),
      jenis: jenisValue,
      pejabat: document.getElementById("pejabat").value.trim(),
      keterangan: document.getElementById("keterangan").value.trim()
    };

    agendaData.push(newAgenda);
    saveData();
    agendaForm.reset();
    jenisManualInput.style.display = "none";
    renderAgenda(agendaData);
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus semua data agenda?")) {
      localStorage.removeItem("agendaData");
      agendaData = [];
      renderAgenda(agendaData);
    }
  });

  searchInput.addEventListener("input", applyFilters);
  filterSelect.addEventListener("change", applyFilters);
  renderAgenda(agendaData);
});
