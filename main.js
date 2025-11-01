import { navigate } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  // tampilkan info user
  const userInfo = document.getElementById("userInfo");
  if (userInfo)
    userInfo.textContent = `${session.nama} (${session.role}${session.wilayah ? " - " + session.wilayah : ""})`;

  // tombol nav ubah hash, bukan panggil navigate langsung
  document.querySelectorAll("nav button[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = btn.dataset.route;
    });
  });

  // logout
  const logout = document.getElementById("logoutBtn");
  if (logout)
    logout.addEventListener("click", () => {
      localStorage.removeItem("session");
      window.location.href = "index.html";
    });
});
