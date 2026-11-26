import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/** Visual aid from entered measurements and site boundaries; not a certified survey. */
export function VpPlotSketch({values}:{values:Record<string,string>}) {
  const read=(key:string)=>String(values[key]??'').trim();
  const x=Number(read('land_length')),y=Number(read('land_breadth'));
  const measured=Number.isFinite(x)&&x>0&&Number.isFinite(y)&&y>0;
  const aspect=measured?Math.max(0.6,Math.min(1.8,x/y)):1.25;
  const width=210*aspect,height=210;
  const left=340-width/2,top=96;
  const frontage=read('plot_facing');
  const boundary=(direction:'north'|'south'|'east'|'west')=>read(`boundary_${direction}_site`)||'Not verified';
  const label=(s:string)=>s.length>36?s.slice(0,33)+'…':s;
  return <Card>
    <CardHeader><CardTitle className="text-base">Indicative plot sketch</CardTitle></CardHeader>
    <CardContent>
      <svg viewBox="0 0 680 380" role="img" aria-label="Indicative property boundaries diagram, not to scale" className="w-full max-w-3xl rounded border bg-white">
        <rect x={left} y={top} width={width} height={height} fill="#e2e8f0" stroke="#334155" strokeWidth="3"/>
        <text x="340" y="183" textAnchor="middle" fontSize="17" fill="#0f172a">Plot (not to scale)</text>
        <text x="340" y="209" textAnchor="middle" fontSize="13" fill="#334155">{measured?`${x} × ${y} ${read('measurement_unit')||'Feet'}`:'Measurements not verified'}</text>
        <text x="340" y="230" textAnchor="middle" fontSize="13" fill="#334155">{`Facing: ${frontage||'Not confirmed'}`}</text>
        <text x="340" y="52" textAnchor="middle" fontSize="14" fill="#0f172a">NORTH</text>
        <text x="340" y="73" textAnchor="middle" fontSize="12" fill="#334155">{label(boundary('north'))}</text>
        <text x="340" y="341" textAnchor="middle" fontSize="14" fill="#0f172a">SOUTH</text>
        <text x="340" y="360" textAnchor="middle" fontSize="12" fill="#334155">{label(boundary('south'))}</text>
        <text x="74" y="173" textAnchor="middle" fontSize="14" fill="#0f172a">WEST</text>
        <text x="74" y="197" textAnchor="middle" fontSize="12" fill="#334155">{label(boundary('west'))}</text>
        <text x="605" y="173" textAnchor="middle" fontSize="14" fill="#0f172a">EAST</text>
        <text x="605" y="197" textAnchor="middle" fontSize="12" fill="#334155">{label(boundary('east'))}</text>
        <path d="M620 95 L620 45 M620 45 L612 57 M620 45 L628 57" fill="none" stroke="#111827" strokeWidth="2"/>
        <text x="620" y="33" textAnchor="middle" fontSize="14" fill="#111827">N</text>
      </svg>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{(['north','south','east','west'] as const).map(d=><div className="rounded-lg border p-2" key={d}><dt className="font-medium capitalize">{d}</dt><dd className="break-words text-muted-foreground">{boundary(d)}</dd></div>)}<div><dt className="font-medium">Measurements</dt><dd>{measured?`${x} × ${y} ${read('measurement_unit')||'Feet'}`:'Not verified'}</dd></div><div><dt className="font-medium">Facing</dt><dd>{frontage||'Not confirmed'}</dd></div></dl><p className="mt-2 text-xs text-muted-foreground">Indicative only; no survey coordinates or certified dimensions are inferred. The Excel export contains an editable native drawing with the same field labels.</p>
    </CardContent>
  </Card>;
}
