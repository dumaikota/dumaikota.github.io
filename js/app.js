import { getUser,setUser,addLog } from './storage.js';

let quotes=[], users={};

async function loadQuotes(){
  try{const r=await fetch('data/quotes.json');quotes=await r.json();}
  catch(e){quotes=["Gagal memuat kutipan 😅"];}
}
async function loadUsers(){
  try{const r=await fetch('data/users.json');users=await r.json();}
  catch(e){users={};}
}

// ==== Quotes & Clock ====
function getRandomQuote(){return quotes[Math.floor(Math.random()*quotes.length)]||"Memuat kutipan...";}
function updateQuote(){
  const el=document.getElementById('daily-quote'); if(!el)return;
  el.style.opacity=0; setTimeout(()=>{el.style.opacity=1; el.textContent=getRandomQuote();},300);
}
setInterval(updateQuote,300000);
function updateTime(){
  const now=new Date();
  const t=document.getElementById('datetime');
  if(t)t.textContent=now.toLocaleString('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})+' WIB';
}
setInterval(updateTime,1000);

// ==== LOGIN ====
document.addEventListener('DOMContentLoaded',async()=>{
  await loadQuotes(); await loadUsers(); updateQuote(); updateTime();
  const u=getUser();
  const info=document.getElementById('user-info');
  if(u){info.innerHTML=`👤 ${u.role} | <button id="logout-btn">Logout</button>`;document.getElementById('logout-btn').onclick=()=>{setUser(null);location.reload();};}
  const btn=document.getElementById('login-btn');
  if(btn){
    btn.onclick=()=>{
      const usr=document.getElementById('username').value.trim().toLowerCase();
      const pwd=document.getElementById('password').value.trim();
      const infoMsg=document.getElementById('login-status');
      if(users[usr]&&pwd==='123'){setUser({username:usr,role:users[usr].role});addLog(`Login: ${users[usr].role}`);infoMsg.textContent='Login berhasil!';setTimeout(()=>location.reload(),700);}
      else infoMsg.textContent='Username atau password salah.';
    };
  }
});

// ==== SPA LOADER ====
export async function loadPage(page){
  const main=document.getElementById('app');
  main.classList.add('fade-out');
  setTimeout(async()=>{
    if(page==='logout'){setUser(null);location.reload();return;}
    const res=await fetch(`html/${page}.html`);
    const html=await res.text();
    main.innerHTML=html;
    main.classList.remove('fade-out');main.classList.add('fade-in');
    setTimeout(()=>main.classList.remove('fade-in'),400);
    initMarkdownEditors();
    applyFormAccess(page);
  },200);
}
document.addEventListener('click',e=>{
  if(e.target.matches('nav button[data-page]')){
    loadPage(e.target.getAttribute('data-page'));
  }
});

// ==== RBAC MENU ====
function applyRoleAccess(){
  const u=getUser(); if(!u)return;
  const menu=document.getElementById('main-menu'); if(!menu)return;
  menu.querySelectorAll('button[data-page]').forEach(b=>b.style.display='inline-block');
  const hide=p=>menu.querySelectorAll(`button[data-page="${p}"]`).forEach(b=>b.style.display='none');
  if(u.role.includes('Operator')){hide('disposisi');hide('notadinas');hide('surattugas');hide('export');}
  else if(u.role.includes('Lurah')||u.role.includes('Sekretaris Kelurahan')){hide('disposisi');hide('notadinas');hide('export');}
  else if(u.role.includes('Subbag')||u.role.includes('Sekretaris Camat')){hide('export');}
  else if(u.role.includes('Administrator Sistem')){hide('disposisi');hide('notadinas');hide('surattugas');hide('agenda');}
}
document.addEventListener('DOMContentLoaded',applyRoleAccess);

// ==== RBAC FORM + VERIFIKASI ====
function applyFormAccess(page){
  const u=getUser(); if(!u)return;
  const disableAll=()=>document.querySelectorAll('input,textarea,select,button[type="submit"]').forEach(e=>e.disabled=true);
  switch(page){
    case'disposisi':
    case'notadinas':
    case'surattugas':
      if(u.role.includes('Operator'))disableAll();
      if(u.role.includes('Lurah')&&page!=='surattugas')disableAll();
      break;
  }
  if(['disposisi','notadinas','surattugas'].includes(page)){
    const statusSel=document.getElementById('status');
    if(statusSel){
      const allowed=[];
      if(u.role.includes('Camat')) allowed.push('Ditandatangani Camat');
      else if(u.role.includes('Sekretaris Camat')) allowed.push('Diverifikasi Sekcam');
      else allowed.push('Draft');
      [...statusSel.options].forEach(opt=>{if(!allowed.includes(opt.value))opt.disabled=true;});
    }
  }
}

// ==== Markdown Editor ====
function initMarkdownEditors(){
  document.querySelectorAll('textarea#isi,textarea.markdown-area').forEach(el=>{
    if(el.dataset.mde!=='true'){
      const mde=new SimpleMDE({
        element:el,spellChecker:false,placeholder:"Tulis isi surat...",
        toolbar:["bold","italic","heading","|","unordered-list","ordered-list","|","link","table","|","preview"],status:false
      });el.dataset.mde='true';
    }
  });
}
