export function setUser(obj){
  if(obj) localStorage.setItem('user',JSON.stringify(obj));
  else localStorage.removeItem('user');
}
export function getUser(){
  return JSON.parse(localStorage.getItem('user')||'null');
}
export function addLog(action){
  const u=JSON.parse(localStorage.getItem('user')||'null');
  const logs=JSON.parse(localStorage.getItem('activity_log')||'[]');
  const time=new Date().toLocaleString('id-ID');
  logs.push({time,user:u?u.role:'Guest',action});
  localStorage.setItem('activity_log',JSON.stringify(logs));
}
export function getLogs(){
  return JSON.parse(localStorage.getItem('activity_log')||'[]');
}
