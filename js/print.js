// Fungsi cetak PDF log (font Courier)
function printAgendaLog(agendaList) {
  if (!agendaList.length) return alert('Belum ada data untuk dicetak.');

  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<pre style="font-family: Courier; font-size: 10pt;">');
  win.document.write('AGENDA HARIAN PEJABAT\n');
  win.document.write('Tanggal Cetak: ' + new Date().toLocaleString('id-ID') + '\n\n');

  agendaList.forEach(a => {
    win.document.write('Tanggal : ' + a.tanggal + '\n');
    win.document.write('Pukul   : ' + a.pukul + ' WIB\n');
    win.document.write('Acara   : ' + a.acara + '\n');
    win.document.write('Lokasi  : ' + a.lokasi + '\n');
    win.document.write('Pejabat : ' + a.pejabat + '\n');
    win.document.write('------------------------------\n');
  });

  win.document.write('</pre>');
  win.document.close();
  win.print();
}
