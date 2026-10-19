/* One shared language preference for every portfolio page. */
(()=>{
 const url=new URL(location.href),explicit=url.searchParams.get('lang');
 const isFrench=url.pathname==='/fr'||url.pathname.startsWith('/fr/');
 const current=isFrench?'fr':'en';
 const offerRoutes={'/bilingual-websites/':'/fr/sites-web-bilingues/','/pricing-estimator/':'/fr/estimateur-de-prix/','/privacy/':'/fr/confidentialite/','/terms/':'/fr/conditions/','/accessibility/':'/fr/accessibilite/'};
 const englishPath=Object.keys(offerRoutes).find(path=>offerRoutes[path]===url.pathname)||(isFrench?(url.pathname.slice(3)||'/'):url.pathname);
 const supported=['/privacy/','/terms/','/accessibility/','/pricing-estimator/','/bilingual-websites/','/','/index.html','/projects/buildcurrent/','/projects/elm-city/','/projects/jim-soucy/'];
 try{
  if(explicit==='en'||explicit==='fr'){
   localStorage.setItem('soucy.language',explicit);
   url.searchParams.delete('lang');history.replaceState(null,'',url.pathname+url.search+url.hash);
  }else{
   const preferred=localStorage.getItem('soucy.language');
   const welcomed=localStorage.getItem('soucy.welcome.chosen.v1')==='yes';
   if(welcomed&&!url.searchParams.has('welcome')&&preferred&&preferred!==current&&supported.includes(englishPath)){
    url.pathname=preferred==='fr'?(offerRoutes[englishPath]||'/fr'+englishPath):englishPath;
    location.replace(url.href);return;
   }
   if(preferred==='en'||preferred==='fr')localStorage.setItem('soucy.language',current);
  }
 }catch{/* Explicit language URLs still work when browser storage is unavailable. */}
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-language]').forEach(link=>{
   // Keep the section when switching from the homepage navigation.
   const target=new URL(link.href);target.hash=location.hash;link.href=target.href;
   link.addEventListener('click',()=>{const currentTarget=new URL(link.href);currentTarget.hash=location.hash;link.href=currentTarget.href;try{localStorage.setItem('soucy.language',link.dataset.language)}catch{}});
  });
 });
})();
