export const LAT=23.6204018, LON=58.5645, TZ='Asia/Muscat';
export const TTL=30*60*1000, DEADLINE=4500;
const codes=[0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99];
const finite=(v:unknown,min:number,max:number):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export const stamp=(s:string)=>Date.parse(/[Zz]|[+-]\d\d:\d\d$/.test(s)?s:s+'+04:00');
export const dateAt=(now:number)=>new Date(now+4*3600000).toISOString().slice(0,10);
export interface Forecast {current:{time:string;temperature_2m:number;relative_humidity_2m:number;apparent_temperature:number;weather_code:number;wind_speed_10m:number;is_day:number;precipitation:number};daily:{time:string[];weather_code:number[];temperature_2m_max:number[];temperature_2m_min:number[];precipitation_probability_max:number[];wind_speed_10m_max:number[];uv_index_max:number[]}}
export interface Marine {hourly:{time:string[];sea_level_height_msl:number[];wave_height:number[];sea_surface_temperature:number[]}}
export function validForecast(x:any,now=Date.now()):x is Forecast {
 if(x?.timezone!==TZ||x?.utc_offset_seconds!==14400||!x?.current||!x?.daily)return false;const c=x.current,d=x.daily;
 if(typeof c.time!=='string'||!Number.isFinite(stamp(c.time))||Math.abs(stamp(c.time)-now)>3*3600000)return false;
 for(const [k,lo,hi] of [['temperature_2m',-90,65],['apparent_temperature',-100,90],['relative_humidity_2m',0,100],['wind_speed_10m',0,500],['precipitation',0,1000],['is_day',0,1]] as const)if(!finite(c[k],lo,hi))return false;
 if(![0,1].includes(c.is_day)||!codes.includes(c.weather_code)||!Array.isArray(d.time)||d.time.length!==7)return false;
 for(let i=0;i<7;i++)if(d.time[i]!==dateAt(Date.parse(dateAt(now)+'T00:00:00+04:00')+i*86400000))return false;
 for(const [k,lo,hi] of [['temperature_2m_max',-90,65],['temperature_2m_min',-90,65],['precipitation_probability_max',0,100],['wind_speed_10m_max',0,500],['uv_index_max',0,30]] as const)if(!Array.isArray(d[k])||d[k].length!==7||!d[k].every((v:unknown)=>finite(v,lo,hi)))return false;
 return Array.isArray(d.weather_code)&&d.weather_code.length===7&&d.weather_code.every((v:number)=>codes.includes(v))&&d.temperature_2m_max.every((v:number,i:number)=>v>=d.temperature_2m_min[i]);
}
export function validMarine(x:any,now=Date.now()):x is Marine {
 const h=x?.hourly;if(x?.timezone!==TZ||x?.utc_offset_seconds!==14400||!h||!Array.isArray(h.time)||h.time.length!==48)return false;
 const t=h.time.map((v:unknown)=>typeof v==='string'?stamp(v):NaN);
 if(t.some((v:number,i:number)=>!Number.isFinite(v)||(i>0&&v-t[i-1]!==3600000))||Math.min(...t.map((v:number)=>Math.abs(v-now)))>3600000)return false;
 for(const [k,lo,hi] of [['sea_level_height_msl',-20,20],['wave_height',0,40],['sea_surface_temperature',-5,50]] as const)if(!Array.isArray(h[k])||h[k].length!==48||!h[k].every((v:unknown)=>finite(v,lo,hi)))return false;
 return true;
}
export function providerURL(marine=false){const u=new URL(marine?'https://marine-api.open-meteo.com/v1/marine':'https://api.open-meteo.com/v1/forecast');u.searchParams.set('latitude',String(LAT));u.searchParams.set('longitude',String(LON));u.searchParams.set('timezone',TZ);u.searchParams.set('forecast_days',marine?'2':'7');if(marine)u.searchParams.set('hourly','sea_level_height_msl,wave_height,sea_surface_temperature');else{u.searchParams.set('current','temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day,precipitation');u.searchParams.set('daily','weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max');}return u.toString();}
const memory=new Map<string,{at:number,data:unknown}>();
export async function load<T>(url:string,valid:(x:unknown,now?:number)=>x is T):Promise<T|null>{
 const now=Date.now(),hit=memory.get(url);if(hit&&now-hit.at<TTL&&valid(hit.data,now))return hit.data;
 const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;
 const work=async()=>{let cache:Cache|undefined;try{cache=(globalThis as any).caches?.default;}catch{}
  if(cache)try{const r=await cache.match(new Request(url));if(r?.ok){const record:any=await r.json();if(!controller.signal.aborted&&finite(record?.at,Date.now()-TTL,Date.now())&&valid(record.data,Date.now())){memory.set(url,{at:record.at,data:record.data});return record.data;}}}catch{}
  if(controller.signal.aborted)return null;
  const r=await fetch(url,{signal:controller.signal,headers:{accept:'application/json'}});if(!r.ok)return null;const x=await r.json();if(controller.signal.aborted||!valid(x,Date.now()))return null;
  memory.set(url,{at:Date.now(),data:x});if(cache)void cache.put(new Request(url),new Response(JSON.stringify({at:Date.now(),data:x}),{headers:{'content-type':'application/json','cache-control':'public, max-age=1800'}})).catch(()=>{});return x;
 };
 try{return await Promise.race([work(),new Promise<null>(resolve=>{timer=setTimeout(()=>{controller.abort();resolve(null);},DEADLINE);})]);}catch{return null;}finally{clearTimeout(timer);}
}
export const forecast=()=>load(providerURL(),validForecast);
export const marine=()=>load(providerURL(true),validMarine);
