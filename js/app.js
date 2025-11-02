// ==========================================================
//  app.js — Sistem Tata Naskah Dinas Kecamatan Dumai Kota
//  Berdasarkan Permendagri No.1 Tahun 2023
// ==========================================================

// Fungsi decode Base64 (untuk password terenkripsi)
function decodeBase64(str) {
  try {
    return atob(str);
  } catch (e) {
    return str;
  }
}

// Fungsi untuk memuat data user dari users.json
async function loadUsers() {
  const response = await fetch("users.json");
  const users = await response.json();
  return users;
}

// Proses login utama
async function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = await loadUsers();

  if (users[username]) {
    const storedPassword = decodeBase64(users[username].password);
    if (password === storedPassword) {
      localStorage.setItem("username", username);
      localStorage.setItem("role", users[username].role);
      window.location.href = "home.html";
      return;
    }
  }

  alert("❌ Username atau password salah!");
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Saat halaman home dibuka, tampilkan info login
function checkLogin() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username) {
    window.location.href = "index.html";
    return;
  }

  const userInfo = document.getElementById("user-info");
  if (userInfo) {
    userInfo.innerHTML = `<b>${role}</b>`;
  }
}

// Routing halaman berdasarkan menu
function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("content").innerHTML = data;
    })
    .catch((error) => {
      document.getElementById("content").innerHTML =
        "<p>Terjadi kesalahan memuat halaman.</p>";
    });
}

// Jalankan pemeriksaan login otomatis saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage !== "index.html") {
    checkLogin();
  }

  // Tambahkan listener untuk tombol logout (jika ada)
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

// ==========================================================
// Fungsi tambahan untuk tampilan & informasi footer
// ==========================================================
function showFooterLegal() {
  const footer = document.getElementById("footer-legal");
  if (footer) {
    footer.innerHTML = `
      <small>
        🏛️ Berdasarkan <b>Permendagri Nomor 1 Tahun 2023</b> tentang Tata Naskah Dinas 
        di Lingkungan Pemerintah Daerah. <br/>
        Aplikasi Tata Naskah Dinas Elektronik (TND-E) — Kecamatan Dumai Kota.
      </small>
    `;
  }
}

document.addEventListener("DOMContentLoaded", showFooterLegal);