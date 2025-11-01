import { navigate } from './router.js';
document.addEventListener('DOMContentLoaded',()=>{
  const session=JSON.parse(localStorage.getItem('session'));
  if(!session){window.location.href='index.html';return;}
  document.getElementById('userInfo').textContent=`${session.nama} (${session.role}${session.wilayah?' - '+session.wilayah:''})`;
  document.querySelectorAll('nav button[data-route]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.route)));
  document.getElementById('logoutBtn').addEventListener('click',()=>{localStorage.removeItem('session');window.location.href='index.html';});
  navigate('dashboard');
});