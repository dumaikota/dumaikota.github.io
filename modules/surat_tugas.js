export function render(container, session) {
  const key="surat_tugas_data"; const data=JSON.parse(localStorage.getItem(key)||"[]");
  container.innerHTML=`
    <div class='card'><h2>Surat Tugas</h2>
    <form id='formTugas'>
      <label>Nomor Surat:</label><input id='noTugas' required />
      <label>Nama Petugas:</label><input id='namaPetugas' required />
      <label>Uraian Tugas:</label><textarea id='uraianTugas' required></textarea>
      <label>Tanggal Pelaksanaan:</label><input id='tanggalTugas' type='date' required />
      <button type='submit' class='action'>Simpan</button></form>
      <button id='btnPDF' class='action'>Export PDF</button>
      <table id='tabelTugas'><thead><tr><th>Nomor</th><th>Nama</th><th>Uraian</th><th>Tanggal</th></tr></thead><tbody></tbody></table></div>`;
  const form=document.getElementById("formTugas"); const tbody=document.querySelector("#tabelTugas tbody");
  const renderTable=()=>{tbody.innerHTML=data.map(d=>`<tr><td>${d.no}</td><td>${d.nama}</td><td>${d.uraian}</td><td>${d.tanggal}</td></tr>`).join("");};
  form.addEventListener("submit",e=>{e.preventDefault();data.push({no:noTugas.value,nama:namaPetugas.value,uraian:uraianTugas.value,tanggal:tanggalTugas.value});localStorage.setItem(key,JSON.stringify(data));form.reset();renderTable();});
  document.getElementById("btnPDF").addEventListener("click",()=>{const{jsPDF}=window.jspdf;const doc=new jsPDF();doc.text("Daftar Surat Tugas",10,10);let y=20;data.forEach((d,i)=>{doc.text(`${i+1}. ${d.no} | ${d.nama} | ${d.uraian} | ${d.tanggal}`,10,y);y+=10;});doc.save("surat_tugas.pdf");});
  renderTable();
}