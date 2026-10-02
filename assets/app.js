const $=s=>document.querySelector(s);
async function getLinks(){
  const r=await fetch((window.LINKS_FILE||"links.json")+"?ts="+Date.now(),{cache:"no-store"});
  if(!r.ok) throw new Error("تعذر تحميل الروابط");
  return r.json();
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function iconHtml(icon){
  const value=String(icon||"link").trim();
  const isImage=/^(https?:\/\/|data:image\/|assets\/|\.\/?|[^\s]+\.(png|jpe?g|gif|svg|webp)(\?.*)?$)/i.test(value);
  if(isImage){
    const src=/^(https?:\/\/|data:image\/|assets\/|\.\/?)/i.test(value) ? value : `assets/icons/${value}`;
    return `<img class="custom-icon" src="${esc(src)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`+
           `<i class="fallback-icon" data-lucide="link" style="display:none"></i>`;
  }
  return `<i data-lucide="${esc(value)}"></i>`;
}
function render(items){
  const grid=$("#linkGrid");
  if(!items.length){grid.innerHTML='<div class="empty">لا توجد روابط حالياً.</div>';return;}
  grid.innerHTML=items.map(x=>`<a class="link-card glass" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" data-search="${esc((x.title+" "+(x.description||"")).toLowerCase())}">
    <div class="icon-box">${iconHtml(x.icon)}</div>
    <div class="link-text"><h2>${esc(x.title)}</h2>${x.description?`<p>${esc(x.description)}</p>`:""}</div>
    <i class="card-arrow" data-lucide="arrow-up-left"></i>
  </a>`).join("");
  lucide.createIcons();
}
(async()=>{
  lucide.createIcons();
  $("#year").textContent=new Date().getFullYear();
  try{render(await getLinks())}
  catch(e){$("#linkGrid").innerHTML='<div class="empty">تعذر تحميل الروابط. تأكد من وجود links.json في جذر المستودع.</div>'}
})();
$("#search").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll(".link-card").forEach(c=>c.style.display=c.dataset.search.includes(q)?"flex":"none");
});
