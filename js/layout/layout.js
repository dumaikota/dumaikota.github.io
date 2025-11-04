// ===============================
// Layout Loader - Barang Baru Rasa Lama
// ===============================
// Fungsi: Memuat komponen header dan footer otomatis di semua halaman
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // Fungsi untuk memuat komponen (header/footer)
  const loadComponent = (selector, filePath) => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`Gagal memuat ${filePath}`);
        return response.text();
      })
      .then(html => {
        document.querySelector(selector).innerHTML = html;

        // Jika file footer dimuat, tambahkan quotes.js
        if (filePath.includes("footer.html")) {
          const script = document.createElement("script");
          script.src = "../../components/footer/quotes.js";
          script.defer = true;
          document.body.appendChild(script);
        }
      })
      .catch(err => console.error("❌ Layout Loader Error:", err));
  };

  // Deteksi level folder agar path relatif tetap aman di semua halaman
  const pathPrefix = window.location.pathname.includes("/modules/")
    ? "../../components/"
    : "./components/";

  // Muat header & footer
  loadComponent("header", `${pathPrefix}header/header.html`);
  loadComponent("footer", `${pathPrefix}footer/footer.html`);
});
