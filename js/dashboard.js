import { getData } from './storage.js';
import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  document.getElementById('filter-agenda').addEventListener('change', renderTimeline);
});

function renderDashboard(){
  document.getElementById('count-disposisi').textContent = getData('disposisi').length;
  document.getElementById('count-nd').textContent = getData('notadinas').length;
  document.getElementById('count-st').textContent = getData('surattugas').length;
  document.getElementById('count-agenda').textContent = getData('agenda').length;
  renderTimeline();
  renderChart();
}

function renderTimeline(){
  const list = getData('agenda');
  const select = document.getElementById('filter-agenda').value;
  const today = new Date();
  const filtered = list.filter(item=>{
    const d = new Date(item.tanggal);
    const diff = (d - today)/(1000*3600*24);
    if(select==='hari') return d.toDateString()===today.toDateString();
    if(select==='besok') return diff>=0 && diff<2;
    if(select==='minggu') return diff>=0 && diff<7;
    return true;
  }).sort((a,b)=>new Date(a.tanggal)-new Date(b.tanggal));

  const ul=document.getElementById('timeline');
  ul.innerHTML='';
  if(!filtered.length){ ul.innerHTML='<li class="empty">Tidak ada agenda.</li>'; return; }

  filtered.forEach(item=>{
    const d=new Date(item.tanggal);
    const isToday=d.toDateString()===today.toDateString();
    const li=document.createElement('li');
    li.className=isToday?'today':'';
    li.innerHTML=`<div class="time">${item.jam||'-'}</div>
                  <div class="content">
                    <b>${item.judul}</b><br>
                    <small>${d.toLocaleDateString('id-ID')} • ${item.lokasi}</small><br>
                    <i>${item.hadir}</i>
                  </div>`;
    ul.appendChild(li);
  });
}

function renderChart(){
  const list=getData('agenda');
  const grouped={};
  list.forEach(item=>{
    const tgl=new Date(item.tanggal).toLocaleDateString('id-ID',{weekday:'short'});
    grouped[tgl]=(grouped[tgl]||0)+1;
  });
  const labels=Object.keys(grouped);
  const values=Object.values(grouped);
  const ctx=document.getElementById('agendaChart');
  if(ctx){
    new Chart(ctx,{
      type:'bar',
      data:{labels,datasets:[{label:'Agenda per Hari',data:values,backgroundColor:'#00bfa5'}]},
      options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
    });
  }
}
