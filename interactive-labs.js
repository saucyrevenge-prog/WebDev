const menu=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');function closeMenu(){if(!nav)return;nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='☰'}menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});window.addEventListener('resize',()=>{if(innerWidth>760)closeMenu()});document.addEventListener('click',e=>{if(nav&&menu&&!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()});document.getElementById('year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));document.querySelectorAll('[data-demo]').forEach(card=>{const kind=card.dataset.demo,button=card.querySelector('[data-action]'),preview=card.querySelector('.preview');if(kind==='toast'){button?.addEventListener('click',()=>{const t=card.querySelector('.live-toast');t.hidden=false;setTimeout(()=>t.hidden=true,2400)})}if(kind==='modal'){const modal=card.querySelector('.live-modal'),close=card.querySelector('[data-close]');let previousFocus=null;const hide=()=>{modal.hidden=true;document.removeEventListener('keydown',onKey);previousFocus?.focus()};const onKey=e=>{if(e.key==='Escape'){e.preventDefault();hide()}else if(e.key==='Tab'){e.preventDefault();close?.focus()}};button?.addEventListener('click',()=>{previousFocus=document.activeElement;modal.hidden=false;close?.focus();document.addEventListener('keydown',onKey)});close?.addEventListener('click',hide);modal?.addEventListener('click',e=>{if(e.target===modal)hide()})}if(kind==='action-sheet'){
 const sheet=card.querySelector('.live-sheet'),cancel=sheet?.querySelector('[data-close]'),choices=[...sheet.querySelectorAll('[data-sheet-choice]')],feedback=card.querySelector('.sheet-result');
 let previousFocus=null;
 const interactive=[...choices,cancel].filter(Boolean);
 const hide=()=>{sheet.hidden=true;document.removeEventListener('keydown',onKey);previousFocus?.focus?.({preventScroll:true})};
 const onKey=e=>{
   if(e.key==='Escape'){e.preventDefault();hide();return}
   if(e.key!=='Tab')return;
   const first=interactive[0],last=interactive[interactive.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 };
 button?.addEventListener('click',()=>{previousFocus=document.activeElement;sheet.hidden=false;interactive[0]?.focus();document.addEventListener('keydown',onKey)});
 cancel?.addEventListener('click',hide);
 choices.forEach(choice=>choice.addEventListener('click',()=>{feedback.textContent=choice.textContent.trim();hide()}));
 sheet?.addEventListener('click',e=>{if(e.target===sheet)hide()});
}if(kind==='accordion'){button?.addEventListener('click',()=>{const panel=card.querySelector('.live-accordion-panel');panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden))})}if(kind==='tabs'){card.querySelectorAll('[role=tab]').forEach(tab=>tab.addEventListener('click',()=>{card.querySelectorAll('[role=tab]').forEach(t=>t.setAttribute('aria-selected',String(t===tab)));card.querySelector('[data-tab-panel]').textContent=tab.dataset.text}))}const code=card.dataset.code;if(code){const pre=document.createElement('pre');pre.hidden=true;const codeEl=document.createElement('code');codeEl.textContent=code;pre.append(codeEl);card.append(pre);const actions=card.querySelector('.buttons');const view=document.createElement('button');view.type='button';view.textContent=document.documentElement.lang.startsWith('fr')?'Voir le code':'Show code';view.setAttribute('aria-expanded','false');view.addEventListener('click',()=>{pre.hidden=!pre.hidden;view.setAttribute('aria-expanded',String(!pre.hidden));view.textContent=pre.hidden?(document.documentElement.lang.startsWith('fr')?'Voir le code':'Show code'):(document.documentElement.lang.startsWith('fr')?'Masquer le code':'Hide code')});const copy=document.createElement('button');copy.type='button';copy.textContent=document.documentElement.lang.startsWith('fr')?'Copier':'Copy';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code);copy.textContent=document.documentElement.lang.startsWith('fr')?'Copié !':'Copied!';setTimeout(()=>copy.textContent=document.documentElement.lang.startsWith('fr')?'Copier':'Copy',1500)}catch{pre.hidden=false;view.setAttribute('aria-expanded','true');const sel=window.getSelection(),range=document.createRange();range.selectNodeContents(codeEl);sel.removeAllRanges();sel.addRange(range)}});actions?.append(view,copy)}});

/* Keep every lab's navigation aligned with the portfolio header. */
if(nav){
 nav.setAttribute('aria-label',document.documentElement.lang.startsWith('fr')?'Navigation principale':'Main navigation');
 const projectLink=[...nav.querySelectorAll('a')].find(a=>a.getAttribute('href')?.endsWith('#work'));
 const hasAbout=[...nav.querySelectorAll('a')].some(a=>a.getAttribute('href')?.endsWith('#about'));
 if(projectLink&&!hasAbout){
  const about=document.createElement('a');
  about.href=document.documentElement.lang.startsWith('fr')?'/fr/#about':'/#about';
  about.textContent=document.documentElement.lang.startsWith('fr')?'À propos':'About';
  projectLink.after(about);
  about.addEventListener('click',closeMenu);
 }
 const labLink=[...nav.querySelectorAll('a')].find(a=>a.getAttribute('href')===(document.documentElement.lang.startsWith('fr')?'/fr/labos-interactifs/':'/interactive-labs/'));
 if(labLink)labLink.setAttribute('aria-current','page');
}
