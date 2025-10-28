// Fungsi login sederhana dengan redirect per role
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Login berhasil! Selamat datang ' + user.username.toUpperCase());

    // Redirect sesuai role
    if (user.role === 'CAMAT' || user.role === 'SEKCAM') {
      window.location.href = '../index.html';
    } else {
      window.location.href = '../pages/agenda.html';
    }
  } else {
    alert('Username atau password salah.');
  }
});
