/* Load shared, cookie-free public analytics once per page. */
(function(){
 if(document.querySelector('script[data-portfolio-metrics]'))return;
 const script=document.createElement('script');script.src='/metrics.js';script.defer=true;
 script.dataset.portfolioMetrics='true';document.head.appendChild(script);
})();

const nav=document.getElementById('mainNav'),toggle=document.getElementById('menuToggle');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle){toggle.textContent='☰';toggle.focus();}}});
window.matchMedia('(min-width: 741px)').addEventListener('change',e=>{if(e.matches&&nav?.classList.contains('open')){nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';}});
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const observer=window.IntersectionObserver?new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.07}):null;document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
const fr=document.documentElement.lang.startsWith('fr');
const ui=fr?{sending:'Envoi…',pending:'Envoi de votre demande…',success:'Message envoyé. Merci! Je vous répondrai par courriel.',error:'Impossible d’envoyer votre message. Écrivez directement à saucyrevenge@gmail.com.',submit:'Envoyer la demande <span>↗</span>'}:{sending:'Sending…',pending:'Sending your inquiry…',success:'Message sent. Thank you — I’ll get back to you by email.',error:'Unable to send. Please email saucyrevenge@gmail.com directly.',submit:'Send project enquiry <span>↗</span>'};
const inquiryForm=document.getElementById('inquiryForm');
document.querySelector('[data-offer]')?.addEventListener('click',()=>{if(inquiryForm){inquiryForm.elements.service.value='$500 bilingual website offer';inquiryForm.elements.budget.value='$500 bilingual website offer';}});
if(inquiryForm){
if(new URLSearchParams(location.search).get('offer')==='bilingual'){inquiryForm.elements.service.value='$500 bilingual website offer';inquiryForm.elements.budget.value='$500 bilingual website offer';}
const estimateParams=new URLSearchParams(location.search);
if(estimateParams.get('estimate')==='1'&&window.SoucyPricing){
 let saved={};try{saved=JSON.parse(sessionStorage.getItem('soucy.estimator.v1')||'{}')}catch{}
 const choices={...window.SoucyPricing.fromQuery(estimateParams),notes:saved.notes};
 const estimate=window.SoucyPricing.calculate(choices);
 inquiryForm.elements.service.value='Bilingual website';
 inquiryForm.elements.budget.value=estimate.knownBuild<1500?'Under $1,500':estimate.knownBuild<3000?'$1,500–$3,000':estimate.knownBuild<6000?'$3,000–$6,000':estimate.knownBuild<10000?'$6,000–$10,000':'$10,000+';
 inquiryForm.elements.message.value=window.SoucyPricing.summary(choices,fr);
}
const formStatus=document.getElementById('formStatus'),submit=document.getElementById('inquirySubmit');
inquiryForm.addEventListener('input',e=>e.target.setCustomValidity?.(''));
inquiryForm.addEventListener('change',e=>e.target.setCustomValidity?.(''));
inquiryForm.addEventListener('submit',async(e)=>{
e.preventDefault();
for(const field of inquiryForm.querySelectorAll('input,select,textarea')){
 field.setCustomValidity('');
 if(!field.validity.valid)field.setCustomValidity(fr?(field.validity.typeMismatch?'Entrez une adresse courriel valide.':field.validity.tooShort?'Veuillez fournir au moins 20 caractères.':'Veuillez remplir ce champ.'):(field.validity.typeMismatch?'Enter a valid email address.':field.validity.tooShort?'Please enter at least 20 characters.':'Please complete this field.'));
}
if(!inquiryForm.reportValidity())return;
const payload={...Object.fromEntries(new FormData(inquiryForm).entries()),language:fr?'fr':'en'};
if(submit.disabled)return;submit.disabled=true;submit.textContent=ui.sending;formStatus.textContent=ui.pending;formStatus.setAttribute('role','status');formStatus.setAttribute('aria-live','polite');inquiryForm.dataset.submitState='pending';submit.setAttribute('aria-busy','true');
try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await r.json();if(!r.ok||!result.ok)throw Object.assign(new Error(),{userFacing:result.error||ui.error});formStatus.textContent=ui.success;inquiryForm.dataset.submitState='success';inquiryForm.reset()}catch(err){formStatus.textContent=err.userFacing||ui.error;inquiryForm.dataset.submitState='error'}finally{submit.removeAttribute('aria-busy');submit.disabled=false;submit.innerHTML=ui.submit}
});
}
