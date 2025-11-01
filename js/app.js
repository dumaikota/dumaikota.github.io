import { loadPage, getUser, setUser } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const status = document.getElementById('login-status');

  // RBAC user database
  const userDB = {
    camat: { role: 'Camat', unit: 'Kecamatan Dumai Kota' },
    sekcam: { role: 'Sekcam', unit: 'Kecamatan Dumai Kota' },
    subag: { role: 'Subag TU', unit: 'Kecamatan Dumai Kota' },
    operator: { role: 'Operator', unit: 'Kecamatan Dumai Kota' },
    admin: { role: 'Admin', unit: 'Kecamatan Dumai Kota' },
    lurah_sukajadi: { role: 'Lurah', unit: 'Kelurahan Sukajadi' },
    lurah_bintan: { role: 'Lurah', unit: 'Kelurahan Bintan' },
    lurah_laksamana: { role: 'Lurah', unit: 'Kelurahan Laksamana' },
    lurah_rimbas: { role: 'Lurah', unit: 'Kelurahan Rimba Sekampung' }
  };

  loginBtn.addEventListener('click', () => {
    const uname = document.getElementById('username').value.trim().toLowerCase();
    const pwd = document.getElementById('password').value.trim();
    if (userDB[uname] && pwd === '123') {
      setUser(userDB[uname]);
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('main-menu').classList.remove('hidden');
      status.textContent = `Login sukses sebagai ${userDB[uname].role}`;
      loadPage('home');
    } else {
      status.textContent = 'Login gagal!';
    }
  });

  // routing nav
  document.getElementById('main-menu').addEventListener('click', e => {
    const page = e.target.dataset.page;
    if (!page) return;
    if (page === 'logout') {
      setUser(null);
      location.reload();
      return;
    }
    loadPage(page);
  });
});
