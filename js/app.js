// === IMPORT DARI STORAGE.JS ===
import { getUser, setUser, addLog } from './storage.js';

let quotes = [];
let users = {};
let cache = {}; // untuk menyimpan halaman yang sudah di-load

// === LOAD DATA QUOTES DAN USERS ===
async function loadQuotes() {
  try {
    const r = await fetch('data/quotes.json');
    quotes = await r.json();
  } catch (e) {
    quotes = ["Gagal memuat kutipan 😅"];
  }
}

async function loadUsers() {
  try {
    const r = await fetch('data/users.json');
    users = await r.json();
  } catch (e) {
    users = {};
  }
}

// === TAMPILAN KUTIPAN HARIAN ===
function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)] || "Memuat kutipan...";
}

function updateQuote() {
  const el = document.getElementById('daily-quote');
  if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.opacity = 1;
    el.textContent = getRandomQuote();
  }, 500);
}

// === TAMPILAN JAM REAL-TIME ===
function updateClock() {
  const el = document.getElementById('datetime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// === GANTI HALAMAN (NAVIGASI DINAMIS) ===
async function loadPage(page) {
  const app = document.getElementById('app');
  if (!app) return;

  if (cache[page]) {
    app.innerHTML = cache[page];
    return;
  }

  try {
    const res = await fetch(`html/${page}.html`);
    const html = await res.text();
    cache[page] = html;
    app.innerHTML = html;
  } catch (err) {
    app.innerHTML = `<p style="color:red;">Gagal memuat halaman ${page}.html</p>`;
  }
}

// === LOGIN HANDLER ===
async function initLogin() {
  await loadUsers();

  const loginBtn = document.getElementById('login-btn');
  const status = document.getElementById('login-status');
  const inputUser = document.getElementById('username');

  loginBtn.addEventListener('click', () => {
    const uname = inputUser.value.trim().toLowerCase();
    const user = users[uname];

    if (!uname) {
      status.textContent = "Masukkan nama pengguna terlebih dahulu.";
      status.style.color = "orange";
      return;
    }

    if (user) {
      setUser({ username: uname, role: user.role });
      addLog(`Login sebagai ${user.role}`);

      document.getElementById('login-section').style.display = 'none';
      document.getElementById('main-menu').classList.remove('hidden');

      const info = document.getElementById('user-info');
      info.innerHTML = `
        👤 <b>${user.role}</b>
        <button id="logout-btn">Keluar</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', logout);

      status.textContent = "";
      loadPage('home');
    } else {
      status.textContent = "❌ Nama pengguna tidak dikenal.";
      status.style.color = "red";
    }
  });
}

// === LOGOUT HANDLER ===
function logout() {
  localStorage.removeItem('user');
  addLog('Logout pengguna');
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('user-info').textContent = "";
  document.getElementById('app').innerHTML = "";
}

// === INISIALISASI MENU ===
function initMenu() {
  const menu = document.getElementById('main-menu');
  if (!menu) return;

  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const page = e.target.dataset.page;
      if (page === 'logout') {
        logout();
      } else {
        loadPage(page);
        document.querySelectorAll('nav.menu button')
          .forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    }
  });
}

// === SAAT HALAMAN DIMUAT ===
document.addEventListener('DOMContentLoaded', async () => {
  await loadQuotes();
  setInterval(updateQuote, 8000);
  updateQuote();
  setInterval(updateClock, 1000);

  const u = getUser();

  if (u) {
    // Jika user masih login
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-menu').classList.remove('hidden');
    const info = document.getElementById('user-info');
    info.innerHTML = `
      👤 <b>${u.role}</b>
      <button id="logout-btn">Keluar</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', logout);
    loadPage('home');
  } else {
    initLogin();
  }

  initMenu();
});