/** Schematic coordinates only. Never use these for land area or valuation. */
export const P22_KEY='__vp_p22_sketch_v1';
export const WIDTH=600, HEIGHT=360, MAX_POINTS=24;
export type Point={x:number;y:number;label:string};
export type Sketch={name:string;points:Point[];note:string};
export type Sketches={version:1;plot:Sketch;floor:Sketch};
export const emptySketches=():Sketches=>({version:1,plot:{name:'Plot outline',points:[],note:''},floor:{name:'Floor outline',points:[],note:''}});
const obj=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const text=(x:unknown,max:number):x is string=>typeof x==='string'&&x.length<=max;
function bounded(x:unknown,max:number):x is number{return typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max;}
function parseSketch(x:unknown):Sketch{
 if(!obj(x)||!text(x['name'],80)||!text(x['note'],500)||!Array.isArray(x['points'])||x['points'].length>MAX_POINTS)throw new Error('Invalid sketch');
 const points=x['points'].map((p:unknown):Point=>{if(!obj(p)||!bounded(p['x'],WIDTH)||!bounded(p['y'],HEIGHT)||!text(p['label'],80))throw new Error('Invalid sketch vertex');return {x:p['x'],y:p['y'],label:p['label']};});
 return {name:x['name'],note:x['note'],points};
}
export function decodeSketches(raw:string|undefined):Sketches{
 if(!raw)return emptySketches();if(raw.length>12000)throw new Error('Sketch exceeds size limit');const x:unknown=JSON.parse(raw);if(!obj(x)||x['version']!==1)throw new Error('Unsupported sketch version');return {version:1,plot:parseSketch(x['plot']),floor:parseSketch(x['floor'])};
}
export function encodeSketches(x:Sketches):string{return JSON.stringify(decodeSketches(JSON.stringify(x)));}
export function clampPoint(x:number,y:number):Point{return {x:Math.round(Math.min(WIDTH,Math.max(0,x))),y:Math.round(Math.min(HEIGHT,Math.max(0,y))),label:''};}
function intersects(a:Point,b:Point,c:Point,d:Point):boolean{
 const cross=(p:Point,q:Point,r:Point)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
 const on=(p:Point,q:Point,r:Point)=>cross(p,q,r)===0&&r.x>=Math.min(p.x,q.x)&&r.x<=Math.max(p.x,q.x)&&r.y>=Math.min(p.y,q.y)&&r.y<=Math.max(p.y,q.y);
 const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b);
 return (x*y<0&&z*w<0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);
}
export function sketchSubmissionError(raw:string|undefined):string|null{
 try{const d=decodeSketches(raw);for(const k of ['plot','floor'] as const){const p=d[k].points;if(p.length>0&&p.length<3)return `${k} outline needs at least three vertices or must be cleared.`;if(p.length>=3){const unique=new Set(p.map(v=>`${v.x}:${v.y}`));if(unique.size!==p.length)return `${k} outline contains duplicate vertices.`;const a=p.reduce((s,v,i)=>{const q=p[(i+1)%p.length]!;return s+v.x*q.y-q.x*v.y;},0);if(a===0)return `${k} outline is degenerate.`;for(let i=0;i<p.length;i++)for(let j=i+2;j<p.length;j++){if(i===0&&j===p.length-1)continue;if(intersects(p[i]!,p[(i+1)%p.length]!,p[j]!,p[(j+1)%p.length]!))return `${k} outline crosses itself.`;}}}return null;}catch(e){return e instanceof Error?e.message:String(e);}
}
export function validMapPoint(lat:unknown,lng:unknown):lat is number{return typeof lat==='number'&&Number.isFinite(lat)&&Math.abs(lat)<=85.05112878&&typeof lng==='number'&&Number.isFinite(lng)&&Math.abs(lng)<=180;}
