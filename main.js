import { navigate } from './router.js';
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('nav button').forEach(btn=>{
    btn.addEventListener('click',()=>navigate(btn.dataset.route));
  });
  navigate('dashboard');
});