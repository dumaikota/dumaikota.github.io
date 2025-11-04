// ===============================
// Layout Loader + Auth Middleware
// - muat header/footer otomatis
// - inject quotes.js setelah footer dimuat
// - tampilkan username & logout
// - jika halaman modul men-set <meta name="allowed-roles">, lakukan pengecekan role
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // helper: tentukan prefix path ke /components/ dari halaman saat ini
  const getComponentsPrefix = () => {
    const path = window.location.pathname;
    // jika path mengandung /modules/ berarti file ada di modules/... sehingga components ada di ../../components/
    return path.includes("/modules/") ? "../../components/" : "./components/";
  };

  const componentsPrefix = getComponentsPrefix();

  const loadComponent = (selector, filePath) => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`Gagal memuat ${filePath} (${response.status})`);
        return response.text();
      })
      .then(html => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;

        // Jika footer dimuat, inject quotes.js dan waktu
        if (filePath.endsWith("footer/footer.html")) {
          // path quotes relative terhadap componentsPrefix
          const qPath = componentsPrefix + "footer/quotes.js";
          const script = document.createElement("script");
          script.src = qPath;
          script.defer = true;
          document.body.appendChild(script);
        }

        // setelah header dimuat, setup username display & logout
        if (filePath.endsWith("header/header.html")) {
          setupUserUI();
        }
      })
      .catch(err => {
        console.error("❌ Layout Loader Error:", err);
      });
  };

  // muat header & footer
  loadComponent("header", componentsPrefix + "header/header.html");
  loadComponent("footer", componentsPrefix + "footer/footer.html");

  // ========== User UI (display + logout) ==========
  function setupUserUI() {
    // attempt to find the username display element and logout button that exist inside the loaded header
    const usernameDisplay = document.getElementById("username-display");
    const logoutBtn = document.getElementById("logout-btn");

    // displayName prefer readable label; fallback to raw username key
    const displayName = localStorage.getItem("displayName") || localStorage.getItem("username") || "Pengguna";
    if (usernameDisplay) usernameDisplay.textContent = `Halo, ${displayName}`;

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (!confirm("Yakin ingin logout?")) return;
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("displayName");

        // redirect ke halaman login relatif terhadap current path
        const path = window.location.pathname;
        const loginPath = path.includes("/modules/") ? "../../modules/login/login.html" : "./modules/login/login.html";
        window.location.href = loginPath;
      });
    }
  }

  // ========== Auth Middleware ==========
  // Jika halaman menyertakan meta tag <meta name="allowed-roles" content="Role A,Role B,...">
  // maka hanya role yang tercantum yang boleh mengakses halaman.
  function checkAccessByMeta() {
    // ambil meta tag
    const meta = document.querySelector('meta[name="allowed-roles"]');
    if (!meta) return; // tidak ada pembatasan, biarkan akses

    const allowed = meta.getAttribute("content");
    if (!allowed) return;

    // buat array role yang di-allowed (trim tiap item)
    const allowedRoles = allowed.split(",").map(s => s.trim()).filter(Boolean);
    if (allowedRoles.length === 0) return;

    const currentRole = localStorage.getItem("role");
    if (!currentRole) {
      // belum login -> redirect ke form login
      alert("Anda harus login untuk mengakses halaman ini.");
      const path = window.location.pathname;
      const loginPath = path.includes("/modules/") ? "../../modules/login/login.html" : "./modules/login/login.html";
      window.location.href = loginPath;
      return;
    }

    // cek apakah role current ada di allowedRoles (exact match)
    const allowedMatch = allowedRoles.some(r => r.toLowerCase() === currentRole.toLowerCase());
    if (!allowedMatch) {
      alert("Akses ditolak. Anda tidak memiliki izin untuk membuka halaman ini.");
      // redirect ke home
      const homePath = window.location.pathname.includes("/modules/") ? "../../index.html" : "./index.html";
      window.location.href = homePath;
    }
  }

  // jalankan pengecekan akses setelah semuanya dimuat (tunggu sebentar agar meta tag dibaca)
  // gunakan setTimeout 200ms untuk memastikan meta ada dan header/footer sudah di-load
  setTimeout(checkAccessByMeta, 200);
});
