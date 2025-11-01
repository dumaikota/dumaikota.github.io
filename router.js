// router.js
export async function navigate(route) {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const routes = {
    dashboard: () => import("./modules/dashboard.js"),
    disposisi: () => import("./modules/disposisi.js"),
    nota: () => import("./modules/nota_dinas.js"),
    tugas: () => import("./modules/surat_tugas.js"),
    agenda: () => import("./modules/agenda.js"),
  };

  const app = document.getElementById("app");
  app.innerHTML = "<p>Memuat...</p>";

  if (routes[route]) {
    const module = await routes[route]();
    app.innerHTML = "";
    module.render(app, session);
  } else {
    app.innerHTML = "<h2>Halaman tidak ditemukan.</h2>";
  }
}

// === Jalankan otomatis berdasarkan hash ===
document.addEventListener("DOMContentLoaded", () => {
  const initial = window.location.hash.replace("#", "") || "dashboard";
  navigate(initial);

  // kalau hash berubah (klik tombol nav, dll)
  window.addEventListener("hashchange", () => {
    const route = window.location.hash.replace("#", "");
    navigate(route);
  });
});
