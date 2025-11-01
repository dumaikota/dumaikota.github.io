// pdf.js – pdfmake generator + kop dinamis
import { getUser } from './storage.js';

export function alamatOtomatis(unit){
  const alamat = {
    'Kecamatan Dumai Kota':'Jl. Pattimura, Kel. Laksamana – Kode Pos 28821',
    'Kelurahan Bintan':'Jl. Jenderal Soedirman – Kode Pos 28812',
    'Kelurahan Dumai Kota':'Jl. Datuk Laksamana – Kode Pos 28811',
    'Kelurahan Laksamana':'Jl. Pattimura – Kode Pos 28821',
    'Kelurahan Rimba Sekampung':'Jl. Belimbing – Kode Pos 28822',
    'Kelurahan Sukajadi':'Jl. Paris – Kode Pos 28812'
  };
  return alamat[unit]||'';
}

export function kop(unit){
  const isKel = unit.includes('Kelurahan');
  const baris3 = isKel ? 'KELURAHAN '+unit.replace('Kelurahan ','').toUpperCase() : '';
  return [
    {
      columns:[
        { image:'assets/img/dumai.png', width:60 },
        {
          stack:[
            { text:'PEMERINTAH KOTA DUMAI', bold:true, alignment:'center' },
            { text:'KECAMATAN DUMAI KOTA', bold:true, alignment:'center' },
            baris3?{ text:baris3, bold:true, alignment:'center' }:null,
            { text:alamatOtomatis(unit), fontSize:9, alignment:'center', margin:[0,2,0,0] }
          ].filter(Boolean)
        }
      ]
    },
    { canvas:[{ type:'line', x1:0, y1:0, x2:515, y2:0, lineWidth:1.5 }], margin:[0,5,0,10] }
  ];
}

export function tandaTangan(role,unit){
  let jab='Camat Dumai Kota';
  if(role==='Sekcam') jab='a.n. Camat\nSekretaris Kecamatan';
  if(role==='Lurah') jab='a.n. Camat\nLurah '+unit.replace('Kelurahan ','');
  return {
    text:`\n\n${jab}\n\n\n(...............................)`,
    alignment:'right',
    margin:[0,30,0,0]
  };
}

// ---- Generator tiap modul ----
export function generatePDF(modul,data){
  const u=getUser()||{unit:'Kecamatan Dumai Kota',role:''};
  let doc={ pageSize:'A4', content:[], pageOrientation:'portrait' };
  if(modul==='disposisi') doc.pageSize='A5';
  if(modul==='notadinas'||modul==='surattugas') doc.pageSize='LEGAL';
  if(modul==='agenda') doc.pageOrientation='landscape';
  doc.content.push(...kop(u.unit));

  if(modul==='disposisi'){
    doc.content.push({text:'LEMBAR DISPOSISI',alignment:'center',bold:true,margin:[0,5,0,15]});
    doc.content.push({text:`Nomor: ${data.nomor}\nTanggal: ${data.tanggal}\nPerihal: ${data.perihal}\nPengirim: ${data.pengirim}\nPenerima: ${data.penerima}\n\nIsi:\n${data.isi}`,fontSize:11});
    if(data.tembusan?.length){ doc.content.push({text:'\nTembusan:',bold:true}); data.tembusan.forEach(t=>doc.content.push({text:'- '+t,fontSize:10})); }
  }

  if(modul==='notadinas'){
    doc.content.push({text:'NOTA DINAS',alignment:'center',bold:true,margin:[0,5,0,15]});
    doc.content.push({text:`Nomor: ${data.nomor}\nTanggal: ${data.tanggal}\nDari: ${data.dari}\nKepada: ${data.kepada}\nPerihal: ${data.perihal}\n\n${data.isi}`,fontSize:11});
    if(data.tembusan?.length){ doc.content.push({text:'\nTembusan:',bold:true}); data.tembusan.forEach(t=>doc.content.push({text:'- '+t,fontSize:10})); }
  }

  if(modul==='surattugas'){
    doc.content.push({text:'SURAT TUGAS',alignment:'center',bold:true,margin:[0,5,0,15]});
    doc.content.push({text:`Nomor: ${data.nomor}\nTanggal: ${data.tanggal}\nDasar: ${data.dasar}\nNama: ${data.nama}\nUraian: ${data.uraian}\nLokasi: ${data.lokasi}`,fontSize:11});
    if(data.tembusan?.length){ doc.content.push({text:'\nTembusan:',bold:true}); data.tembusan.forEach(t=>doc.content.push({text:'- '+t,fontSize:10})); }
  }

  if(modul==='agenda'){
    doc.content.push({text:'DAFTAR AGENDA HARIAN',alignment:'center',bold:true,margin:[0,5,0,15]});
    const body=[['Tanggal','Jam','Kegiatan','Lokasi','Hadir']];
    data.forEach(d=>body.push([d.tanggal,d.jam,d.judul,d.lokasi,d.hadir]));
    doc.content.push({table:{headerRows:1,widths:['*','*','*','*','*'],body},fontSize:9});
  }

  doc.content.push(tandaTangan(u.role,u.unit));
  pdfMake.createPdf(doc).download(`${modul.toUpperCase()}_${data.nomor||'AGENDA'}.pdf`);
}
