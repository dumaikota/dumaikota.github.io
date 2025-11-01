// main.js
document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const userInfo = document.getElementById("userInfo");
  userInfo.textContent = `${session.nama} (${session.role}${session.wilayah ? " - " + session.wilayah : ""})`;

  // tombol nav ubah hash
  document.querySelectorAll("nav button[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = btn.dataset.route;
    });
  });

  // tombol logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("session");
    window.location.href = "index.html";
  });
});
