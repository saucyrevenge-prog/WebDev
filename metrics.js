/* Vercel anonymous page statistics and Core Web Vitals on public pages. */
(function initPortfolioMetrics(){
  if (!/(^|\.)soucy\.company$/i.test(location.hostname)) return;
  if (window.__portfolioMetricsLoaded) return;
  window.__portfolioMetricsLoaded=true;
  window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};
  for(const source of ["/_vercel/insights/script.js","/_vercel/speed-insights/script.js"]){
    const script=document.createElement("script");script.defer=true;script.src=source;
    document.head.appendChild(script);
  }
})();
