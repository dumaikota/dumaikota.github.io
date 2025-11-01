import { getUser } from './storage.js';

export function alamatOtomatis(unit){
  const alamat={
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
  const isKel=unit.includes('Kelurahan');
  const baris3=isKel?'KELURAHAN '+unit.replace('Kelurahan ','').toUpperCase():'';
  return [
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
export function tandaTangan(role,unit){
  let jab='Camat Dumai Kota';
  if(role==='Sekcam') jab='a.n. Camat\nSekretaris Kecamatan';
  if(role==='Lurah') jab='a.n. Camat\nLurah '+unit.replace('Kelurahan ','');
  return {text:`\n\n${jab}\n\n\n(...............................)`,alignment:'right',margin:[0,30,0,0]};
}
function parseMarkdown(md){
  const lines=(md||'').split(/\r?\n/);
  const body=[];
  lines.forEach(l=>{
    if(l.startsWith('- ')){body.push({text:'• '+l.slice(2),margin:[10,2,0,0]});return;}
    if(l.match(/^\d+\./)){body.push({text:l,margin:[10,2,0,0]});return;}
    if(l.trim()===''){body.push({text:' ',margin:[0,4]});return;}
    body.push({text:l.replace(/\*\*(.*?)\*\*/g,'$1').replace(/_(.*?)_/g,'$1'),margin:[0,2],fontSize:11});
  });
  return body;
}
export function generatePDF(modul,data){
  const u=getUser()||{unit:'Kecamatan Dumai Kota',role:''};
  let doc={pageSize:'A4',pageOrientation:'portrait',content:[],pageMargins:[85,70,57,70]};
  if(modul==='disposisi') doc.pageSize='A5';
  if(modul==='notadinas'||modul==='surattugas') doc.pageSize='LEGAL';
  if(modul==='agenda') doc.pageOrientation='landscape';
  doc.content.push(...kop(u.unit));
  const parsed=parseMarkdown(data.isi||'');
  doc.content.push({text:data.judul||modul.toUpperCase(),alignment:'center',bold:true,margin:[0,5,0,15]});
  doc.content.push(...parsed);
  if(data.tembusan?.length){
    doc.content.push({text:'\nTembusan:',bold:true});
    data.tembusan.forEach(t=>doc.content.push({text:'- '+t,fontSize:10}));
  }
  doc.content.push(tandaTangan(u.role,u.unit));
  if(typeof pdfMake==='undefined'){alert('Generator PDF belum siap');return;}
  pdfMake.createPdf(doc).download(`${modul.toUpperCase()}_${data.nomor||'DOK'}.pdf`);
}
