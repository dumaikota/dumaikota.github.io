// ========================
// Modul Agenda Kecamatan
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const userRole = localStorage.getItem("role") || "Tidak Dikenal";
  const roleInfo = document.getElementById("role-info");
  const tools = document.getElementById("agenda-tools");

  if (roleInfo) roleInfo.textContent = `Role aktif: ${userRole}`;

  // Hanya role tertentu yang bisa menambah agenda
  const canEditRoles = [
    "Camat Dumai Kota",
    "Sekretaris Camat Dumai Kota",
    "Subbag Umum dan Kepegawaian",
    "Subbag Perencanaan dan Keuangan",
    "Lurah Dumai Kota",
    "Lurah Bintan",
    "Lurah Laksamana",
    "Lurah Rimba Sekampung",
    "Lurah Sukajadi",
    "Sekretaris Kelurahan Dumai Kota",
    "Sekretaris Kelurahan Bintan",
    "Sekretaris Kelurahan Laksamana",
    "Sekretaris Kelurahan Rimba Sekampung",
    "Sekretaris Kelurahan Sukajadi"
  ];

  if (canEditRoles.includes(userRole)) {
    tools.classList.remove("hidden");
  }

  // Tombol Tambah Agenda
  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      alert(`Fitur tambah agenda aktif untuk role: ${userRole}`);
      // TODO: buka form input agenda
    });
  }

  // Tombol Export
  const btnExport = document.getElementById("btnExport");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      alert("Export data agenda ke Excel (fitur pengembangan)");
    });
  }
});
