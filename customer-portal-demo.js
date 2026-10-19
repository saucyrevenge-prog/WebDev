const fr=document.documentElement.lang.startsWith('fr');
const tabs=[...document.querySelectorAll('[data-panel-tab]')];
const panes=[...document.querySelectorAll('[data-portal-pane]')];
const validIds=new Set(panes.map(p=>p.id));
function switchTab(tab,{updateHash=true}={}){
 if(!tab)return;
 tabs.forEach(button=>{
  const selected=button===tab;
  button.setAttribute('aria-selected',String(selected));
  button.tabIndex=selected?0:-1;
 });
 panes.forEach(panel=>{panel.hidden=panel.id!==tab.dataset.panelTab});
 if(updateHash&&location.hash.slice(1)!==tab.dataset.panelTab)history.replaceState(null,'','#'+tab.dataset.panelTab);
}
tabs.forEach((tab,i)=>{
 tab.setAttribute('role','tab');
 tab.tabIndex=i===0?0:-1;
 tab.addEventListener('click',()=>switchTab(tab));
 tab.addEventListener('keydown',e=>{
  const forward=['ArrowDown','ArrowRight'].includes(e.key),backward=['ArrowUp','ArrowLeft'].includes(e.key);
  if(!forward&&!backward&&e.key!=='Home'&&e.key!=='End')return;
  e.preventDefault();
  const next=e.key==='Home'?tabs[0]:e.key==='End'?tabs[tabs.length-1]:tabs[(i+(forward?1:-1)+tabs.length)%tabs.length];
  next.focus();switchTab(next);
 });
});
const nav=document.querySelector('.portal-nav');nav?.setAttribute('role','tablist');nav?.setAttribute('aria-orientation','horizontal');
panes.forEach(panel=>{panel.setAttribute('role','tabpanel');const tab=tabs.find(b=>b.dataset.panelTab===panel.id);if(tab){tab.id='portal-tab-'+panel.id;panel.setAttribute('aria-labelledby',tab.id)}});
function fromHash(){const id=location.hash.slice(1);if(validIds.has(id))switchTab(tabs.find(b=>b.dataset.panelTab===id),{updateHash:false});else switchTab(tabs[0],{updateHash:false})}
window.addEventListener('hashchange',fromHash);fromHash();
const form=document.getElementById('sampleRequest'),notice=document.getElementById('sampleNotice');
form?.addEventListener('submit',e=>{
 e.preventDefault();
 if(!form.reportValidity())return;
 const description=form.elements.namedItem('details').value.trim();
 if(description.length<5){form.elements.namedItem('details').setCustomValidity(fr?'Veuillez fournir au moins cinq caractères.':'Please enter at least five characters.');form.reportValidity();return}
 notice.textContent=fr?'Simulation seulement : « '+description+' ». Aucune demande transmise ou conservée.':'Demo only: “'+description+'”. No request was sent or stored.';
 notice.hidden=false;form.reset();
});
form?.addEventListener('input',()=>{notice.hidden=true;form.elements.namedItem('details').setCustomValidity('')});
