document.addEventListener("DOMContentLoaded",()=>{
const agendaForm=document.getElementById("agendaForm");
const agendaList=document.getElementById("agendaList");
const jenisSelect=document.getElementById("jenis");
const jenisManual=document.getElementById("jenisManual");
const filterSelect=document.getElementById("filterSelect");
const searchInput=document.getElementById("searchInput");
const clearBtn=document.getElementById("clearStorage");
const printBtn=document.getElementById("printBtn");
const waNumberInput=document.getElementById("waNumber");
const wilayahSelect=document.getElementById("wilayahSelect");
let data=JSON.parse(localStorage.getItem("agenda_global"))||[];

jenisSelect.addEventListener("change",()=>{
if(jenisSelect.value==="manual"){jenisManual.classList.add("show");jenisManual.focus();}
else{jenisManual.classList.remove("show");jenisManual.value="";}});

const fmt=a=>`📅 *${a.judul}*
🗓️ ${a.tanggal} | 🕐 ${a.waktu}
📍 ${a.lokasi}
🏢 ${a.wilayah}
📂 ${a.jenis}
👤 ${a.pejabat}
📝 ${a.keterangan||"-"}`;

function save(){localStorage.setItem("agenda_global",JSON.stringify(data));}

function render(list=data){
agendaList.innerHTML="";
if(!list.length){agendaList.innerHTML="<p><em>Belum ada kegiatan.</em></p>";return;}
list.forEach((a,i)=>{
const card=document.createElement("div");
card.className="agenda-card";
card.innerHTML=`<pre>${fmt(a)}</pre>
<div style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap;">
<button class="btn-simpan" onclick="navigator.clipboard.writeText(\`${fmt(a)}\`)">📋 Salin</button>
<button class="btn-cetak" data-i="${i}">📤 WA</button>
<button class="btn-hapus" data-i="${i}">🗑️ Hapus</button></div>`;
agendaList.appendChild(card);});
agendaList.querySelectorAll(".btn-hapus").forEach(b=>b.onclick=()=>{data.splice(b.dataset.i,1);save();render();});
agendaList.querySelectorAll(".btn-cetak").forEach(b=>b.onclick=()=>{
const n=waNumberInput.value.replace(/\D/g,"");
if(!n)return alert("Isi nomor WA tujuan (format 62...)");
window.open(`https://wa.me/${n}?text=${encodeURIComponent(fmt(data[b.dataset.i]))}`,"_blank");});}

agendaForm.addEventListener("submit",e=>{
e.preventDefault();
const jenis=jenisSelect.value==="manual"?jenisManual.value.trim():jenisSelect.value;
const item={
judul:document.getElementById("judul").value.trim(),
tanggal:document.getElementById("tanggal").value,
waktu:document.getElementById("waktu").value,
lokasi:document.getElementById("lokasi").value.trim(),
jenis,pejabat:document.getElementById("pejabat").value.trim(),
keterangan:document.getElementById("keterangan").value.trim(),
wilayah:wilayahSelect.value};
if(!item.judul)return alert("Judul wajib diisi.");
data.push(item);save();agendaForm.reset();jenisManual.classList.remove("show");render();});

clearBtn.onclick=()=>{if(confirm("Hapus semua data agenda?")){data=[];save();render();}};
searchInput.oninput=()=>{const k=searchInput.value.toLowerCase();render(data.filter(a=>a.judul.toLowerCase().includes(k)||a.keterangan.toLowerCase().includes(k)));}
filterSelect.onchange=()=>{const j=filterSelect.value;render(j==="all"?data:data.filter(a=>a.jenis===j));};
printBtn.onclick=()=>{if(typeof generateAgendaPDF!=="function")return alert("print.js belum termuat!");const w=wilayahSelect.value;const l=data.filter(a=>a.wilayah===w);if(!l.length)return alert("Belum ada data untuk wilayah ini.");generateAgendaPDF(l,w);};
render();
});
