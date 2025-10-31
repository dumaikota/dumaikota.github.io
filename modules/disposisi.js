export function render(container){
  container.innerHTML=`
  <div class="card">
    <h2>Disposisi</h2>
    <form id="formDisposisi">
      <label>Nomor Surat:</label><input id="noSurat" required />
      <label>Isi Disposisi:</label><textarea id="isiDisposisi" required></textarea>
      <button type="submit" class="action">Simpan</button>
    </form>
    <button id="btnPDF" class="action">Export PDF</button>
    <table id="tabelDisposisi">
      <thead><tr><th>No Surat</th><th>Isi</th></tr></thead><tbody></tbody>
    </table>
  </div>`;
  const form=document.getElementById('formDisposisi');
  const tbody=document.querySelector('#tabelDisposisi tbody');
  const data=JSON.parse(localStorage.getItem('disposisi')||'[]');
  const renderTable=()=>{tbody.innerHTML=data.map(d=>`<tr><td>${d.no}</td><td>${d.isi}</td></tr>`).join('');};
  form.addEventListener('submit',e=>{e.preventDefault();data.push({no:noSurat.value,isi:isiDisposisi.value});
    localStorage.setItem('disposisi',JSON.stringify(data));form.reset();renderTable();});
  renderTable();
  const title="Daftar Disposisi", filename="disposisi.pdf";
  const format=d=>`${d.no} - ${d.isi}`;
  
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