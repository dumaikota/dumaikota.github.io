import { getData, saveData } from './storage.js';

const exp=document.getElementById('export-btn');
const imp=document.getElementById('import-btn');
const file=document.getElementById('import-file');
const status=document.getElementById('status');

exp.addEventListener('click',()=>{
 const all={
   disposisi:getData('disposisi'),
   notadinas:getData('notadinas'),
   surattugas:getData('surattugas'),
   agenda:getData('agenda')
 };
 const blob=new Blob([JSON.stringify(all,null,2)],{type:'application/json'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='arsip_dumai_kota.json';
 a.click();
 status.textContent='Data berhasil diekspor.';
});

imp.addEventListener('click',()=>{
 if(!file.files.length){status.textContent='Pilih file JSON dulu.';return;}
 const reader=new FileReader();
 reader.onload=e=>{
   try{
     const data=JSON.parse(e.target.result);
     Object.keys(data).forEach(k=>saveData(k,data[k]));
     status.textContent='Data berhasil diimpor.';
   }catch{status.textContent='File tidak valid.';}
 };
 reader.readAsText(file.files[0]);
});
