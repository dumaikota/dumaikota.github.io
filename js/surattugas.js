import { saveData, getData } from './storage.js';
import { generatePDF } from './pdf.js';

const form=document.getElementById('surattugas-form');
const table=document.getElementById('tabel-surattugas');

form.addEventListener('submit',e=>{
 e.preventDefault();
 const data={
   nomor:form.nomor.value,
   tanggal:form.tanggal.value,
   dasar:form.dasar.value,
   nama:form.nama.value,
   uraian:form.uraian.value,
   lokasi:form.lokasi.value,
   tembusan:form.tembusan.value.split(',').map(x=>x.trim()).filter(x=>x)
 };
 const list=getData('surattugas'); list.push(data);
 saveData('surattugas',list);
 render();
});

function render(){
 const list=getData('surattugas');
 table.innerHTML='<table><tr><th>Nomor</th><th>Nama</th><th>Lokasi</th><th>Aksi</th></tr>'+
 list.map((x,i)=>`<tr><td>${x.nomor}</td><td>${x.nama}</td><td>${x.lokasi}</td>
   <td><button onclick="window.printST(${i})">Cetak</button></td></tr>`).join('')+'</table>';
}
window.printST=i=>{
 const data=getData('surattugas')[i];
 generatePDF('surattugas',data);
}
render();
