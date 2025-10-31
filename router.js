export async function navigate(route){
  const routes={dashboard:()=>import('./modules/dashboard.js'),
                disposisi:()=>import('./modules/disposisi.js'),
                nota:()=>import('./modules/nota_dinas.js'),
                tugas:()=>import('./modules/surat_tugas.js'),
                agenda:()=>import('./modules/agenda.js')};
  const app=document.getElementById('app');
  app.innerHTML='<p>Memuat...</p>';
  if(routes[route]){
    const module=await routes[route]();
    app.innerHTML='';
    module.render(app);
  }else{
    app.innerHTML='<h2>Halaman tidak ditemukan.</h2>';
  }
}