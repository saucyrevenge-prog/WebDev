/* One shared language preference for every portfolio page. */
(()=>{
 const url=new URL(location.href),explicit=url.searchParams.get('lang');
 const isFrench=url.pathname==='/fr'||url.pathname.startsWith('/fr/');
 const current=isFrench?'fr':'en';
 const englishPath=isFrench?(url.pathname.slice(3)||'/'):url.pathname;
 const supported=['/','/index.html','/projects/buildcurrent/','/projects/elm-city/','/projects/jim-soucy/'];
 try{
  if(explicit==='en'||explicit==='fr'){
   localStorage.setItem('soucy.language',explicit);
   url.searchParams.delete('lang');history.replaceState(null,'',url.pathname+url.search+url.hash);
  }else{
   const preferred=localStorage.getItem('soucy.language');
   if(preferred&&preferred!==current&&supported.includes(englishPath)){
    url.pathname=preferred==='fr'?'/fr'+englishPath:englishPath;
    location.replace(url.href);return;
   }
   localStorage.setItem('soucy.language',current);
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
