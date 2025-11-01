import { saveData, getData } from './storage.js';
import { generatePDF } from './pdf.js';

const form=document.getElementById('disposisi-form');
const table=document.getElementById('tabel-disposisi');

form.addEventListener('submit',e=>{
 e.preventDefault();
 const data={
   nomor:form.nomor.value,
   tanggal:form.tanggal.value,
   pengirim:form.pengirim.value,
   perihal:form.perihal.value,
   penerima:form.penerima.value,
   isi:form.isi.value,
   tembusan:form.tembusan.value.split(',').map(x=>x.trim()).filter(x=>x)
 };
 const list=getData('disposisi'); list.push(data);
 saveData('disposisi',list);
 render();
});

function render(){
 const list=getData('disposisi');
 table.innerHTML='<table><tr><th>Nomor</th><th>Perihal</th><th>Penerima</th><th>Aksi</th></tr>'+
 list.map((x,i)=>`<tr><td>${x.nomor}</td><td>${x.perihal}</td><td>${x.penerima}</td>
   <td><button onclick="window.printDisposisi(${i})">Cetak</button></td></tr>`).join('')+'</table>';
}
window.printDisposisi=i=>{
 const data=getData('disposisi')[i];
 generatePDF('disposisi',data);
}
render();
