export function render(container, session) {
  const dataKey = "disposisi_data";
  const data = JSON.parse(localStorage.getItem(dataKey) || "[]");
  const role = session.role;
  const isCamat = ["camat", "admin"].includes(role);
  const isSekcam = role === "sekcam";
  const isSubagtu = role === "subagtu";

  container.innerHTML = `
    <div class="card">
      <h2>Disposisi Surat</h2>
      ${
        isSekcam
          ? `<p><b>Mode:</b> Sekcam dapat membaca dan meneruskan disposisi.</p>`
          : isSubagtu
          ? `<p><b>Mode:</b> Subag TU dapat menambahkan disposisi baru.</p>`
          : `<p><b>Mode:</b> Camat/Admin memiliki akses penuh.</p>`
      }
      ${
        !isSekcam
          ? `
          <form id="formDisposisi">
            <label>Nomor Surat:</label><input id="noSurat" required />
            <label>Isi Disposisi:</label><textarea id="isiDisposisi" required></textarea>
            <label>Diteruskan Kepada:</label><input id="diteruskan" placeholder="Nama penerima / jabatan" />
            <button type="submit" class="action">Simpan</button>
          </form>
        `
          : ""
      }
      <button id="btnPDF" class="action small">🖨️ Cetak PDF</button>
      <table id="tabelDisposisi">
        <thead>
          <tr>
            <th>No Surat</th>
            <th>Isi Disposisi</th>
            <th>Diteruskan</th>
            <th>Dibuat Oleh</th>
            ${
              isCamat
                ? "<th>Aksi</th>"
                : isSekcam
                ? "<th>Teruskan</th>"
                : ""
            }
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  const tbody = container.querySelector("#tabelDisposisi tbody");

  const renderTable = () => {
    if (!tbody) return;
    tbody.innerHTML = data
      .map(
        (d, i) => `
        <tr>
          <td>${d.no}</td>
          <td>${d.isi}</td>
          <td>${d.diteruskan || "-"}</td>
          <td>${d.oleh}</td>
          ${
            isCamat
              ? `<td><button data-del="${i}" class="action small" style="background:#d9534f;">Hapus</button></td>`
              : isSekcam
              ? `<td><button data-fw="${i}" class="action small">Teruskan</button></td>`
              : ""
          }
        </tr>`
      )
      .join("");

    // hapus data (Camat/Admin)
    if (isCamat) {
      tbody.querySelectorAll("[data-del]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.del);
          data.splice(idx, 1);
          localStorage.setItem(dataKey, JSON.stringify(data));
          renderTable();
        })
      );
    }

    // teruskan disposisi (Sekcam)
    if (isSekcam) {
      tbody.querySelectorAll("[data-fw]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.fw);
          const forwarded = prompt(
            `Teruskan disposisi ${data[idx].no} ke:`,
            data[idx].diteruskan || ""
          );
          if (forwarded) {
            data[idx].diteruskan = forwarded;
            localStorage.setItem(dataKey, JSON.stringify(data));
            renderTable();
          }
        })
      );
    }
  };

  // form input (SubagTU, Camat, Admin)
  if (!isSekcam) {
    const form = container.querySelector("#formDisposisi");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const no = form.querySelector("#noSurat").value.trim();
      const isi = form.querySelector("#isiDisposisi").value.trim();
      const dit = form.querySelector("#diteruskan").value.trim();

      if (!no || !isi) {
        alert("Nomor surat dan isi disposisi wajib diisi!");
        return;
      }

      // cek duplikasi
      if (data.find((x) => x.no === no)) {
        alert("Nomor surat sudah ada di daftar!");
        return;
      }

      const newItem = {
        no,
        isi,
        diteruskan: dit,
        oleh: session.username,
        waktu: new Date().toLocaleString("id-ID"),
      };
      data.push(newItem);
      localStorage.setItem(dataKey, JSON.stringify(data));
      form.reset();
      renderTable();
    });
  }

  // cetak PDF
  document.getElementById("btnPDF")?.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = "./bw_dumai.png";

    logo.onload = () => {
      doc.addImage(logo, "PNG", 10, 8, 20, 20);
      doc.setFontSize(14);
      doc.text("PEMERINTAH KOTA DUMAI", 35, 15);
      doc.setFontSize(12);
      doc.text("KECAMATAN DUMAI KOTA", 35, 22);
      doc.setFontSize(10);
      doc.text("Laporan Disposisi Surat", 35, 29);
      doc.line(10, 33, 200, 33);

      let y = 40;
      data.forEach((d, i) => {
        doc.text(`${i + 1}. No: ${d.no}`, 10, y);
        doc.text(`Isi: ${d.isi}`, 20, y + 6);
        doc.text(`Diteruskan: ${d.diteruskan || "-"}`, 20, y + 12);
        doc.text(`Oleh: ${d.oleh}`, 20, y + 18);
        y += 26;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save("disposisi.pdf");
    };
  });

  renderTable();
}
