/* Published offer prices; bespoke work remains unpriced until it is scoped. */
(function(global){
 'use strict';
 const featureKeys=['booking','customerPortal','staffPortal','payments','integrations'];
 const labels={en:{booking:'Booking system',customerPortal:'Customer portal',staffPortal:'Staff portal',payments:'Online payments',integrations:'Other integrations'},fr:{booking:'Système de réservation',customerPortal:'Portail client',staffPortal:'Portail employé',payments:'Paiements en ligne',integrations:'Autres intégrations'}};
 function normalize(input={}){
  const n=Number(input.pages);
  return {pages:Number.isFinite(n)?Math.min(100,Math.max(1,Math.trunc(n))):5,care:input.care===true,custom:input.custom===true,revisions:input.revisions===true,features:featureKeys.filter(k=>Array.isArray(input.features)&&input.features.includes(k)),notes:typeof input.notes==='string'?input.notes.trim().slice(0,1200):''};
 }
 function calculate(input){
  const state=normalize(input),extraPages=Math.max(0,state.pages-5);
  return {...state,extraPages,base:500,extraPageCost:extraPages*150,knownBuild:500+extraPages*150,monthlyMinimum:state.care?99:0,needsQuote:state.custom||state.revisions||state.features.length>0};
 }
 function money(n,fr=false){return new Intl.NumberFormat(fr?'fr-CA':'en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(n)+(fr?' CA':' CAD');}
 function summary(input,fr=false){
  const r=calculate(input),lang=fr?'fr':'en';
  const lines=fr?['Estimation de site Web bilingue',`Pages bilingues : ${r.pages} (${r.pages} versions anglaises et ${r.pages} versions françaises)`,`Base (jusqu’à 5 pages) : ${money(500,true)}`,`Pages supplémentaires : ${r.extraPages} × ${money(150,true)} = ${money(r.extraPageCost,true)}`,`Portion chiffrée de la création : ${money(r.knownBuild,true)}`,`Entretien facultatif : ${r.care?'à partir de '+money(99,true)+'/mois':'non sélectionné'}`]:['Bilingual website estimate',`Bilingual pages: ${r.pages} (${r.pages} English and ${r.pages} French versions)`,`Base (up to 5 pages): ${money(500)}`,`Extra pages: ${r.extraPages} × ${money(150)} = ${money(r.extraPageCost)}`,`Priced website build scope: ${money(r.knownBuild)}`,`Optional care: ${r.care?'from '+money(99)+'/month':'not selected'}`];
  const custom=[...(r.custom?[fr?'Conception entièrement personnalisée':'Fully custom design']:[]),...(r.revisions?[fr?'Révisions supplémentaires':'Additional revision rounds']:[]),...r.features.map(k=>labels[lang][k])];
  if(custom.length)lines.push((fr?'À chiffrer séparément : ':'Separate quote required: ')+custom.join(', '));
  lines.push(fr?'Inclus : formulaire de demande de devis par courriel et une ronde de révisions.':'Included: email quote request form and one revision round.');
  lines.push(fr?'Estimation indicative. La portion chiffrée exclut les options à devis distinct. Portée, prix final, taxes applicables et frais de tiers à confirmer au devis.':'Planning estimate. The priced portion excludes separately quoted options. Scope, final price, applicable taxes and third-party costs are confirmed in the quote.');
  if(r.notes)lines.push((fr?'Détails du projet : ':'Project details: ')+r.notes);
  return lines.join('\n');
 }
 function fromQuery(params){return normalize({pages:params.has('pages')?params.get('pages'):5,care:params.get('care')==='1',custom:params.get('custom')==='1',revisions:params.get('revisions')==='1',features:(params.get('features')||'').split(',')});}
 const api={normalize,calculate,money,summary,fromQuery,labels};global.SoucyPricing=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(typeof document==='undefined')return;
 const form=document.getElementById('pricingEstimator');if(!form)return;
 const fr=document.documentElement.lang.startsWith('fr'),lang=fr?'fr':'en',storageKey='soucy.estimator.v1';
 let initial={pages:5};
 const query=new URLSearchParams(location.search);
 try{const saved=sessionStorage.getItem(storageKey);if(saved)initial=JSON.parse(saved)}catch{}
 if(query.has('pages'))initial={...fromQuery(query),notes:initial.notes};
 initial=normalize(initial);
 function apply(s){form.elements.pages.value=s.pages;form.elements.design.value=s.custom?'custom':'established';form.elements.revisions.checked=s.revisions;form.elements.care.checked=s.care;form.elements.notes.value=s.notes;featureKeys.forEach(k=>form.elements[k].checked=s.features.includes(k));}
 function read(){return normalize({pages:form.elements.pages.value,care:form.elements.care.checked,custom:form.elements.design.value==='custom',revisions:form.elements.revisions.checked,features:featureKeys.filter(k=>form.elements[k].checked),notes:form.elements.notes.value});}
 const $=id=>document.getElementById(id);
 function render(){
  const s=read(),r=calculate(s);
  // Let a temporarily empty or out-of-range field stay editable; do not quote it.
  const valid=form.elements.pages.validity.valid&&form.elements.pages.value!=='';
  $('estimateSummary').hidden=!valid;$('estimateInvalid').hidden=valid;$('estimateQuote').hidden=!valid;
  if(!valid)return;
  try{sessionStorage.setItem(storageKey,JSON.stringify(s))}catch{}
  $('estimateAmount').textContent=money(r.knownBuild,fr);
  $('estimateHeading').textContent=r.needsQuote?(fr?'Portion chiffrée de la création':'Priced portion of your website build'):(fr?'Estimation de la création du site':'Estimated website build');
  $('estimateExtraPages').textContent=String(r.extraPages);
  $('estimatePageCost').textContent=money(r.extraPageCost,fr);
  $('estimateLanguages').textContent=fr?`${r.pages} versions anglaises + ${r.pages} versions françaises`:`${r.pages} English + ${r.pages} French versions`;
  $('estimateMonthly').textContent=r.care?(fr?'À partir de '+money(99,true)+'/mois':'From '+money(99)+'/month'):(fr?'Aucun entretien mensuel sélectionné':'No monthly care selected');
  $('estimateCustom').hidden=!r.needsQuote;
  $('estimateCustomItems').textContent=[...(r.custom?[fr?'Conception personnalisée':'Custom design']:[]),...(r.revisions?[fr?'Révisions supplémentaires':'Additional revisions']:[]),...r.features.map(k=>labels[lang][k])].join(', ');
  $('estimateQuoteNote').hidden=!r.needsQuote;
  const url=new URL(fr?'/fr/':'/',location.origin);url.searchParams.set('estimate','1');url.searchParams.set('pages',String(s.pages));if(s.care)url.searchParams.set('care','1');if(s.custom)url.searchParams.set('custom','1');if(s.revisions)url.searchParams.set('revisions','1');if(s.features.length)url.searchParams.set('features',s.features.join(','));url.hash='contact';$('estimateQuote').href=url.pathname+url.search+url.hash;
  const switchLink=document.querySelector('[data-language]');if(switchLink){const target=new URL(switchLink.href);for(const k of ['pages','care','custom','revisions','features']){target.searchParams.delete(k);if(url.searchParams.has(k))target.searchParams.set(k,url.searchParams.get(k));}switchLink.href=target.href;}
 }
 apply(initial);render();form.addEventListener('input',render);form.addEventListener('change',render);
 form.addEventListener('submit',e=>e.preventDefault());
 $('estimateReset').addEventListener('click',()=>{apply(normalize({pages:5}));render();});
})(typeof window!=='undefined'?window:globalThis);
