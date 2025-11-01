export function render(container, session) {
  const isLurah=session.role==='lurah'; const wilayah=session.wilayah||'Kecamatan';
  const key=isLurah?`agenda_lurah_${wilayah}`:"agenda_kecamatan";
  const data=JSON.parse(localStorage.getItem(key)||"[]");
  container.innerHTML=`
  <div class='card'><h2>Agenda ${isLurah?'Kelurahan':'Kecamatan'} ${isLurah?wilayah:''}</h2>
  <form id='formAgenda'>
    <label>Hari / Tanggal:</label><input id='tanggal' type='date' required />
    <label>Pukul:</label><input id='pukul' type='time' required />
    <label>Judul Acara / Kegiatan:</label><input id='judul' required />
    <label>Lokasi:</label><input id='lokasi' required />
    <label>Pejabat yang Menghadiri:</label><input id='pejabat' required />
    <button type='submit' class='action'>Simpan</button></form>
  <button id='btnPDF' class='action'>Export PDF</button>
  <table id='tabelAgenda'><thead><tr><th>Tanggal</th><th>Pukul</th><th>Judul</th><th>Lokasi</th><th>Pejabat</th></tr></thead><tbody></tbody></table></div>`;
  const form=document.getElementById("formAgenda"); const tbody=document.querySelector("#tabelAgenda tbody");
  const renderTable=()=>{tbody.innerHTML=data.map(d=>`<tr><td>${d.tanggal}</td><td>${d.pukul}</td><td>${d.judul}</td><td>${d.lokasi}</td><td>${d.pejabat}</td></tr>`).join("");};
  form.addEventListener("submit",e=>{e.preventDefault();data.push({tanggal:tanggal.value,pukul:pukul.value,judul:judul.value,lokasi:lokasi.value,pejabat:pejabat.value,wilayah:isLurah?wilayah:'Kecamatan'});localStorage.setItem(key,JSON.stringify(data));form.reset();renderTable();});
  document.getElementById("btnPDF").addEventListener("click",()=>{const{jsPDF}=window.jspdf;const doc=new jsPDF();doc.text(`Agenda ${isLurah?'Kelurahan '+wilayah:'Kecamatan Dumai Kota'}`,10,10);let y=20;data.forEach((d,i)=>{doc.text(`${i+1}. ${d.tanggal} | ${d.pukul} | ${d.judul} | ${d.lokasi} | ${d.pejabat}`,10,y);y+=10;});doc.save(isLurah?`agenda_${wilayah}.pdf`:"agenda_kecamatan.pdf");});
  renderTable();
}