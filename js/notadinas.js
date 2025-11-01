import { saveData, getData } from './storage.js';
import { generatePDF } from './pdf.js';

const form=document.getElementById('notadinas-form');
const table=document.getElementById('tabel-notadinas');

form.addEventListener('submit',e=>{
 e.preventDefault();
 const data={
   nomor:form.nomor.value,
   tanggal:form.tanggal.value,
   dari:form.dari.value,
   kepada:form.kepada.value,
   perihal:form.perihal.value,
   isi:form.isi.value,
   tembusan:form.tembusan.value.split(',').map(x=>x.trim()).filter(x=>x)
 };
 const list=getData('notadinas'); list.push(data);
 saveData('notadinas',list);
 render();
});

function render(){
 const list=getData('notadinas');
 table.innerHTML='<table><tr><th>Nomor</th><th>Dari</th><th>Kepada</th><th>Aksi</th></tr>'+
 list.map((x,i)=>`<tr><td>${x.nomor}</td><td>${x.dari}</td><td>${x.kepada}</td>
   <td><button onclick="window.printNota(${i})">Cetak</button></td></tr>`).join('')+'</table>';
}
window.printNota=i=>{
 const data=getData('notadinas')[i];
 generatePDF('notadinas',data);
}
render();
