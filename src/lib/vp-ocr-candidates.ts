/** P3 deterministic OCR suggestions: never assert OCR is verified or invent missing values. */
export type OcrPage = { page: number; text: string; truncated: boolean; engine?: 'pdf-text'|'tesseract'|'paddleocr-3.3.2' };
export type OcrResponse = {
  document_id: string;
  case_num: number;
  document_name: string;
  provider: 'google-vision' | 'local-tesseract' | 'local-paddleocr' | 'saved-unknown';
  pages: OcrPage[];
  processing_limit: string;
  request_id: string;
  pdf_page_count?: number;
  next_pdf_page?: number | null;
};
export type OcrSuggestion = {
  field: string;
  label: string;
  value: string;
  page: number;
  source_line: string;
  /** Explicit unit found on the source line; never inferred from inspection settings. */
  source_unit?: 'Feet' | 'Metres';
};

type Rule = {
  field: string;
  label: string;
  re: RegExp;
  kind: 'text' | 'number' | 'choice';
  unitGroup?: number;
  choices?: readonly string[];
};

// Only explicitly labelled lines. No inference from unlabeled text or unrelated amounts.
const rules: readonly Rule[] = [
  { field: 'owner_name', label: 'Property owner name', kind: 'text', re: /^(?:property\s+owner(?:\s+name)?|name\s+of\s+owner|owner\s+name)\s*[:\-]\s*(.+)$/i },
  { field: 'site_address', label: 'Site address', kind: 'text', re: /^(?:property\s+address|site\s+address|address\s+of\s+property)\s*[:\-]\s*(.+)$/i },
  { field: 'inspection_contact', label: 'Inspection contact', kind: 'text', re: /^(?:inspection\s+contact|contact\s+person)\s*[:\-]\s*(.+)$/i },
  { field: 'inspection_contact_mobile', label: 'Inspection mobile', kind: 'text', re: /^(?:contact\s+(?:mobile|number)|mobile\s+number)\s*[:\-]\s*(\+?[0-9\s\-]{10,16})$/i },
  { field: 'land_length', label: 'Land length (verify units)', kind: 'number', unitGroup: 2, re: /^(?:(?:plot|land)\s+length|length\s+of\s+(?:plot|land))\s*[:\-]\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(feet|ft|metres?|meters?|m))?$/i },
  { field: 'land_breadth', label: 'Land breadth (verify units)', kind: 'number', unitGroup: 2, re: /^(?:(?:plot|land)\s+(?:breadth|width)|(?:breadth|width)\s+of\s+(?:plot|land))\s*[:\-]\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(feet|ft|metres?|meters?|m))?$/i },
  { field: 'property_age', label: 'Age (years)', kind: 'number', re: /^(?:building\s+age|age\s+of\s+(?:property|building))\s*[:\-]\s*([0-9]{1,3})(?:\s*(?:years?|yrs?))?$/i },
  { field: 'approach_road_width', label: 'Approach road width (verify units)', kind: 'number', unitGroup: 2, re: /^(?:approach\s+road\s+width|width\s+of\s+approach\s+road)\s*[:\-]\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(feet|ft|metres?|meters?|m))?$/i },
  { field: 'plot_facing', label: 'Plot facing', kind: 'choice', choices: ['East','West','North','South'], re: /^(?:plot\s+facing|facing\s+of\s+plot)\s*[:\-]\s*(east|west|north|south)$/i },
  // P6 expanded *label-only* inspection mapping. OCR is not authoritative.
  { field: 'ownership_type', label: 'Ownership type', kind: 'choice', choices: ['Freehold','Lease'], re: /^(?:ownership\s+type|type\s+of\s+ownership)\s*[:\-]\s*(freehold|lease)$/i },
  { field: 'property_demarcated', label: 'Demarcated at site', kind: 'choice', choices: ['Yes','No','Unable to verify'], re: /^(?:property\s+demarcated|demarcation)\s*[:\-]\s*(yes|no|unable\s+to\s+verify)$/i },
  { field: 'property_type', label: 'Property type', kind: 'choice', choices: ['Resi','Com','Mix','Land'], re: /^(?:type\s+of\s+property|property\s+type)\s*[:\-]\s*(resi|com|mix|land)$/i },
  { field: 'occupancy', label: 'Occupancy', kind: 'choice', choices: ['Self occupied','Tenant','Vacant','Under construction','Owner occupied','Tenant occupied','Mixed'], re: /^(?:occupancy|occupancy\s+status)\s*[:\-]\s*(self\s+occupied|tenant|vacant|under\s+construction|owner\s+occupied|tenant\s+occupied|mixed)$/i },
  { field: 'locality_type', label: 'Locality type', kind: 'choice', choices: ['HIG','MIG','LIG'], re: /^(?:locality\s+type|locality\s+category)\s*[:\-]\s*(hig|mig|lig)$/i },
  { field: 'structure_type', label: 'Structure type', kind: 'choice', choices: ['Load Bearing','Column-Beam'], re: /^(?:structure\s+type|type\s+of\s+structure)\s*[:\-]\s*(load\s+bearing|column[\s-]beam)$/i },
  { field: 'floor_count', label: 'Number of floors', kind: 'number', re: /^(?:number\s+of\s+floors|no\.?\s+of\s+floors)\s*[:\-]\s*([0-9]{1,2})$/i },
  { field: 'block_count', label: 'Number of blocks', kind: 'number', re: /^(?:number\s+of\s+blocks|no\.?\s+of\s+blocks)\s*[:\-]\s*([0-9]{1,2})$/i },
  { field: 'unit_count', label: 'Number of units', kind: 'number', re: /^(?:number\s+of\s+units|no\.?\s+of\s+units)\s*[:\-]\s*([0-9]{1,4})$/i },
  { field: 'completion_percent', label: 'Completion percentage', kind: 'number', re: /^(?:completion\s+(?:percent|percentage)|%\s*completion)\s*[:\-]\s*([0-9]{1,3}(?:\.[0-9]+)?)\s*%?$/i },
  { field: 'amenities', label: 'Amenities', kind: 'text', re: /^(?:amenities|amenities\s+provided)\s*[:\-]\s*(.+)$/i },
  { field: 'vicinity', label: 'Nearby landmark', kind: 'text', re: /^(?:nearby\s+landmark|close\s+vicinity|landmark)\s*[:\-]\s*(.+)$/i },
  { field: 'land_rate_reference', label: 'Land rate reference (not a valuation rate)', kind: 'text', re: /^(?:land\s+rate\s+(?:reference|ref))\s*[:\-]\s*(.+)$/i },
];

function valid(rule: Rule, raw: string): string | null {
  const v = raw.replace(/\s+/g, ' ').trim();
  if (!v || v.length > 250 || /[<>\x00-\x08]/.test(v)) return null;
  if (rule.kind === 'number') {
    const normalized = v.replace(/,/g, '');
    const n = Number(normalized);
    return Number.isFinite(n) && n >= 0 && n <= 10000000 ? String(n) : null;
  }
  if (rule.kind === 'choice') {
    const normalized = v.toLowerCase().replace(/[\s-]+/g, ' ');
    return rule.choices?.find(choice => choice.toLowerCase().replace(/[\s-]+/g, ' ') === normalized) ?? null;
  }
  return v.length >= 3 ? v : null;
}

export function findOcrSuggestions(pages: readonly OcrPage[]): OcrSuggestion[] {
  const out: OcrSuggestion[] = [];
  const seen = new Set<string>();
  for (const page of pages) {
    if (!Number.isInteger(page.page) || page.page < 1) continue;
    for (const original of page.text.split(/\r?\n/).slice(0, 1000)) {
      const line = original.trim().slice(0, 300);
      if (!line) continue;
      for (const rule of rules) {
        const match = line.match(rule.re);
        if (!match) continue;
        const value = valid(rule, match[1] ?? '');
        if (value === null) continue;
        const key = `${page.page}\u0000${rule.field}\u0000${value}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const unitRaw = rule.unitGroup ? (match[rule.unitGroup] ?? '').toLowerCase() : '';
        const source_unit = /^(?:ft|feet)$/.test(unitRaw) ? 'Feet' : /^(?:m|metre|metres|meter|meters)$/.test(unitRaw) ? 'Metres' : undefined;
        out.push({field: rule.field, label: rule.label, value, page: page.page, source_line: line,
          ...(source_unit ? {source_unit} : {})});
      }
    }
  }
  return out.slice(0, 50);
}
