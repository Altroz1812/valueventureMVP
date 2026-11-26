import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { N as Mic, P as MicOff, u as Square } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, n as Button, w as SelectValue, x as SelectContent } from "./card-svjjW0Eb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-voice-BmdpI54j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Exact word replacements only. Unrecognized numeric speech must not be guessed. */
var words = {
	"शून्य": "zero",
	"जीरो": "zero",
	"एक": "one",
	"दो": "two",
	"तीन": "three",
	"चार": "four",
	"पांच": "five",
	"पाँच": "five",
	"छह": "six",
	"सात": "seven",
	"आठ": "eight",
	"नौ": "nine",
	"दस": "ten",
	"ग्यारह": "eleven",
	"बारह": "twelve",
	"तेरह": "thirteen",
	"चौदह": "fourteen",
	"पंद्रह": "fifteen",
	"बीस": "twenty",
	"इक्कीस": "twenty one",
	"पच्चीस": "twenty five",
	"तीस": "thirty",
	"चालीस": "forty",
	"पचास": "fifty",
	"सौ": "hundred",
	"हजार": "thousand",
	"हज़ार": "thousand",
	"लाख": "lakh",
	"करोड़": "crore",
	"दशमलव": "point",
	"సున్నా": "zero",
	"ఒకటి": "one",
	"రెండు": "two",
	"మూడు": "three",
	"నాలుగు": "four",
	"ఐదు": "five",
	"ఆరు": "six",
	"ఏడు": "seven",
	"ఎనిమిది": "eight",
	"తొమ్మిది": "nine",
	"పది": "ten",
	"ఇరవై": "twenty",
	"పాతిక": "twenty five",
	"ముప్పై": "thirty",
	"నలభై": "forty",
	"యాభై": "fifty",
	"అరవై": "sixty",
	"డెబ్బై": "seventy",
	"ఎనభై": "eighty",
	"తొంభై": "ninety",
	"వంద": "hundred",
	"వెయ్యి": "thousand",
	"వేలు": "thousand",
	"లక్ష": "lakh",
	"కోటి": "crore",
	"పాయింట్": "point"
};
function normalizeLocaleNumberWords(spoken) {
	return spoken.normalize("NFC").split(/(\s+)/u).map((x) => /^\s+$/u.test(x) ? x : words[x] ?? x).join("");
}
var aliases = {
	"yes": [
		"हाँ",
		"हां",
		"जी हाँ",
		"అవును",
		"అవునండి"
	],
	"no": [
		"नहीं",
		"नही",
		"ना",
		"కాదు",
		"లేదు"
	],
	"not checked": ["जांच नहीं की", "తనిఖీ చేయలేదు"],
	"not available": ["उपलब्ध नहीं", "అందుబాటులో లేదు"],
	"unable to verify": ["सत्यापित नहीं कर पाए", "ధృవీకరించలేకపోయాను"]
};
function matchLocalizedSpokenOption(spoken, options) {
	const n = (s) => s.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
	const input = n(spoken);
	return options.find((o) => (aliases[o.toLowerCase()] ?? []).some((alias) => n(alias) === input)) ?? null;
}
var activeEngine = null;
function VoiceLanguage({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: "Voice language"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value,
			onValueChange: (v) => onChange(v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				"aria-label": "Voice recognition language",
				className: "h-8 w-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "en-IN",
					children: "English (India)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "te-IN",
					children: "Telugu"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "hi-IN",
					children: "Hindi"
				})
			] })]
		})]
	});
}
function VoiceMic({ onTranscript, lang = "en-IN", disabled = false, label = "field" }) {
	const [listening, setListening] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const engineRef = (0, import_react.useRef)(null);
	const callbackRef = (0, import_react.useRef)(onTranscript);
	callbackRef.current = onTranscript;
	(0, import_react.useEffect)(() => () => {
		engineRef.current?.abort();
		if (activeEngine === engineRef.current) activeEngine = null;
		engineRef.current = null;
	}, []);
	function toggle() {
		if (listening) {
			engineRef.current?.stop();
			return;
		}
		if (disabled || typeof window === "undefined") return;
		const host = window;
		const Ctor = host.SpeechRecognition ?? host.webkitSpeechRecognition;
		if (!Ctor) {
			setMessage("Speech recognition unavailable. Enter manually or use supported Chrome/Edge.");
			return;
		}
		if (!window.isSecureContext) {
			setMessage("Microphone requires HTTPS or localhost.");
			return;
		}
		try {
			activeEngine?.abort();
			const engine = new Ctor();
			activeEngine = engine;
			engineRef.current = engine;
			engine.lang = lang;
			engine.continuous = false;
			engine.interimResults = false;
			engine.maxAlternatives = 1;
			engine.onresult = (event) => {
				const chunks = [];
				for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i]?.isFinal) {
					const spoken = event.results[i]?.[0]?.transcript?.trim();
					if (spoken) chunks.push(spoken);
				}
				if (chunks.length) callbackRef.current(chunks.join(" "));
			};
			engine.onerror = (event) => {
				setMessage({
					"not-allowed": "Microphone permission denied.",
					"no-speech": "No speech detected. Try again.",
					"network": "Speech service unavailable. Use manual entry.",
					"language-not-supported": "This recognition language is not supported on this device."
				}[event.error] ?? `Microphone error: ${event.error}`);
			};
			engine.onend = () => {
				if (activeEngine === engine) activeEngine = null;
				if (engineRef.current === engine) engineRef.current = null;
				setListening(false);
			};
			setMessage("");
			engine.start();
			setListening(true);
		} catch (error) {
			setListening(false);
			setMessage(error instanceof Error ? error.message : "Microphone could not start.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex shrink-0 items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "icon",
			className: "min-h-11 min-w-11 md:min-h-9 md:min-w-9",
			variant: listening ? "destructive" : "outline",
			"aria-label": `${listening ? "Stop voice entry for" : "Dictate"} ${label}`,
			title: listening ? `Stop dictation: ${label}` : `Dictate: ${label}`,
			disabled,
			onClick: toggle,
			children: listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }) : disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
		}), message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: "status",
			className: "max-w-48 text-xs text-muted-foreground",
			children: message
		})]
	});
}
function spokenNumber(value) {
	const clean = Array.from(normalizeLocaleNumberWords(value)).map((ch) => {
		const cp = ch.codePointAt(0) ?? 0;
		if (cp >= 2406 && cp <= 2415) return String(cp - 2406);
		if (cp >= 3174 && cp <= 3183) return String(cp - 3174);
		return ch;
	}).join("").toLowerCase().trim().replace(/\b(rupees?|feet|foot|meters?|sq\.?\s?ft|percent|kilometers?|km)\b/g, "").trim();
	const compact = clean.replace(/[₹,%\s,]/g, "");
	if (/^-?\d+(?:\.\d+)?$/.test(compact)) return compact;
	const units = {
		zero: 0,
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10,
		eleven: 11,
		twelve: 12,
		thirteen: 13,
		fourteen: 14,
		fifteen: 15,
		sixteen: 16,
		seventeen: 17,
		eighteen: 18,
		nineteen: 19,
		twenty: 20,
		thirty: 30,
		forty: 40,
		fifty: 50,
		sixty: 60,
		seventy: 70,
		eighty: 80,
		ninety: 90
	};
	const magnitudes = {
		thousand: 1e3,
		lakh: 1e5,
		lac: 1e5,
		crore: 1e7
	};
	const parts = clean.replace(/-/g, " ").split(/\s+/).filter((t) => t && t !== "and");
	if (!parts.length) return null;
	const point = parts.indexOf("point");
	const integerParts = point >= 0 ? parts.slice(0, point) : parts;
	if (integerParts.length === 0) return null;
	let total = 0, group = 0;
	if (integerParts.length > 1 && integerParts.every((t) => units[t] !== void 0 && units[t] < 10)) total = Number(integerParts.map((t) => units[t]).join(""));
	else {
		for (const token of integerParts) {
			if (units[token] !== void 0) {
				group += units[token];
				continue;
			}
			if (token === "hundred") {
				group = (group || 1) * 100;
				continue;
			}
			if (magnitudes[token] !== void 0) {
				total += (group || 1) * magnitudes[token];
				group = 0;
				continue;
			}
			if (/^\d+$/.test(token)) {
				group += Number(token);
				continue;
			}
			return null;
		}
		total += group;
	}
	if (point < 0) return String(total);
	const decimal = parts.slice(point + 1).map((t) => {
		if (units[t] !== void 0 && units[t] < 10) return String(units[t]);
		if (/^\d$/.test(t)) return t;
		return null;
	});
	if (!decimal.length || decimal.some((x) => x === null)) return null;
	return `${total}.${decimal.join("")}`;
}
function matchSpokenOption(text, options) {
	const normalize = (s) => s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
	const spoken = normalize(text);
	return options.find((o) => normalize(o) === spoken) ?? matchLocalizedSpokenOption(text, options);
}
function VoiceOption({ options, onSelect, lang, disabled, label }) {
	const [hint, setHint] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
			label,
			lang: lang ?? "en-IN",
			disabled: disabled ?? false,
			onTranscript: (spoken) => {
				const chosen = matchSpokenOption(spoken, options);
				if (chosen) {
					setHint("");
					onSelect(chosen);
				} else setHint(`No exact option for “${spoken}”. Select manually.`);
			}
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: "status",
			className: "max-w-48 text-xs text-muted-foreground",
			children: hint
		})]
	});
}
//#endregion
export { spokenNumber as i, VoiceMic as n, VoiceOption as r, VoiceLanguage as t };
