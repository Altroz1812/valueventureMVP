/** Exact word replacements only. Unrecognized numeric speech must not be guessed. */
const words:Record<string,string>={
 'शून्य':'zero','जीरो':'zero','एक':'one','दो':'two','तीन':'three','चार':'four','पांच':'five','पाँच':'five',
 'छह':'six','सात':'seven','आठ':'eight','नौ':'nine','दस':'ten','ग्यारह':'eleven','बारह':'twelve',
 'तेरह':'thirteen','चौदह':'fourteen','पंद्रह':'fifteen','बीस':'twenty','इक्कीस':'twenty one',
 'पच्चीस':'twenty five','तीस':'thirty','चालीस':'forty','पचास':'fifty','सौ':'hundred','हजार':'thousand',
 'हज़ार':'thousand','लाख':'lakh','करोड़':'crore','दशमलव':'point',
 'సున్నా':'zero','ఒకటి':'one','రెండు':'two','మూడు':'three','నాలుగు':'four','ఐదు':'five',
 'ఆరు':'six','ఏడు':'seven','ఎనిమిది':'eight','తొమ్మిది':'nine','పది':'ten',
 'ఇరవై':'twenty','పాతిక':'twenty five','ముప్పై':'thirty','నలభై':'forty','యాభై':'fifty',
 'అరవై':'sixty','డెబ్బై':'seventy','ఎనభై':'eighty','తొంభై':'ninety',
 'వంద':'hundred','వెయ్యి':'thousand','వేలు':'thousand','లక్ష':'lakh','కోటి':'crore','పాయింట్':'point'
};
export function normalizeLocaleNumberWords(spoken:string):string {
 return spoken.normalize('NFC').split(/(\s+)/u).map(x=> /^\s+$/u.test(x)?x:words[x]??x).join('');
}
const aliases:Record<string,readonly string[]>={
 'yes':['हाँ','हां','जी हाँ','అవును','అవునండి'],
 'no':['नहीं','नही','ना','కాదు','లేదు'],
 'not checked':['जांच नहीं की','తనిఖీ చేయలేదు'],
 'not available':['उपलब्ध नहीं','అందుబాటులో లేదు'],
 'unable to verify':['सत्यापित नहीं कर पाए','ధృవీకరించలేకపోయాను']
};
export function matchLocalizedSpokenOption(spoken:string,options:readonly string[]):string|null {
 const n=(s:string)=>s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
 const input=n(spoken);
 return options.find(o=>(aliases[o.toLowerCase()]??[]).some(alias=>n(alias)===input))??null;
}
