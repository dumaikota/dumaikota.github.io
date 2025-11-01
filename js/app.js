// =======================
// APP MAIN v2.3 FINAL
// =======================

import { getUser, setUser, addLog } from './storage.js';

// ---------- QUOTES 300 RANDOM ----------
const quotes = [
  "Pelayanan publik bukan beban, tapi kehormatan.",
  "ASN sejati melayani dengan hati, bukan dengan janji.",
  "Integritas adalah cahaya birokrasi.",
  "Kedisiplinan adalah wujud cinta pada profesi.",
  "Tanda tangan ASN adalah janji, bukan formalitas.",
  "Kerja keras itu wajib, kerja ikhlas itu mulia.",
  "ASN bukan singkatan dari 'Ada Saat Ngopi' 😄",
  "Yang datang tepat waktu bukan keajaiban, tapi komitmen.",
  "Birokrasi hebat dimulai dari hati yang tulus.",
  "Senin: semangat, Selasa: selesaikan, Rabu: rawat komitmen.",
  "Pemimpin hebat lahir dari pelayan yang rendah hati.",
  "ASN itu pelita, bukan penonton.",
  "Integritas tidak bisa dicetak, tapi ditanam.",
  "Senyum ASN, cermin wibawa instansi.",
  "Kopi boleh dingin, semangat jangan.",
  "Rapat boleh banyak, hasil jangan kosong.",
  "Setiap laporan adalah jejak pengabdian.",
  "Kerja kecil dengan niat besar menjadi ibadah.",
  "Pelayanan publik: cepat, tepat, dan beretika.",
  "Jabatan hanyalah amanah, bukan anugerah pribadi.",
  // ... tambahkan hingga 300 kutipan beragam (formal, humanis, candaan ASN) ...
];

// ---------- RANDOM QUOTE PICKER ----------
function getRandomQuote(){
  return quotes[Math.floor(Math.random()*quotes.length)];
}

// ---------- TYPEWRITER (fade-by-character) ----------
function typeQuote(text, element, speed = 30){
  element.textContent = '';
  let i = 0;
  const timer = setInterval(()=>{
    element.textContent += text.charAt(i);
    i++;
    if(i >= text.length) clearInterval(timer);
  }, speed);
}

// ---------- UPDATE QUOTE + TIME ----------
function updateQuote(){
  const el=document.getElementById('daily-quote');
  if(!el) return;
  el.style.opacity=0;
  setTimeout(()=>{
    const newQuote = getRandomQuote();
    el.style.opacity=1;
    typeQuote(newQuote, el, 30);
  },300);
}
setInterval(updateQuote,300000); // 5 menit

function updateTime(){
  const now = new Date();
  const hari = now.toLocaleDateString('id-ID',{weekday:'long'});
  const tanggal = now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  const jam = now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const t=document.getElementById('datetime');
  if(t) t.textContent=`${hari}, ${tanggal} • ${jam} WIB`;
}
setInterval(updateTime,1000);

// ---------- LOGIN / LOGOUT ----------
document.addEventListener('DOMContentLoaded',()=>{
  const u=getUser();
  const info=document.getElementById('user-info');
  if(u){
    info.innerHTML=`👤 ${u.role} | <button id="logout-btn">Logout</button>`;
    document.getElementById('logout-btn').onclick=()=>{ setUser(null); location.reload(); };
  }
  updateQuote(); updateTime();
});

// ---------- FADE PAGE TRANSITION ----------
export async function loadPage(page){
  const main=document.getElementById('app');
  main.classList.add('fade-out');
  setTimeout(async()=>{
    if(page==='logout'){ setUser(null); location.reload(); return; }
    const res = await fetch(`html/${page}.html`);
    const html = await res.text();
    main.innerHTML = html;
    main.classList.remove('fade-out');
    main.classList.add('fade-in');
    setTimeout(()=>main.classList.remove('fade-in'),400);
  },200);
}

// ---------- MENU EVENT ----------
document.addEventListener('click',e=>{
  if(e.target.matches('nav button[data-page]')){
    const p=e.target.getAttribute('data-page');
    loadPage(p);
  }
});
