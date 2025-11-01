import { getUser } from './storage.js';

export function alamatOtomatis(unit){
  const alamat={
    "Kecamatan Dumai Kota":"Jl. Pattimura, Kel. Laksamana – Kode Pos 28821",
    "Kelurahan Bintan":"Jl. Jenderal Soedirman – Kode Pos 28812",
    "Kelurahan Dumai Kota":"Jl. Datuk Laksamana – Kode Pos 28811",
    "Kelurahan Laksamana":"Jl. Pattimura – Kode Pos 28821",
    "Kelurahan Rimba Sekampung":"Jl. Belimbing – Kode Pos 28822",
    "Kelurahan Sukajadi":"Jl. Paris – Kode Pos 28812"
  };return alamat[unit]||"";
}

export function kop(unit){
  const isKel=unit.includes('Kelurahan');
  const baris3=isKel?'KELURAHAN '+unit.replace('Kelurahan ','').toUpperCase():'';
  return[
    {columns:[
      {image:'assets/img/bw_dumai.png',width:60},
      {stack:[
        {text:'PEMERINTAH KOTA DUMAI',bold:true,alignment:'center'},
        {text:'KECAMATAN DUMAI KOTA',bold:true,alignment:'center'},
        baris3?{text:baris3,bold:true,alignment:'center'}:null,
        {text:alamatOtomatis(unit),fontSize:9,alignment:'center',margin:[0,2,0,0]}
      ].filter(Boolean)}
    ]},
    {canvas:[{type:'line',x1:0,y1:0,x2:515,y2:0,lineWidth:1.5}],margin:[0,5,0,10]}
  ];
}

export function tandaTangan(role,unit,status){
  let jab='Camat Dumai Kota';
  if(role.includes('Sekcam')) jab='a.n. Camat\nSekretaris Camat';
  if(role.includes('Lurah')) jab='a.n. Camat\nLurah '+unit.replace('Kelurahan ','');
  const note=status?`\n\nStatus: ${status}`:'';
  return{text:`\n\n${jab}${note}\n\n\n(...............................)`,alignment:'right',margin:[0,30,0,0]};
}

export function generatePDF(modul,data){
  const u=getUser()||{unit:'Kecamatan Dumai Kota',role:''};
  const doc={pageSize:'A4',pageOrientation:'portrait',pageMargins:[85,70,57,70],content:[]};
  if(modul==='disposisi')doc.pageSize='A5';
  if(modul==='notadinas'||modul==='surattugas')doc.pageSize='LEGAL';
  if(modul==='agenda')doc.pageOrientation='landscape';
  doc.content.push(...kop(u.unit));
  doc.content.push({text:data.judul||modul.toUpperCase(),alignment:'center',bold:true,margin:[0,5,0,15]});
  doc.content.push({text:data.isi||'',fontSize:11});
  if(data.tembusan?.length){doc.content.push({text:'\nTembusan:',bold:true});data.tembusan.forEach(t=>doc.content.push({text:'- '+t,fontSize:10}));}
  doc.content.push(tandaTangan(u.role,u.unit,data.status));
  pdfMake.createPdf(doc).download(`${modul.toUpperCase()}_${data.nomor||'DOK'}.pdf`);
}
