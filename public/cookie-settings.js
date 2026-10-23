(() => {
 const init=()=>{
  const api=window.mutrahAnalytics, a=document.getElementById('analytics-toggle'), s=document.getElementById('cookie-status'), banner=document.getElementById('cookie-banner'), bs=document.getElementById('banner-status');
  if(!api)return;if(a)a.checked=api.get();
  let choice=null;try{choice=localStorage.getItem('mutrah-cookie-consent');}catch{}
  if(banner)banner.hidden=choice==='analytics'||choice==='necessary';
  const save=allow=>{const result=api.set(allow);if(a)a.checked=result.effective;
   const message=result.saved?'تم حفظ الاختيار.' : result.sharedOff?'تعذر حفظ الموافقة؛ التحليل متوقف هنا ولم يبق إذن مؤكد في التخزين.':'تعذر تأكيد الحفظ؛ التحليل متوقف في هذه الصفحة، لكن قد يبقى إذن في التخزين لصفحة أو زيارة أخرى. راجع إعدادات تخزين المتصفح.';
   if(s)s.textContent=message;if(bs)bs.textContent=message;if(banner&&result.saved)banner.hidden=true;
  };
  document.getElementById('save-cookies')?.addEventListener('click',()=>save(!!a?.checked));
  document.getElementById('reject-cookies')?.addEventListener('click',()=>save(false));
  document.getElementById('cookie-accept')?.addEventListener('click',()=>save(true));
  document.getElementById('cookie-reject')?.addEventListener('click',()=>save(false));
  window.addEventListener('storage',()=>{if(a)a.checked=api.get();});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
