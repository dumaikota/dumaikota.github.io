export function render(container, session) {
  const dataKey = "disposisi_data";
  const data = JSON.parse(localStorage.getItem(dataKey) || "[]");
  const role = session.role;
  const isCamat = role === "camat" || role === "admin";
  const isSekcam = role === "sekcam";
  const isSubagtu = role === "subagtu";

  container.innerHTML = `
    <div class="card">
      <h2>Disposisi Surat</h2>
      ${
        isSekcam
          ? "<p><b>Mode:</b> Sekcam hanya dapat membaca dan meneruskan disposisi.</p>"
          : isSubagtu
          ? "<p><b>Mode:</b> Subag TU hanya dapat menambahkan disposisi baru.</p>"
          : "<p><b>Mode:</b> Camat/Admin memiliki akses penuh.</p>"
      }
      ${
        !isSekcam
          ? `<form id='formDisposisi'>
              <label>Nomor Surat:</label><input id='noSurat' required />
              <label>Isi Disposisi:</label><textarea id='isiDisposisi' required></textarea>
              <label>Diteruskan Kepada:</label><input id='diteruskan' placeholder='Nama penerima / jabatan' />
              <button type='submit' class='action'>Simpan</button>
            </form>`
          : ""
      }
      <button id='btnPDF' class='action'>Export PDF</button>
      <table id='tabelDisposisi'>
        <thead><tr><th>No Surat</th><th>Isi</th><th>Diteruskan</th>${isCamat ? "<th>Aksi</th>" : ""}</tr></thead>
        <tbody></tbody>
      </table>
    </div>`;

  const tbody = container.querySelector("#tabelDisposisi tbody");
  const renderTable = () => {
    tbody.innerHTML = data.map((d, i) => `
      <tr>
        <td>${d.no}</td><td>${d.isi}</td><td>${d.diteruskan || "-"}</td>
        ${isCamat ? `<td><button data-del='${i}' class='action' style='background:#d9534f;'>Hapus</button></td>` : ""}
      </tr>`).join("");

    if (isCamat) {
      tbody.querySelectorAll("[data-del]").forEach(btn => {
        btn.addEventListener("click", () => {
          data.splice(parseInt(btn.dataset.del), 1);
          localStorage.setItem(dataKey, JSON.stringify(data));
          renderTable();
        });
      });
    }
  };

  if (!isSekcam) {
    const form = container.querySelector("#formDisposisi");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      data.push({ no: noSurat.value, isi: isiDisposisi.value, diteruskan: diteruskan.value });
      localStorage.setItem(dataKey, JSON.stringify(data));
      form.reset();
      renderTable();
    });
  }

  document.getElementById("btnPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Daftar Disposisi Surat", 10, 10);
    let y = 20;
    data.forEach((d, i) => { doc.text(`${i + 1}. ${d.no} | ${d.isi} | ${d.diteruskan || "-"}`, 10, y); y += 10; });
    doc.save("disposisi.pdf");
  });
  renderTable();
}