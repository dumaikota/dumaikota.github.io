export function render(container){
  container.innerHTML=`
  <div class="card">
    <h2>Surat Tugas</h2>
    <form id="formTugas">
      <label>Nomor Surat:</label><input id="noTugas" required />
      <label>Nama Petugas:</label><input id="namaPetugas" required />
      <label>Uraian Tugas:</label><textarea id="uraianTugas" required></textarea>
      <button type="submit" class="action">Simpan</button>
    </form>
    <button id="btnPDF" class="action">Export PDF</button>
    <table id="tabelTugas">
      <thead><tr><th>Nomor</th><th>Nama</th><th>Uraian</th></tr></thead><tbody></tbody>
    </table>
  </div>`;
  const form=document.getElementById('formTugas');
  const tbody=document.querySelector('#tabelTugas tbody');
  const data=JSON.parse(localStorage.getItem('tugas')||'[]');
  const renderTable=()=>{tbody.innerHTML=data.map(d=>`<tr><td>${d.no}</td><td>${d.nama}</td><td>${d.uraian}</td></tr>`).join('');};
  form.addEventListener('submit',e=>{e.preventDefault();data.push({no:noTugas.value,nama:namaPetugas.value,uraian:uraianTugas.value});
    localStorage.setItem('tugas',JSON.stringify(data));form.reset();renderTable();});
  renderTable();
  const title="Daftar Surat Tugas", filename="surat_tugas.pdf";
  const format=d=>`${d.no} - ${d.nama} - ${d.uraian}`;
  
  document.getElementById('btnPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    let y = 20;
    data.forEach((d, i) => {
      doc.text(`${i+1}. ${format(d)}`, 10, y);
      y += 10;
    });
    doc.save(filename);
  });

}