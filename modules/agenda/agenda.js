document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role") || "";
  const roleInfo = document.getElementById("roleInfo");
  const inputSection = document.getElementById("inputSection");
  const agendaList = document.getElementById("agendaList");
  const agendaForm = document.getElementById("agendaForm");
  const jenisSelect = document.getElementById("jenis");
  const jenisManual = document.getElementById("jenisManual");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const clearBtn = document.getElementById("clearStorage");

  roleInfo.textContent = `Anda login sebagai: ${role}`;

  // Tentukan apakah role = Kecamatan atau Kelurahan
  const isKecamatan = [
    "Camat Dumai Kota",
    "Sekretaris Camat Dumai Kota",
    "Subbag Umum dan Kepegawaian",
    "Subbag Perencanaan dan Keuangan"
  ].includes(role);

  const isKelurahan = role.startsWith("Lurah") || role.startsWith("Sekretaris Kelurahan");

  if (isKecamatan || isKelurahan) inputSection.classList.remove("hidden");

  const storageKey = isKecamatan ? "agenda_kecamatan" : "agenda_kelurahan";
  let data = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Toggle input manual
  jenisSelect.addEventListener("change", () => {
    if (jenisSelect.value === "manual") {
      jenisManual.style.display = "block";
      jenisManual.required = true;
    } else {
      jenisManual.style.display = "none";
      jenisManual.required = false;
    }
  });

  function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function formatWA(item) {
    return `📅 *${item.judul}*
🗓️ ${item.tanggal} | 🕐 ${item.waktu}
📍 ${item.lokasi}
📂 ${item.jenis}
👤 ${item.pejabat}
📝 ${item.keterangan || "-"}`;
  }

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
          <a class="btn-simpan" style="background:#25D366;text-decoration:none;" href="https://wa.me/?text=${encoded}" target="_blank">📤 Kirim ke WhatsApp Web</a>
        </div>
      `;
      agendaList.appendChild(div);
    });

    // Hapus per item
    document.querySelectorAll(".btn-hapus").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.dataset.index;
        data.splice(idx, 1);
        saveData();
        render(data);
      });
    });
  }

  // Tambah data
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
      keterangan: document.getElementById("keterangan").value.trim()
    };
    data.push(agenda);
    saveData();
    render(data);
    agendaForm.reset();
    jenisManual.style.display = "none";
  });

  // Hapus semua
  clearBtn.addEventListener("click", () => {
    if (confirm("Hapus semua agenda?")) {
      localStorage.removeItem(storageKey);
      data = [];
      render(data);
    }
  });

  function filterData() {
    const key = searchInput.value.toLowerCase();
    const jenis = filterSelect.value;
    const filtered = data.filter(a => {
      const matchText = a.judul.toLowerCase().includes(key) || a.keterangan.toLowerCase().includes(key);
      const matchJenis = jenis === "all" || a.jenis === jenis;
      return matchText && matchJenis;
    });
    render(filtered);
  }

  searchInput.addEventListener("input", filterData);
  filterSelect.addEventListener("change", filterData);

  render(data);
});
