import { saveData, getData } from './storage.js';
import { generatePDF } from './pdf.js';

const form=document.getElementById('agenda-form');
const table=document.getElementById('tabel-agenda');

form.addEventListener('submit',e=>{
 e.preventDefault();
 const data={
   tanggal:form.tanggal.value,
   jam:form.jam.value,
   judul:form.judul.value,
   lokasi:form.lokasi.value,
   hadir:form.hadir.value
 };
 const list=getData('agenda'); list.push(data);
 saveData('agenda',list);
 render();
});

function render(){
 const list=getData('agenda');
 table.innerHTML='<table><tr><th>Tanggal</th><th>Jam</th><th>Kegiatan</th><th>Lokasi</th><th>Hadir</th></tr>'+
 list.map(x=>`<tr><td>${x.tanggal}</td><td>${x.jam}</td><td>${x.judul}</td><td>${x.lokasi}</td><td>${x.hadir}</td></tr>`).join('')+'</table>'+
 '<button id="cetakAgenda">Cetak PDF</button>';
 const btn=document.getElementById('cetakAgenda');
 if(btn) btn.addEventListener('click',()=>generatePDF('agenda',list));
}
render();
