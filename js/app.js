// =======================
// APP MAIN v2.3 RESTABLE
// =======================
import { getUser,setUser,addLog } from './storage.js';

// ---------- QUOTES HANDLER ----------
let quotes = [];
async function loadQuotes(){
  try{
    const res = await fetch('data/quotes.json');
    quotes = await res.json();
  }catch(e){
    quotes = ["Gagal memuat kutipan 😅"];
  }
}
function getRandomQuote(){
  if(!quotes.length) return "Memuat kutipan...";
  return quotes[Math.floor(Math.random()*quotes.length)];
}
function typeQuote(text, element, speed=30){
  element.textContent='';
  let i=0;
  const t=setInterval(()=>{
    element.textContent+=text.charAt(i);
    i++;
    if(i>=text.length) clearInterval(t);
  },speed);
}
function updateQuote(){
  const el=document.getElementById('daily-quote');
  if(!el) return;
  el.style.opacity=0;
  setTimeout(()=>{
    const newQuote=getRandomQuote();
    el.style.opacity=1;
    typeQuote(newQuote,el,25);
  },300);
}
setInterval(updateQuote,300000); // tiap 5 menit

function updateTime(){
  const now=new Date();
  const hari=now.toLocaleDateString('id-ID',{weekday:'long'});
  const tanggal=now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  const jam=now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const t=document.getElementById('datetime');
  if(t) t.textContent=`${hari}, ${tanggal} • ${jam} WIB`;
}
setInterval(updateTime,1000);

// ---------- LOGIN ----------
document.addEventListener('DOMContentLoaded',async()=>{
  await loadQuotes();
  updateQuote(); updateTime();
  const u=getUser();
  const info=document.getElementById('user-info');
  if(u){
    info.innerHTML=`👤 ${u.role} | <button id="logout-btn">Logout</button>`;
    document.getElementById('logout-btn').onclick=()=>{ setUser(null); location.reload(); };
  }
  const loginBtn=document.getElementById('login-btn');
  if(loginBtn){
    loginBtn.addEventListener('click',()=>{
      const usr=document.getElementById('username').value.trim().toLowerCase();
      const pwd=document.getElementById('password').value.trim();
      const users={
        'camat':{role:'Camat'},'sekcam':{role:'Sekcam'},'subag':{role:'Subag TU'},
        'lurah_sukajadi':{role:'Lurah Sukajadi'},'lurah_bintan':{role:'Lurah Bintan'},
        'lurah_laksamana':{role:'Lurah Laksamana'},'lurah_rimba':{role:'Lurah Rimba Sekampung'},
        'operator':{role:'Operator'},'admin':{role:'Admin'}
      };
      const infoMsg=document.getElementById('login-status');
      if(users[usr] && pwd==='123'){
        setUser({username:usr,role:users[usr].role});
        addLog(`Login: ${users[usr].role}`);
        infoMsg.textContent='Login berhasil! Memuat aplikasi...';
        setTimeout(()=>location.reload(),800);
      }else{
        infoMsg.textContent='Username atau password salah.';
      }
    });
  }
});

// ---------- SPA LOADER + FADE ----------
export async function loadPage(page){
  const main=document.getElementById('app');
  main.classList.add('fade-out');
  setTimeout(async()=>{
    if(page==='logout'){ setUser(null); location.reload(); return; }
    const res=await fetch(`html/${page}.html`);
    const html=await res.text();
    main.innerHTML=html;
    main.classList.remove('fade-out');
    main.classList.add('fade-in');
    setTimeout(()=>main.classList.remove('fade-in'),400);
  },200);
}
document.addEventListener('click',e=>{
  if(e.target.matches('nav button[data-page]')){
    const p=e.target.getAttribute('data-page');
    loadPage(p);
  }
});
