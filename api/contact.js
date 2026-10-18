const LIMIT=12000;
const send=(res,code,data)=>{res.statusCode=code;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))};
const clean=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=async function handler(req,res){
 const fr=req.body?.language==='fr'||(typeof req.body==='string'&&(()=>{try{return JSON.parse(req.body).language==='fr'}catch{return false}})());
 const error=(en,frText)=>({error:fr?frText:en});
 if(req.method!=='POST'){res.setHeader('Allow','POST');return send(res,405,error("Method not allowed.","Méthode non permise."))}
 if(Number(req.headers['content-length']||0)>LIMIT)return send(res,413,error("Submission too large.","Votre demande est trop volumineuse."));
 let data=req.body;
 try{if(typeof data==='string')data=JSON.parse(data)}catch{return send(res,400,error("Invalid request.","Demande invalide."))}
 if(!data||typeof data!=='object'||Array.isArray(data))return send(res,400,error("Invalid request.","Demande invalide."));
 // Honeypot field stays hidden from humans. Return the same success response to bots.
 if(data.company_website)return send(res,200,{ok:true});
 const name=clean(data.name,90),email=clean(data.email,254),service=clean(data.service,80),budget=clean(data.budget,60),message=clean(data.message,4500);
 if(name.length<2||message.length<20||!["Website development", "Custom software", "Booking or customer portal", "Website maintenance", "Something else", "Website development or redesign", "Bilingual website", "$500 bilingual website offer", "Custom software or dashboard", "Booking, customer or staff portal", "Payments, integrations or automation", "SEO, hosting or website maintenance", "Software consulting or modernization"].includes(service)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.includes('\n')||email.includes('\r'))return send(res,400,error("Please check your details and message.","Veuillez vérifier vos coordonnées et votre message."));
 // Only send if email is fully configured; never pretend an inquiry was delivered.
 const key=process.env.RESEND_API_KEY,from=process.env.RESEND_FROM_EMAIL;
 if(!key||!from)return send(res,503,error("The form is temporarily unavailable. Please email saucyrevenge@gmail.com directly.","Le formulaire est temporairement indisponible. Écrivez directement à saucyrevenge@gmail.com."));
 const secret=process.env.TURNSTILE_SECRET_KEY;
 if(secret){
   const token=clean(data.turnstileToken,2048);
   if(!token)return send(res,400,error("Please complete the security check.","Veuillez effectuer la vérification de sécurité."));
   try{const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:token}),signal:AbortSignal.timeout(6000)});const result=await check.json();if(!result.success)return send(res,400,error("Security check failed. Please try again.","La vérification de sécurité a échoué. Veuillez réessayer."))}catch{return send(res,503,error("Security check unavailable. Please try again.","La vérification de sécurité est indisponible. Veuillez réessayer."))}
 }
 const lines=[['Name',name],['Email',email],['Service',service],['Budget',budget||'Not provided'],['Project details',message]];
 const html='<div style="font:16px Arial,sans-serif;line-height:1.6;max-width:660px"><h2>New portfolio inquiry</h2>'+lines.map(([k,v])=>'<p><b>'+escapeHtml(k)+'</b><br>'+escapeHtml(v).replace(/\n/g,'<br>')+'</p>').join('')+'</div>';
 try{
   const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:['saucyrevenge@gmail.com'],reply_to:email,subject:'Portfolio inquiry: '+service,text:lines.map(([k,v])=>k+': '+v).join('\n\n'),html}),signal:AbortSignal.timeout(10000)});
   if(!response.ok){console.error('Resend rejected message',response.status);return send(res,502,error("Could not send your message. Please email me directly.","Impossible d’envoyer votre message. Veuillez m’écrire directement par courriel."))}
   return send(res,200,{ok:true});
 }catch(e){console.error('Portfolio email delivery failed');return send(res,502,error("Could not send your message. Please email me directly.","Impossible d’envoyer votre message. Veuillez m’écrire directement par courriel."))}
};