document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Silakan isi username dan password!");
      return;
    }

    const user = USERS[username];
    if (!user) {
      alert("❌ Username tidak ditemukan!");
      return;
    }

    const decodedPass = atob(user.password);
    if (password === decodedPass) {
      localStorage.setItem("username", username);
      localStorage.setItem("role", user.role);
      localStorage.setItem("displayName", user.role);

      alert(`Selamat datang, ${user.role}!`);
      window.location.href = "../../index.html";
    } else {
      alert("❌ Password salah!");
    }
  });
});
