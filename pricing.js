/* Starting estimates for explicitly scoped basic services. Final quotes confirm scope. */
(function(global){
 'use strict';
 const catalog={
 "booking": {
  "price": 350,
  "en": "Basic booking requests",
  "fr": "Demandes de réservation de base",
  "scopeEn": "One service, preferred date and time, manual approval and an email notification. No live availability sync.",
  "scopeFr": "Un service, date et heure souhaitées, approbation manuelle et notification par courriel. Sans synchronisation des disponibilités en temps réel.",
  "carePrice": 15
 },
 "customerPortal": {
  "price": 650,
  "en": "Basic customer portal",
  "fr": "Portail client de base",
  "scopeEn": "Customer sign-in, profile and one area for their service records or documents. Access limited to their own records.",
  "scopeFr": "Connexion client, profil et une section pour ses dossiers de service ou documents. Accès limité à ses propres dossiers.",
  "carePrice": 20
 },
 "staffPortal": {
  "price": 750,
  "en": "Basic staff portal",
  "fr": "Portail employé de base",
  "scopeEn": "Staff sign-in, administrator and staff roles, and one workflow such as a job list with status updates.",
  "scopeFr": "Connexion, rôles d’administrateur et d’employé, et un processus comme une liste de travaux avec mise à jour des statuts.",
  "carePrice": 25
 },
 "payments": {
  "price": 250,
  "en": "Basic online payments",
  "fr": "Paiements en ligne de base",
  "scopeEn": "One hosted checkout flow for one-time payments and a confirmation. Requires your payment-provider account; processing fees are extra.",
  "scopeFr": "Un parcours de paiement hébergé pour des paiements uniques, avec confirmation. Votre compte de paiement est requis; frais de traitement en sus.",
  "carePrice": 10
 },
 "integrations": {
  "price": 250,
  "en": "One basic API integration",
  "fr": "Une intégration API de base",
  "scopeEn": "Connect one documented API to one website action. No large data migration or complex two-way synchronization.",
  "scopeFr": "Relier une API documentée à une action du site. Sans migration de données importante ni synchronisation bidirectionnelle complexe.",
  "carePrice": 10
 },
 "dashboard": {
  "price": 650,
  "en": "Basic dashboard and report",
  "fr": "Tableau de bord et rapport de base",
  "scopeEn": "One dashboard with up to four indicators and one simple report from an agreed data source. Add a staff portal if sign-in and record editing are needed.",
  "scopeFr": "Un tableau de bord avec quatre indicateurs maximum et un rapport simple à partir d’une source convenue. Ajoutez un portail employé pour la connexion et la modification des dossiers.",
  "carePrice": 15
 },
 "automation": {
  "price": 200,
  "en": "One basic automation",
  "fr": "Une automatisation de base",
  "scopeEn": "One trigger and one action, such as sending an email when a request arrives. External service subscriptions are extra.",
  "scopeFr": "Un déclencheur et une action, comme un courriel à l’arrivée d’une demande. Abonnements aux services externes en sus.",
  "carePrice": 10
 },
 "seo": {
  "price": 150,
  "en": "Additional SEO review",
  "fr": "Révision SEO supplémentaire",
  "scopeEn": "One review of titles, descriptions, headings, internal links and indexing setup for up to five bilingual pages. Basic SEO foundations remain included in the website; rankings are not guaranteed.",
  "scopeFr": "Une révision des titres, descriptions, rubriques, liens internes et paramètres d’indexation pour cinq pages bilingues maximum. Les bases du référencement restent incluses avec le site; classement non garanti.",
  "carePrice": 0
 },
 "prototype": {
  "price": 300,
  "en": "Basic clickable prototype",
  "fr": "Prototype cliquable de base",
  "scopeEn": "Up to three screens showing one proposed workflow. A planning prototype, separate from a functioning production feature.",
  "scopeFr": "Jusqu’à trois écrans présentant un processus proposé. Un prototype de planification, distinct d’une fonctionnalité de production.",
  "carePrice": 0
 },
 "consulting": {
  "price": 100,
  "en": "One-hour consultation",
  "fr": "Consultation d’une heure",
  "scopeEn": "One hour to review requirements and recommend a practical approach, with a short written action list.",
  "scopeFr": "Une heure pour revoir les besoins et proposer une approche pratique, avec une courte liste d’actions écrite.",
  "carePrice": 0
 }
};
 const featureKeys=Object.keys(catalog);
 const labels={en:Object.fromEntries(featureKeys.map(k=>[k,catalog[k].en])),fr:Object.fromEntries(featureKeys.map(k=>[k,catalog[k].fr]))};
 const support={none:{price:0,en:'No ongoing service',fr:'Aucun service récurrent',scopeEn:'You arrange ongoing hosting and maintenance.',scopeFr:'Vous organisez l’hébergement et l’entretien.'},hosting:{price:25,en:'Basic hosting',fr:'Hébergement de base',scopeEn:'Website hosting and SSL. Domain registration, renewals and content changes are separate.',scopeFr:'Hébergement du site et certificat SSL. Enregistrement du domaine, renouvellement et modifications du contenu en sus.'},care:{price:99,en:'Basic website care',fr:'Entretien de base du site',scopeEn:'Hosting, availability checks, routine checks of the selected basic features and up to 30 minutes of content updates per month. Pricing scales with pages and supported features. New features are quoted separately.',scopeFr:'Hébergement, vérification de la disponibilité et des fonctionnalités de base sélectionnées, et jusqu’à 30 minutes de mises à jour du contenu par mois. Le prix augmente selon les pages et fonctionnalités prises en charge. Nouvelles fonctionnalités sur devis.'}};
 const presets={starter:{pages:5},booking:{pages:5,features:['booking','payments']},full:{pages:10,custom:true,features:['booking','customerPortal','staffPortal','payments','integrations','dashboard','automation','seo'],support:'care'},all:{pages:10,custom:true,revisions:true,features:featureKeys,support:'care'}};
 function normalize(input={}){
  if(!input||typeof input!=='object'||Array.isArray(input))input={};
  const n=Number(input.pages),plan=Object.hasOwn(support,input.support)?input.support:input.care===true?'care':'none';
  return {pages:Number.isFinite(n)?Math.min(100,Math.max(1,Math.trunc(n))):5,support:plan,care:plan==='care',custom:input.custom===true,revisions:input.revisions===true,complex:input.complex===true,features:featureKeys.filter(k=>Array.isArray(input.features)&&input.features.includes(k)),notes:typeof input.notes==='string'?input.notes.trim().slice(0,1200):''};
 }
 function calculate(input){
  const state=normalize(input),extraPages=Math.max(0,state.pages-5),extraPageCost=extraPages*150,designCost=state.custom?500:0,revisionCost=state.revisions?100:0;
  const featureTotal=state.features.reduce((n,k)=>n+catalog[k].price,0),knownBuild=500+extraPageCost+designCost+revisionCost+featureTotal;
  const carePageCost=extraPages*3,careDesignCost=state.custom?10:0,careFeatureCost=state.features.reduce((n,k)=>n+catalog[k].carePrice,0),careEstimate=99+carePageCost+careDesignCost+careFeatureCost;
  const monthlyMinimum=state.support==='care'?careEstimate:support[state.support].price;
  return {...state,extraPages,base:500,extraPageCost,designCost,revisionCost,featureTotal,knownBuild,carePageCost,careDesignCost,careFeatureCost,careEstimate,monthlyMinimum,firstYear:knownBuild+monthlyMinimum*12,needsQuote:state.complex};
 }
 function money(n,fr=false){return new Intl.NumberFormat(fr?'fr-CA':'en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(n)+(fr?' CA':' CAD');}
 function items(input,fr=false){const r=calculate(input);return [...(r.custom?[{label:fr?'Conception personnalisée de base':'Basic custom design',price:500}]:[]),...(r.revisions?[{label:fr?'Une ronde de révisions supplémentaire':'One additional revision round',price:100}]:[]),...r.features.map(k=>({label:catalog[k][fr?'fr':'en'],price:catalog[k].price}))];}
 function careItems(input,fr=false){const r=calculate(input);if(r.support!=='care')return [];return [{label:fr?'Entretien de base · jusqu’à 5 pages':'Base care · up to 5 pages',price:99},...(r.extraPages?[{label:fr?`${r.extraPages} pages supplémentaires × 3 $/mois`:`${r.extraPages} extra pages × $3/month`,price:r.carePageCost}]:[]),...(r.custom?[{label:fr?'Entretien de la conception personnalisée':'Custom design upkeep',price:10}]:[]),...r.features.filter(k=>catalog[k].carePrice>0).map(k=>({label:catalog[k][fr?'fr':'en'],price:catalog[k].carePrice}))];}
 function summary(input,fr=false){
  const r=calculate(input),lang=fr?'fr':'en';
  const lines=fr?['Estimation indicative — site Web et services de base',`Pages bilingues : ${r.pages} (${r.pages} versions anglaises et ${r.pages} versions françaises)`,`Base (jusqu’à 5 pages) : ${money(500,true)}`,`Pages supplémentaires : ${r.extraPages} × ${money(150,true)} = ${money(r.extraPageCost,true)}`]:['Planning estimate — website and basic services',`Bilingual pages: ${r.pages} (${r.pages} English and ${r.pages} French versions)`,`Base (up to 5 pages): ${money(500)}`,`Extra pages: ${r.extraPages} × ${money(150)} = ${money(r.extraPageCost)}`];
  for(const item of items(r,fr))lines.push(item.label+': '+(fr?'à partir de ':'from ')+money(item.price,fr));
  lines.push((fr?'Création et configuration estimées : à partir de ':'Estimated build and setup: from ')+money(r.knownBuild,fr));
  lines.push((fr?'Service mensuel : ':'Monthly service: ')+support[r.support][lang]+(r.monthlyMinimum?' — '+(fr?'à partir de ':'from ')+money(r.monthlyMinimum,fr)+(fr?'/mois':'/month'):''));
  for(const item of careItems(r,fr))lines.push((fr?'Entretien — ':'Care — ')+item.label+': '+money(item.price,fr)+(fr?'/mois':'/month'));
  lines.push(fr?'Domaine : enregistrement et renouvellement en sus; prix à confirmer séparément.':'Domain: registration and renewals are separate; price confirmed separately.');
  lines.push((fr?'Budget estimatif de la première année : à partir de ':'First-year planning budget: from ')+money(r.firstYear,fr));
  if(r.complex)lines.push(fr?'Besoins dépassant les versions de base : coût supplémentaire à confirmer.':'Requirements beyond the basic versions: additional cost to be confirmed.');
  lines.push(fr?'Inclus : formulaire de demande de devis par courriel et une ronde de révisions.':'Included: email quote request form and one revision round.');
  lines.push(fr?'Prix de départ pour les versions de base décrites dans l’estimateur. Devis final requis. Taxes, frais de traitement, domaines, abonnements externes et consommation de services en sus, selon le projet. Les services mensuels sont distincts du prix de création.':'Starting prices for the basic versions described in the estimator. Final quote required. Taxes, processing fees, domains, external subscriptions and usage costs are extra where applicable. Monthly services are separate from the build.');
  if(r.notes)lines.push((fr?'Détails du projet : ':'Project details: ')+r.notes);
  return lines.join('\n');
 }
 function fromQuery(params){return normalize({pages:params.has('pages')?params.get('pages'):5,support:params.get('support'),care:params.get('care')==='1',custom:params.get('custom')==='1',revisions:params.get('revisions')==='1',complex:params.get('complex')==='1',features:(params.get('features')||'').split(',')});}
 const api={normalize,calculate,money,summary,fromQuery,labels,catalog,support,presets,items,careItems};global.SoucyPricing=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(typeof document==='undefined')return;
 const form=document.getElementById('pricingEstimator');if(!form)return;
 const fr=document.documentElement.lang.startsWith('fr'),lang=fr?'fr':'en',storageKey='soucy.estimator.v1';
 let initial={pages:5};const query=new URLSearchParams(location.search);
 try{const saved=sessionStorage.getItem(storageKey);if(saved)initial=JSON.parse(saved)}catch{}
 if(query.has('pages'))initial={...fromQuery(query),notes:initial?.notes};initial=normalize(initial);
 function apply(s){form.elements.pages.value=s.pages;form.elements.design.value=s.custom?'custom':'established';form.elements.revisions.checked=s.revisions;form.elements.support.value=s.support;form.elements.complex.checked=s.complex;form.elements.notes.value=s.notes;featureKeys.forEach(k=>form.elements[k].checked=s.features.includes(k));}
 function read(){return normalize({pages:form.elements.pages.value,support:form.elements.support.value,custom:form.elements.design.value==='custom',revisions:form.elements.revisions.checked,complex:form.elements.complex.checked,features:featureKeys.filter(k=>form.elements[k].checked),notes:form.elements.notes.value});}
 const $=id=>document.getElementById(id);
 function render(){
  const s=read(),r=calculate(s),valid=form.elements.pages.validity.valid&&form.elements.pages.value!=='';
  $('estimateSummary').hidden=!valid;$('estimateInvalid').hidden=valid;$('estimateQuote').hidden=!valid;if(!valid){$('estimateMobileAmount').textContent=fr?'Vérifiez les pages':'Check page count';$('estimateMobileCare').textContent='';return;}
  try{sessionStorage.setItem(storageKey,JSON.stringify(s))}catch{}
  $('estimateAmount').textContent=money(r.knownBuild,fr);$('estimateMobileAmount').textContent=money(r.knownBuild,fr);
  $('estimateExtraPages').textContent=String(r.extraPages);$('estimatePageCost').textContent=money(r.extraPageCost,fr);
  $('estimateLanguages').textContent=fr?`${r.pages} versions anglaises + ${r.pages} versions françaises`:`${r.pages} English + ${r.pages} French versions`;
  $('estimateMobileCare').textContent=r.monthlyMinimum?(fr?'Service mensuel : dès ':'Monthly plan: from ')+money(r.monthlyMinimum,fr)+(fr?'/mois':'/mo'):(fr?'Aucun plan mensuel':'No monthly plan');
  $('estimateMonthly').textContent=r.monthlyMinimum?(fr?'À partir de ':'From ')+money(r.monthlyMinimum,fr)+(fr?'/mois':'/month'):(fr?'Aucun service mensuel sélectionné':'No monthly service selected');
  $('estimateSupportScope').textContent=support[s.support][fr?'scopeFr':'scopeEn'];
  const careList=$('estimateCareBreakdown');careList.replaceChildren();careList.hidden=s.support!=='care';
  for(const item of careItems(s,fr)){const row=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');term.textContent=item.label;value.textContent=money(item.price,fr)+(fr?'/mois':'/mo');row.append(term,value);careList.append(row);}
  $('estimateCarePreview').textContent=(fr?'Entretien facultatif pour ces choix : dès ':'Optional care for these choices: from ')+money(r.careEstimate,fr)+(fr?'/mois':'/month');
  $('estimateFirstYear').textContent=(fr?'À partir de ':'From ')+money(r.firstYear,fr);
  const list=$('estimateAddons');list.replaceChildren();
  for(const item of items(s,fr)){const row=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');term.textContent=item.label;value.textContent=money(item.price,fr);row.append(term,value);list.append(row);}
  $('estimateCustom').hidden=!s.complex;
  const url=new URL(fr?'/fr/':'/',location.origin);url.searchParams.set('estimate','1');url.searchParams.set('pages',String(s.pages));if(s.support!=='none')url.searchParams.set('support',s.support);if(s.custom)url.searchParams.set('custom','1');if(s.revisions)url.searchParams.set('revisions','1');if(s.complex)url.searchParams.set('complex','1');if(s.features.length)url.searchParams.set('features',s.features.join(','));url.hash='contact';$('estimateQuote').href=url.pathname+url.search+url.hash;
  const switchLink=document.querySelector('[data-language]');if(switchLink){const target=new URL(switchLink.href);for(const k of ['pages','care','support','custom','revisions','complex','features']){target.searchParams.delete(k);if(url.searchParams.has(k))target.searchParams.set(k,url.searchParams.get(k));}switchLink.href=target.href;}
 }
 apply(initial);render();form.addEventListener('input',render);form.addEventListener('change',render);form.addEventListener('submit',e=>e.preventDefault());
 $('estimateReset').addEventListener('click',()=>{apply(normalize({pages:5}));render();document.querySelectorAll('[data-estimate-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));});
 document.querySelectorAll('[data-estimate-preset]').forEach(button=>button.addEventListener('click',()=>{const preset=presets[button.dataset.estimatePreset];if(!preset)return;const notes=form.elements.notes.value;apply(normalize({...preset,notes}));render();document.querySelectorAll('[data-estimate-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
 form.addEventListener('input',()=>document.querySelectorAll('[data-estimate-preset]').forEach(b=>b.setAttribute('aria-pressed','false')));
})(typeof window!=='undefined'?window:globalThis);
