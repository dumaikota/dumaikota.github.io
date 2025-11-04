// =======================================
// Login Handler — Kecamatan Dumai Kota
// - decode Base64 password from USERS
// - simpan username (key) dan role ke localStorage
// - redirect to index
// =======================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert("Silakan isi username dan password.");
      return;
    }

    const userRecord = USERS[username];
    if (!userRecord) {
      alert("❌ Username tidak ditemukan.");
      return;
    }

    // decode Base64 stored password
    let decoded;
    try {
      decoded = atob(userRecord.password);
    } catch (err) {
      console.error("Gagal decode password:", err);
      alert("Terjadi kesalahan pada sistem autentikasi.");
      return;
    }

    if (password === decoded) {
      // simpan session sederhana
      localStorage.setItem("username", username); // key id (misal 'camat')
      localStorage.setItem("role", userRecord.role);

      // juga simpan readable display name (role or nice label)
      localStorage.setItem("displayName", userRecord.role);

      alert(`Selamat datang, ${userRecord.role}!`);
      // redirect ke root (sesuaikan level path)
      // jika login.html berada di /modules/login/login.html, maka ../../index.html
      const redirectTo = (() => {
        const path = window.location.pathname;
        return path.includes("/modules/") ? "../../index.html" : "./index.html";
      })();

      window.location.href = redirectTo;
    } else {
      alert("❌ Password salah, silakan coba lagi.");
    }
  });
});
