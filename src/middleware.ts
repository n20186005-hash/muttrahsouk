import { defineMiddleware } from 'astro:middleware';
export const onRequest=defineMiddleware(async(context,next)=>{
 const response=await next();
 if(response.status===404||/^\/404(?:\.html|\/)?$/.test(context.url.pathname)){
  const headers=new Headers(response.headers);headers.delete('location');headers.set('x-robots-tag','noindex, follow');headers.set('cache-control','no-store');
  return new Response(context.request.method==='HEAD'?null:response.body,{status:404,headers});
 }
 if(response.headers.get('content-type')?.includes('text/html'))response.headers.set('cache-control','no-store');
 if(context.request.method==='HEAD')return new Response(null,{status:response.status,headers:response.headers});
 return response;
});
