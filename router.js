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

  try {
    if (routes[route]) {
      const module = await routes[route]();
      app.innerHTML = "";
      module.render(app, session);
    } else {
      app.innerHTML = "<h2>Halaman tidak ditemukan.</h2>";
    }
  } catch (err) {
    console.error("Gagal memuat modul:", err);
    app.innerHTML = `<div class="card"><h3>❌ Error memuat halaman</h3><p>${err.message}</p></div>`;
  }
}

// --- Jalankan otomatis sesuai hash / default ---
function loadRoute() {
  const hash = window.location.hash.replace("#", "");
  const route = hash || "dashboard";
  navigate(route);
}

window.addEventListener("hashchange", loadRoute);
document.addEventListener("DOMContentLoaded", loadRoute);
