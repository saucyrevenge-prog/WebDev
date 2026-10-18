(()=>{
 const button=document.getElementById('clearSiteData');if(!button)return;
 button.addEventListener('click',()=>{
  let failed=false;
  try{localStorage.removeItem('soucy.language')}catch{failed=true}
  try{sessionStorage.removeItem('soucy.estimator.v1')}catch{failed=true}
  const fr=document.documentElement.lang.startsWith('fr');
  document.getElementById('clearSiteDataStatus').textContent=failed?(fr?'Le navigateur ne permet pas de tout effacer ici. Utilisez ses réglages pour supprimer les données du site.':'Your browser did not allow all stored data to be cleared here. Use its website-data settings to remove it.'):(fr?'La langue enregistrée et le brouillon de l’estimateur ont été effacés de ce navigateur. Les courriels déjà envoyés ne sont pas supprimés.':'The saved language and estimator draft have been cleared from this browser. Previously sent emails have not been deleted.');
 });
})();
