const { jsPDF } = window.jspdf;
const form=document.getElementById('disposisiForm'),tbl=document.querySelector('#disposisiTable tbody');
const mode=document.getElementById('inputMode'),up=document.getElementById('uploadSection');
const file=document.getElementById('fileUpload'),btn=document.getElementById('extractBtn');
const status=document.getElementById('extractStatus'),prev=document.getElementById('ocrPreview');
let dataList=JSON.parse(localStorage.getItem('disposisiList'))||[];
mode.onchange=()=>{up.style.display=mode.value==='manual'?'none':'block';file.accept=mode.value==='srikandi'?'.pdf':'image/*'};
btn.onclick=async()=>{if(!file.files[0])return alert('Pilih file');status.textContent='🔄...';mode.value==='gambar'?ocrImage(file.files[0]):ocrPdf(file.files[0])};
function ocrImage(f){const c=document.createElement('canvas'),x=c.getContext('2d'),i=new Image();i.src=URL.createObjectURL(f);
i.onload=()=>{c.width=i.width;c.height=i.height;x.drawImage(i,0,0);let d=x.getImageData(0,0,c.width,c.height);
for(let j=0;j<d.data.length;j+=4){let g=(d.data[j]+d.data[j+1]+d.data[j+2])/3;let v=g>160?255:0;d.data[j]=d.data[j+1]=d.data[j+2]=v;}
x.putImageData(d,0,0);Tesseract.recognize(c,'eng+ind').then(r=>{prev.value=r.data.text;parse(r.data.text)})}};
async function ocrPdf(f){const b=await f.arrayBuffer();const pdf=await pdfjsLib.getDocument({data:b}).promise;let t='';
for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i);const c=await p.getTextContent();t+=c.items.map(it=>it.str).join(' ')}prev.value=t;parse(t)}
function parse(t){status.textContent='✅';let n=t.match(/(No\.?|Nomor)[:\s\-]*([A-Z0-9\/.-]+)/i),p=t.match(/(Perihal|Hal)[:\s\-]*([^\n]+)/i);
let d=t.match(/(Dari|Asal|Instansi|Dinas)[:\s\-]*([^\n]+)/i),tg=t.match(/(\d{1,2}\s?[A-Za-z]+\s?\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/);
if(n)noSurat.value=n[2].trim();if(p)perihal.value=p[2].trim();if(d)dari.value=d[2].trim();if(tg)try{tanggalSurat.value=new Date(tg[0]).toISOString().split('T')[0];}catch{}}
form.onsubmit=e=>{e.preventDefault();let d={noSurat:noSurat.value,tanggalSurat:tanggalSurat.value,dari:dari.value,perihal:perihal.value,sifat:sifat.value,
tujuan:tujuan.value.split(',').map(v=>v.trim()),catatan:catatan.value};dataList.push(d);localStorage.setItem('disposisiList',JSON.stringify(dataList));form.reset();render()};
function render(){tbl.innerHTML='';dataList.forEach((d,i)=>{tbl.innerHTML+=`<tr><td>${d.noSurat}</td><td>${d.tanggalSurat}</td><td>${d.perihal}</td><td>${d.dari}</td><td>${d.sifat}</td><td>${d.tujuan.join(', ')}</td><td>${d.catatan}</td><td><button onclick='printOne(${i})'>🖨</button><button onclick='del(${i})'>🗑</button></td></tr>`})}
function del(i){if(confirm('hapus?')){dataList.splice(i,1);localStorage.setItem('disposisiList',JSON.stringify(dataList));render()}}
function printOne(i){let d=dataList[i];let doc=new jsPDF({format:'a5'});doc.text(`Disposisi: ${d.noSurat}`,20,20);doc.text(`${d.perihal}`,20,30);doc.save(`Disp_${d.noSurat}.pdf`)}
function printAllDisposisi(){if(!dataList.length)return alert('kosong');let doc=new jsPDF({format:'a5'});dataList.forEach((d,i)=>{if(i>0)doc.addPage();doc.text(`${d.noSurat} - ${d.perihal}`,20,20+i*10)});doc.save('Disposisi_Semua.pdf')}
render();