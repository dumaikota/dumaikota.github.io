export function render(container, session) {
  const key = "nota_dinas_data";
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  container.innerHTML = `
    <div class='card'>
      <h2>Nota Dinas</h2>
      <form id='formNota'>
        <label>Nomor Nota:</label><input id='noNota' required />
        <label>Perihal:</label><input id='perihal' required />
        <label>Isi Nota:</label><textarea id='isiNota' required></textarea>
        <button type='submit' class='action'>Simpan</button>
      </form>
      <button id='btnPDF' class='action'>Export PDF</button>
      <table id='tabelNota'>
        <thead><tr><th>Nomor</th><th>Perihal</th><th>Isi</th></tr></thead><tbody></tbody>
      </table>
    </div>`;
  const form = document.getElementById("formNota");
  const tbody = document.querySelector("#tabelNota tbody");
  const renderTable = () => { tbody.innerHTML = data.map(d => `<tr><td>${d.no}</td><td>${d.perihal}</td><td>${d.isi}</td></tr>`).join(""); };
  form.addEventListener("submit", e => { e.preventDefault(); data.push({ no:noNota.value, perihal:perihal.value, isi:isiNota.value }); localStorage.setItem(key, JSON.stringify(data)); form.reset(); renderTable(); });
  document.getElementById("btnPDF").addEventListener("click", () => { const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.text("Daftar Nota Dinas", 10, 10); let y = 20; data.forEach((d, i)=>{doc.text(`${i+1}. ${d.no} | ${d.perihal} | ${d.isi}`,10,y); y+=10;}); doc.save("nota_dinas.pdf"); });
  renderTable();
}