// storage.js
export function loadPage(page){
  fetch(`html/${page}.html`)
    .then(res=>res.text())
    .then(html=>{
      document.getElementById('app').innerHTML = html;
      const modules = {
        disposisi: './disposisi.js',
        notadinas: './notadinas.js',
        surattugas: './surattugas.js',
        agenda: './agenda.js',
        export: './export.js'
      };
      if (modules[page]) import(modules[page]);
    });
}
export function saveData(k,v){ localStorage.setItem(k,JSON.stringify(v)); }
export function getData(k){ return JSON.parse(localStorage.getItem(k)||'[]'); }
export function setUser(u){ u?localStorage.setItem('user',JSON.stringify(u)):localStorage.removeItem('user'); }
export function getUser(){ return JSON.parse(localStorage.getItem('user')||'null'); }
