// modules/print/print.js
// Versi stabil dan ringan — tanpa logo, aman di GitHub Pages

window.generateAgendaPDF = function (data, wilayah = "Kecamatan Dumai Kota") {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  // ===== Header =====
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("PEMERINTAH KOTA DUMAI", 105, 18, { align: "center" });
  doc.text("KECAMATAN DUMAI KOTA", 105, 25, { align: "center" });

  doc.line(20, 29, 190, 29);
  doc.setFont("times", "normal");
  doc.setFontSize(11);

  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`LAPORAN AGENDA KEGIATAN`, 105, 40, { align: "center" });
  doc.text(`Wilayah: ${wilayah}`, 105, 47, { align: "center" });
  doc.text(`Tanggal Cetak: ${tanggalCetak}`, 105, 54, { align: "center" });

  // ===== Konten =====
  let y = 70;
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  if (!data.length) {
    doc.text("Tidak ada kegiatan yang tercatat.", 20, y);
  } else {
    data.forEach((a, i) => {
      const lines = [
        `${i + 1}. ${a.judul || "-"}`,
        `Tanggal/Waktu : ${a.tanggal || "-"} | ${a.waktu || "-"}`,
        `Lokasi         : ${a.lokasi || "-"}`,
        `Wilayah        : ${a.lokasiKerja || wilayah}`,
        `Jenis          : ${a.jenis || "-"}`,
        `Pejabat Hadir  : ${a.pejabat || "-"}`,
        `Keterangan     : ${a.keterangan || "-"}`,
        "",
      ];

      lines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 6;
      });
    });
  }

  // ===== Footer =====
  doc.line(20, 285, 190, 285);
  doc.setFontSize(9);
  doc.text(
    "Generated via dumaikota.github.io • Kecamatan Dumai Kota",
    105,
    292,
    { align: "center" }
  );

  // ===== Simpan PDF =====
  doc.save(`Agenda_${wilayah.replace(/\s+/g, "_")}.pdf`);
};
