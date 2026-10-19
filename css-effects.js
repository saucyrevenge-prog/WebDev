const cards=[...document.querySelectorAll('.effect')];
const search=document.querySelector('#search');
const filters=[...document.querySelectorAll('[data-filter]')];
const lang=document.documentElement.lang.startsWith('fr')?'fr':'en';
const words=lang==='fr'
 ?{copied:'Copié !',copy:'Copier le CSS',show:'Voir le code',hide:'Masquer le code',empty:'Aucun effet trouvé. Essayez un autre terme.',reset:'Effacer la recherche',replay:'Rejouer',fallback:'Sélectionnez le code pour le copier.'}
 :{copied:'Copied!',copy:'Copy CSS',show:'Show code',hide:'Hide code',empty:'No effects match. Try a different search.',reset:'Clear search',replay:'Replay',fallback:'Select the code to copy it.'};
let category='All';
const grid=document.querySelector('.grid');
const controls=document.createElement('section');
controls.className='lab-controls';
controls.setAttribute('aria-label',lang==='fr'?'Personnalisation des effets':'Effect customization');
controls.innerHTML='<div class="control-intro"><strong></strong><p></p></div><label><span></span><input id="lab-speed" type="range" min="20" max="400" value="100" step="10"><output id="speed-value">1.0×</output></label><label><span></span><input id="lab-intensity" type="range" min="50" max="180" value="100" step="10"><output id="intensity-value">100%</output></label><button id="lab-reset" type="button"></button>';
controls.querySelector('strong').textContent=lang==='fr'?'Personnalisez les aperçus':'Customize the previews';
controls.querySelector('p').textContent=lang==='fr'?'Vitesse et saturation des aperçus. Les valeurs sont aussi ajoutées au CSS copié.':'Adjust preview speed and saturation. Your settings are also included in copied CSS.';
controls.querySelectorAll('label span')[0].textContent=lang==='fr'?'Durée':'Duration';
controls.querySelectorAll('label span')[1].textContent=lang==='fr'?'Saturation':'Saturation';
controls.querySelector('#lab-reset').textContent=lang==='fr'?'Réinitialiser':'Reset';
document.querySelector('.filters').after(controls);
const speed=controls.querySelector('#lab-speed'),intensity=controls.querySelector('#lab-intensity');
function updateSettings(){
 const duration=(Number(speed.value)/100).toFixed(1);
 document.documentElement.style.setProperty('--lab-duration',duration+'s');
 document.documentElement.style.setProperty('--lab-saturation',String(Number(intensity.value)/100));
 controls.querySelector('#speed-value').textContent=duration+'s';
 controls.querySelector('#intensity-value').textContent=intensity.value+'%';
 document.querySelectorAll('.code-preview code').forEach(node=>{const card=node.closest('.effect');if(card&&card._getCode)node.textContent=card._getCode()});
}
speed.addEventListener('input',updateSettings);
intensity.addEventListener('input',updateSettings);
controls.querySelector('#lab-reset').addEventListener('click',()=>{speed.value='100';intensity.value='100';updateSettings()});

const empty=document.createElement('div');
empty.className='empty-state';
empty.hidden=true;
empty.setAttribute('role','status');
empty.innerHTML='<p></p><button type="button"></button>';
empty.querySelector('p').textContent=words.empty;
empty.querySelector('button').textContent=words.reset;
empty.querySelector('button').addEventListener('click',()=>{category='All';search.value='';filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='All')));apply();search.focus()});
grid.after(empty);
function apply(){
 const q=search.value.trim().toLocaleLowerCase();
 let count=0;
 cards.forEach(card=>{
  const match=(category==='All'||card.dataset.category===category)&&card.textContent.toLocaleLowerCase().includes(q);
  card.classList.toggle('hidden',!match);
  if(match)count++;
 });
 document.querySelector('#count').textContent=String(count);
 empty.hidden=count!==0;
}
filters.forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.filter;
 filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 apply();
}));
search.addEventListener('input',apply);
const frameBase='.demo { display: grid; place-items: center; width: 145px; height: 92px; border-radius: 15px; background: linear-gradient(125deg,#c7ff76,#76af68); transition: all .5s ease; }';
const fullCode={
 lift:'.demo:hover { transform: translateY(-9px); }',
 tilt:'.demo:hover { transform: perspective(600px) rotateX(8deg) rotateY(-8deg); }',
 zoom:'.demo:hover { transform: scale(1.09); }',
 rotate:'.demo:hover { transform: rotate(-6deg); }',
 skew:'.demo:hover { transform: skew(-8deg); }',
 blur:'.demo { filter: blur(4px); }\n.demo:hover { filter: blur(0); }',
 gray:'.demo { filter: grayscale(1); }\n.demo:hover { filter: grayscale(0); }',
 bright:'.demo:hover { filter: brightness(1.45); }',
 hue:'.demo:hover { filter: hue-rotate(110deg); }',
 shadow:'.demo:hover { box-shadow: 0 22px 45px #bfff5c44; }',
 glow:'.demo:hover { box-shadow: 0 0 35px #c7ff78aa; }',
 border:'.demo { border: 3px solid transparent; }\n.demo:hover { border-color: #fff; }',
 gradient:'.demo { background: linear-gradient(100deg,#c8ff75,#38673e,#c8ff75); background-size: 220% 100%; animation: gradient 3s ease-in-out infinite alternate; }\n@keyframes gradient { to { background-position: 100% 50%; } }',
 glass:'.demo { background: #ffffff16; backdrop-filter: blur(14px); border: 1px solid #ffffff66; }',
 neumorph:'.demo { background: #233023; box-shadow: 8px 8px 18px #080d09, -8px -8px 18px #2c3a2c; }',
 textgradient:'.demo { background: linear-gradient(90deg,#f8ffdb,#73e6a9,#d1ff58); background-clip: text; -webkit-background-clip: text; color: transparent; }',
 outline:'.demo { color: transparent; -webkit-text-stroke: 1px #c8ff75; }',
 underline:'.demo { background: linear-gradient(#c8ff75,#c8ff75) left 72% / 0 2px no-repeat; }\n.demo:hover { background-size: 90% 2px; }',
 spacing:'.demo:hover { letter-spacing: .18em; }',
 typewriter:'.demo span { width: 0; overflow: hidden; white-space: nowrap; animation: typing 2.6s steps(6) infinite alternate; }\n@keyframes typing { to { width: 6ch; } }',
 pulse:'.demo { animation: pulse 2s ease-in-out infinite; }\n@keyframes pulse { 50% { transform: scale(1.08); box-shadow: 0 0 24px #c9ff70; } }',
 float:'.demo { animation: float 3s ease-in-out infinite; }\n@keyframes float { 50% { transform: translateY(-17px); } }',
 spin:'.demo { animation: spin 5s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }',
 bounce:'.demo { animation: bounce 1.5s ease-in-out infinite; }\n@keyframes bounce { 50% { transform: translateY(-25px); } }',
 shimmer:'.demo { position: relative; overflow: hidden; }\n.demo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(110deg,transparent 20%,#ffffffab 48%,transparent 68%); animation: shimmer 2.4s linear infinite; }\n@keyframes shimmer { from { transform: translateX(-150%); } to { transform: translateX(150%); } }',
 ripple:'.demo { position: relative; }\n.demo::after { content: ""; position: absolute; inset: 0; border: 2px solid #caff80; border-radius: inherit; opacity: 0; }\n.demo:active::after { animation: ripple .65s ease-out; }\n@keyframes ripple { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.5); } }',
 flip:'.demo { transition: transform .8s; }\n.demo:hover { transform: rotateY(180deg); }',
 slide:'.demo { position: relative; overflow: hidden; }\n.demo::after { content: "↗"; position: absolute; inset: 0; display: grid; place-items: center; background: #172816; color: #c8ff72; transform: translateX(-101%); transition: transform .5s; }\n.demo:hover::after { transform: translateX(0); }',
 clip:'.demo { clip-path: inset(0 45% 0 45% round 15px); transition: clip-path .6s; }\n.demo:hover { clip-path: inset(0 0 0 0 round 15px); }',
 spotlight:'.stage { position: relative; }\n.stage::after { content: ""; position: absolute; pointer-events: none; inset: 0; background: radial-gradient(circle at var(--x,50%) var(--y,50%),#bfff5844,transparent 45%); }\n/* Update --x and --y from pointer position for a moving spotlight. */'
};
const motionNote='\n@media (prefers-reduced-motion: reduce) { .demo, .demo::after { animation: none !important; transition: none !important; } }';
cards.forEach(card=>{
 const key=[...card.classList].find(c=>c.startsWith('effect-'))?.slice(7);
 const baseCode=frameBase+'\n'+(fullCode[key]||'.demo:hover { '+card.dataset.code+' }')+motionNote;
 const codeForSettings=()=>baseCode+'\n/* Adjustable preview settings */\n.demo { animation-duration: '+(Number(speed.value)/100).toFixed(2)+'s; transition-duration: '+(Number(speed.value)/100).toFixed(2)+'s; filter: saturate('+ (Number(intensity.value)/100).toFixed(2)+'); }';
 const demo=card.querySelector('.demo');
 demo.addEventListener('click',()=>{
  const active=card.classList.toggle('active');
  demo.setAttribute('aria-pressed',String(active));
 });
 const actions=card.querySelector('.actions');
 const show=document.createElement('button');
 show.type='button';
 show.textContent=words.show;
 show.setAttribute('aria-expanded','false');
 const pre=document.createElement('pre');
 pre.className='code-preview';
 pre.hidden=true;
 const content=document.createElement('code');
 content.textContent=getCode();
 pre.append(content);
 actions.append(show);
 card.querySelector('.info').append(pre);
 show.addEventListener('click',()=>{pre.hidden=!pre.hidden;show.setAttribute('aria-expanded',String(!pre.hidden));show.textContent=pre.hidden?words.show:words.hide});
 const copy=card.querySelector('.copy');
 copy.addEventListener('click',async()=>{
  try{
   await navigator.clipboard.writeText(getCode());
   copy.textContent=words.copied;
   setTimeout(()=>copy.textContent=words.copy,1400);
  }catch{
   pre.hidden=false;show.setAttribute('aria-expanded','true');show.textContent=words.hide;
   const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(content);selection.removeAllRanges();selection.addRange(range);
   copy.textContent=words.fallback;
   setTimeout(()=>copy.textContent=words.copy,2200);
  }
 });
 card.querySelector('.stage').addEventListener('pointermove',event=>{
  const bounds=event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--x',((event.clientX-bounds.left)/bounds.width*100)+'%');
  event.currentTarget.style.setProperty('--y',((event.clientY-bounds.top)/bounds.height*100)+'%');
 });
});
apply();
updateSettings();
