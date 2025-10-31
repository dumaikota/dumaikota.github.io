export function render(container){
  container.innerHTML=`
  <div class="card">
    <h2>Nota Dinas</h2>
    <form id="formNota">
      <label>Nomor Nota:</label><input id="noNota" required />
      <label>Perihal:</label><input id="perihal" required />
      <button type="submit" class="action">Simpan</button>
    </form>
    <button id="btnPDF" class="action">Export PDF</button>
    <table id="tabelNota">
      <thead><tr><th>Nomor</th><th>Perihal</th></tr></thead><tbody></tbody>
    </table>
  </div>`;
  const form=document.getElementById('formNota');
  const tbody=document.querySelector('#tabelNota tbody');
  const data=JSON.parse(localStorage.getItem('nota')||'[]');
  const renderTable=()=>{tbody.innerHTML=data.map(d=>`<tr><td>${d.no}</td><td>${d.perihal}</td></tr>`).join('');};
  form.addEventListener('submit',e=>{e.preventDefault();data.push({no:noNota.value,perihal:perihal.value});
    localStorage.setItem('nota',JSON.stringify(data));form.reset();renderTable();});
  renderTable();
  const title="Daftar Nota Dinas", filename="nota_dinas.pdf";
  const format=d=>`${d.no} - ${d.perihal}`;
  
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