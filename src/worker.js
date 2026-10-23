import astroWorker from '@astrojs/cloudflare/entrypoints/server';
export default { async fetch(request, env, context) {
 const url=new URL(request.url);
 if(url.hostname==='www.muttrahsouk.com'||(url.hostname==='muttrahsouk.com'&&url.protocol==='http:')){
  url.protocol='https:';url.hostname='muttrahsouk.com';return new Response(null,{status:308,headers:{location:url.href}});
 }
 const errorAlias=/^\/404(?:\.html|\/)?$/.test(url.pathname);
 if(errorAlias){url.pathname='/404';request=new Request(url,request);}
 const response=await astroWorker.fetch(request,env,context);
 if(errorAlias||response.status===404){const headers=new Headers(response.headers);headers.delete('location');headers.set('x-robots-tag','noindex, follow');headers.set('cache-control','no-store');return new Response(request.method==='HEAD'?null:response.body,{status:404,headers});}
 return request.method==='HEAD'?new Response(null,{status:response.status,headers:response.headers}):response;
} };
