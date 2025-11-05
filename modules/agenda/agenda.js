document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agendaForm");
  const list = document.getElementById("agendaList");
  const jenisSelect = document.getElementById("jenis");
  const jenisManual = document.getElementById("jenisManual");
  const filterSelect = document.getElementById("filterSelect");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearStorage");
  const printBtn = document.getElementById("printBtn");
  const waInput = document.getElementById("waNumber");
  const wilayahSelect = document.getElementById("wilayahSelect");

  let data = JSON.parse(localStorage.getItem("agenda_global")) || [];

  // Tampilkan input manual bila pilih "Lainnya"
  jenisSelect.addEventListener("change", () => {
    if (jenisSelect.value === "manual") {
      jenisManual.style.display = "block";
      jenisManual.focus();
    } else {
      jenisManual.style.display = "none";
      jenisManual.value = "";
    }
  });

  const fmt = (a) => `📅 *${a.judul}*
🗓️ ${a.tanggal} | 🕐 ${a.waktu}
📍 ${a.lokasi}
🏢 ${a.wilayah}
📂 ${a.jenis}
👤 ${a.pejabat}
📝 ${a.keterangan || "-"}`;

  function save() {
    localStorage.setItem("agenda_global", JSON.stringify(data));
  }

  function render(listData = data) {
    list.innerHTML = "";
    if (!listData.length) {
      list.innerHTML = "<p><em>Belum ada kegiatan.</em></p>";
      return;
    }

    listData.forEach((a, i) => {
      const card = document.createElement("div");
      card.className = "agenda-card";
      card.innerHTML = `
        <pre>${fmt(a)}</pre>
        <div class="agenda-card-actions">
          <button class="btn-simpan" data-i="${i}">📋 Salin</button>
          <button class="btn-cetak" data-i="${i}">📤 WA</button>
          <button class="btn-hapus" data-i="${i}">🗑️ Hapus</button>
        </div>`;
      list.appendChild(card);
    });

    // tombol hapus
    document.querySelectorAll(".btn-hapus").forEach((b) => {
      b.onclick = () => {
        const idx = b.dataset.i;
        data.splice(idx, 1);
        save();
        render();
      };
    });

    // tombol salin
    document.querySelectorAll(".btn-simpan").forEach((b) => {
      b.onclick = () => {
        navigator.clipboard.writeText(fmt(data[b.dataset.i]));
      };
    });

    // tombol WA
    document.querySelectorAll(".btn-cetak").forEach((b) => {
      b.onclick = () => {
        const nomor = waInput.value.replace(/\D/g, "");
        if (!nomor) return alert("Isi nomor WA tujuan (format 62...)");
        const pesan = encodeURIComponent(fmt(data[b.dataset.i]));
        window.open(`https://wa.me/${nomor}?text=${pesan}`, "_blank");
      };
    });
  }

  // simpan data baru
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const jenis =
      jenisSelect.value === "manual"
        ? jenisManual.value.trim()
        : jenisSelect.value;
    const item = {
      judul: document.getElementById("judul").value.trim(),
      tanggal: document.getElementById("tanggal").value,
      waktu: document.getElementById("waktu").value,
      lokasi: document.getElementById("lokasi").value.trim(),
      jenis,
      pejabat: document.getElementById("pejabat").value.trim(),
      keterangan: document.getElementById("keterangan").value.trim(),
      wilayah: wilayahSelect.value,
    };
    if (!item.judul) return alert("Judul wajib diisi.");
    data.push(item);
    save();
    form.reset();
    jenisManual.style.display = "none";
    render();
  });

  // hapus semua data
  clearBtn.onclick = () => {
    if (confirm("Hapus semua data agenda?")) {
      data = [];
      save();
      render();
    }
  };

  // filter dan pencarian
  searchInput.oninput = () => {
    const key = searchInput.value.toLowerCase();
    const filtered = data.filter(
      (a) =>
        a.judul.toLowerCase().includes(key) ||
        a.keterangan.toLowerCase().includes(key)
    );
    render(filtered);
  };

  filterSelect.onchange = () => {
    const j = filterSelect.value;
    render(j === "all" ? data : data.filter((a) => a.jenis === j));
  };

  // cetak PDF
  printBtn.onclick = () => {
    if (typeof generateAgendaPDF !== "function")
      return alert("print.js belum termuat!");
    const wilayah = wilayahSelect.value;
    const filtered = data.filter((a) => a.wilayah === wilayah);
    if (!filtered.length) return alert("Belum ada data untuk wilayah ini.");
    generateAgendaPDF(filtered, wilayah);
  };

  render();
});
