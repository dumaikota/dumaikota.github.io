// ===========================================
// Layout Loader + Auth Middleware (FINAL FIX)
// Barang Baru Rasa Lama — Kecamatan Dumai Kota
// ===========================================

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isLoginPage = path.includes("/modules/login/login.html");

  // ====== Proteksi Login Umum ======
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username || !role) {
    if (!isLoginPage) {
      alert("Anda harus login untuk mengakses halaman ini.");
      const loginPath = path.includes("/modules/")
        ? "../../modules/login/login.html"
        : "./modules/login/login.html";
      window.location.href = loginPath;
      return;
    }
  } else if (isLoginPage) {
    window.location.href = "../../index.html";
    return;
  }

  // ====== Path Relatif untuk Komponen ======
  const prefix = path.includes("/modules/") ? "../../components/" : "./components/";

  // ====== Muat Header dan Footer (FIX selector) ======
  const loadComponent = (selector, filePath) => {
    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error(`Gagal memuat ${filePath}`);
        return res.text();
      })
      .then(html => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;

        if (filePath.includes("header.html")) setupUserUI();
        if (filePath.includes("footer.html")) loadQuotes(prefix);
      })
      .catch(err => console.error("❌ Layout Error:", err));
  };

  // ===== FIXED =====
  loadComponent("#header", prefix + "header/header.html");
  loadComponent("#footer", prefix + "footer/footer.html");

  // ====== Setup Username & Logout ======
  function setupUserUI() {
    const display = localStorage.getItem("displayName") || localStorage.getItem("role") || "Pengguna";
    const usernameEl = document.getElementById("username-display");
    const logoutBtn = document.getElementById("logout-btn");

    if (usernameEl) usernameEl.textContent = `Halo, ${display}`;

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("Yakin ingin logout?")) {
          localStorage.clear();
          const loginPath = path.includes("/modules/")
            ? "../../modules/login/login.html"
            : "./modules/login/login.html";
          window.location.href = loginPath;
        }
      });
    }
  }

  // ====== Muat Quotes & Jam Footer ======
  function loadQuotes(prefix) {
    const script = document.createElement("script");
    script.src = prefix + "footer/quotes.js";
    script.defer = true;
    document.body.appendChild(script);
  }

  // ====== Proteksi Role Berdasarkan Meta ======
  function checkAllowedRoles() {
    const meta = document.querySelector('meta[name="allowed-roles"]');
    if (!meta) return;

    const allowed = meta.content.split(",").map(r => r.trim().toLowerCase());
    const userRole = (localStorage.getItem("role") || "").toLowerCase();

    if (!allowed.includes(userRole)) {
      alert("Akses ditolak. Anda tidak memiliki izin membuka halaman ini.");
      const homePath = path.includes("/modules/")
        ? "../../index.html"
        : "./index.html";
      window.location.href = homePath;
    }
  }

  setTimeout(checkAllowedRoles, 300);
});
