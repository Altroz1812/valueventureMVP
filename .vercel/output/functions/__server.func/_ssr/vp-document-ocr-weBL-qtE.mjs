import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Tt as ChevronLeft, at as FileSearch, lt as ExternalLink, p as ShieldAlert, rt as FileText, wt as ChevronRight } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, w as SelectValue, x as SelectContent } from "./card-svjjW0Eb.mjs";
import { r as openVpDocument, t as DOC_BUCKET } from "./vp-cases-DcoVfkM7.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { s as propertyError } from "./vp-property-data-NyFxtdD0.mjs";
import { t as Checkbox } from "./checkbox-BI658bIE.mjs";
import { a as usePropertyMaster, r as useCasePropertyLinks } from "./vp-property-master-z5usx4CM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-document-ocr-weBL-qtE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var previewMimes = [
	"application/pdf",
	"image/jpeg",
	"image/png"
];
function previewable(d, tenant, num) {
	return !!tenant && Number.isSafeInteger(num) && num > 0 && !!d.storage_path && d.storage_path.startsWith(`${tenant}/${num}/`) && d.storage_path.length > `${tenant}/${num}/`.length && !d.storage_path.split("/").some((part) => part === ".." || part === "." || !part) && !d.storage_path.includes("\\") && previewMimes.includes(d.mime);
}
function selectedEvidence(docs, id) {
	return docs.find((d) => d.id === id) ?? docs.find((d) => !!d.storage_path) ?? docs[0];
}
function filterEvidence(docs, term) {
	const q = term.trim().toLocaleLowerCase();
	return docs.filter((d) => !q || d.name.toLocaleLowerCase().includes(q));
}
function comparisonStatus(a, b) {
	const norm = (x) => typeof x === "string" ? x.trim() : x == null ? "" : String(x);
	const left = norm(a), right = norm(b);
	return !left || !right ? "Missing" : left === right ? "Same" : "Different";
}
var maxBytes = 10485760;
function ImagePreview({ blob, name }) {
	const [url, setUrl] = (0, import_react.useState)("");
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const u = URL.createObjectURL(blob);
		setUrl(u);
		setFailed(false);
		return () => URL.revokeObjectURL(u);
	}, [blob]);
	return failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "alert",
		className: "p-3 text-sm text-destructive",
		children: "Image cannot be displayed. Open the original securely."
	}) : url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: `Original document: ${name}`,
		onError: () => setFailed(true),
		className: "mx-auto h-auto max-w-full object-contain"
	}) : null;
}
function PdfPreview({ blob, page, onCount }) {
	const canvas = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let destroy;
		let cancelRender;
		setBusy(true);
		setError("");
		(async () => {
			try {
				const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
				const bytes = new Uint8Array(await blob.arrayBuffer());
				if (cancelled) return;
				pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
				const task = pdfjs.getDocument({
					data: bytes,
					isEvalSupported: false
				});
				destroy = () => task.destroy();
				const pdf = await task.promise;
				if (cancelled) return;
				onCount(pdf.numPages);
				if (!Number.isInteger(page) || page < 1 || page > pdf.numPages) throw Error(`Requested source page ${page} is outside this document (${pdf.numPages} pages).`);
				const p = await pdf.getPage(page);
				if (cancelled) return;
				const base = p.getViewport({ scale: 1 });
				const viewport = p.getViewport({ scale: Math.min(2, 1800 / Math.max(base.width, base.height)) });
				const tmp = window.document.createElement("canvas");
				tmp.width = Math.ceil(viewport.width);
				tmp.height = Math.ceil(viewport.height);
				const ctx = tmp.getContext("2d");
				if (!ctx) throw Error("Canvas unavailable");
				const render = p.render({
					canvas: tmp,
					canvasContext: ctx,
					viewport
				});
				cancelRender = () => render.cancel();
				await render.promise;
				if (!cancelled && canvas.current) {
					canvas.current.width = tmp.width;
					canvas.current.height = tmp.height;
					canvas.current.getContext("2d")?.drawImage(tmp, 0, 0);
					setBusy(false);
				}
				tmp.width = 0;
				tmp.height = 0;
			} catch (e) {
				if (!cancelled) {
					setError(e instanceof Error ? e.message : String(e));
					setBusy(false);
				}
			} finally {
				if (!cancelled && destroy) {
					const d = destroy;
					destroy = void 0;
					await d().catch(() => {});
				}
			}
		})();
		return () => {
			cancelled = true;
			cancelRender?.();
			if (destroy) destroy().catch(() => {});
		};
	}, [
		blob,
		page,
		onCount
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			className: "p-3 text-sm",
			children: "Rendering page…"
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			role: "alert",
			className: "p-3 text-sm text-destructive",
			children: ["Preview unavailable: ", error]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvas,
			className: "mx-auto h-auto max-w-full",
			hidden: busy || !!error,
			role: "img",
			"aria-label": `Original PDF page ${page}`
		})
	] });
}
function VpOriginalPreview({ document: doc, caseNum, page, onPage }) {
	const { tenant } = useApp();
	const [blob, setBlob] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [count, setCount] = (0, import_react.useState)(0);
	const valid = previewable(doc, tenant.id, caseNum);
	const reportCount = setCount;
	const mounted = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	async function load() {
		if (!valid || !doc.storage_path || busy) return;
		setBusy(true);
		setError("");
		try {
			const { data, error } = await vpDb.storage.from(DOC_BUCKET).download(doc.storage_path);
			if (error || !data) throw Error(error?.message ?? "Private document unavailable");
			if (data.size < 1 || data.size > maxBytes) throw Error("Preview supports files up to 10 MB");
			if (mounted.current) {
				setBlob(new Blob([data], { type: doc.mime }));
				if (doc.mime !== "application/pdf") reportCount(1);
			}
		} catch (e) {
			if (mounted.current) setError(e instanceof Error ? e.message : String(e));
		} finally {
			if (mounted.current) setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Original document",
		className: "min-w-0 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Original document"]
			}), valid && doc.storage_path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => void openVpDocument(doc.storage_path).catch((e) => toast.error(String(e))),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "Open securely"]
			})]
		}), !valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-3 text-sm text-muted-foreground",
			children: "No supported private file is registered for this case."
		}) : !blob ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Load the original for visual comparison. Files remain subject to private storage access."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					disabled: busy,
					onClick: () => void load(),
					children: busy ? "Loading…" : "Load original"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-destructive",
					children: error
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			doc.mime === "application/pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 border-b p-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": count && page > count ? "Return to first source page" : "Previous source page",
						disabled: page <= 1,
						onClick: () => onPage(count && page > count ? 1 : page - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs tabular-nums",
						children: [
							"Page ",
							page,
							count > 0 ? ` / ${count}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Next source page",
						disabled: !count || page >= count,
						onClick: () => onPage(page + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[65vh] overflow-auto bg-muted/30 p-2",
				children: doc.mime === "application/pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfPreview, {
					blob,
					page,
					onCount: reportCount
				}) : page === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePreview, {
					blob,
					name: doc.name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "alert",
						className: "text-sm text-destructive",
						children: [
							"Requested page ",
							page,
							" is not available in this single image."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => onPage(1),
						children: "Return to original image"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 py-2 text-xs text-muted-foreground",
				children: "Visual preview only. Confirm the original page before accepting any extracted field."
			})
		] })]
	});
}
async function paddleRecognize(image, language, token) {
	if (!["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol !== "http:") throw new Error("PaddleOCR is available only from the local HTTP application. Use Tesseract on hosted/mobile deployments.");
	if (token.length < 32) throw new Error("Enter the local OCR service token.");
	const blob = image instanceof Blob ? image : await new Promise((resolve, reject) => image.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("Cannot render page image")), "image/png"));
	if (!["image/png", "image/jpeg"].includes(blob.type) || blob.size < 1 || blob.size > 10485760) throw new Error("Unsupported image or image exceeds 10 MB.");
	const response = await fetch("http://127.0.0.1:8765/ocr", {
		method: "POST",
		body: blob,
		headers: {
			"Content-Type": blob.type,
			"X-VP-OCR-Token": token,
			"X-VP-OCR-Language": language
		},
		credentials: "omit",
		redirect: "error",
		cache: "no-store",
		signal: AbortSignal.timeout(3e5)
	});
	if (!response.ok) throw new Error(`Local PaddleOCR service returned HTTP ${response.status}. Check the token, origin, service and models; retry or choose Tesseract.`);
	const v = await response.json();
	if (!v || typeof v !== "object" || !("text" in v) || typeof v.text !== "string" || v.text.length > 3e4 || !("truncated" in v) || typeof v.truncated !== "boolean" || !("engine" in v) || v.engine !== "paddleocr-3.3.2") throw new Error("Invalid PaddleOCR response.");
	return {
		text: v.text,
		truncated: v.truncated,
		engine: v.engine
	};
}
function pdfBatch(totalPages, startPage) {
	if (!Number.isInteger(totalPages) || totalPages < 1) throw new Error("PDF contains no readable pages.");
	if (!Number.isInteger(startPage) || startPage < 1 || startPage > totalPages) throw new Error(`Start page must be between 1 and ${totalPages}.`);
	const end = Math.min(totalPages, startPage + 5 - 1);
	return {
		start: startPage,
		end,
		next: end < totalPages ? end + 1 : null
	};
}
/**
* Privacy-preserving client-side OCR for registered case documents.
* Text PDF -> PDF.js text layer; scanned PDF -> PDF.js canvas + Tesseract.js or localhost PaddleOCR.
* JPEG/PNG -> selected local OCR engine. Files are processed locally after the RLS-protected
* Supabase Storage download. OCR binaries/language models may be fetched from a CDN.
* No Google Cloud OCR or Supabase Edge Function is called.
*/
var MAX_FILE_BYTES = 10485760;
var MAX_PDF_PAGES = 5;
var MAX_TEXT_CHARS = 3e4;
function safePage(page, text, engine, alreadyTruncated = false) {
	return {
		page,
		text: text.slice(0, MAX_TEXT_CHARS),
		truncated: alreadyTruncated || text.length > MAX_TEXT_CHARS,
		engine
	};
}
function pdfText(items) {
	let result = "";
	for (const raw of items) {
		if (!raw || typeof raw !== "object" || !("str" in raw)) continue;
		const item = raw;
		result += item.str + (item.hasEOL ? "\n" : " ");
	}
	return result.trim();
}
async function extractLocally(document, caseNum, tenantId, language, progress, startPage = 1, paddleToken) {
	if (!Number.isInteger(caseNum) || caseNum < 1 || !tenantId) throw new Error("Invalid case context.");
	const expectedPrefix = `${tenantId}/${caseNum}/`;
	if (!document.storage_path?.startsWith(expectedPrefix)) throw new Error("The document storage path does not match the selected case.");
	if (![
		"application/pdf",
		"image/jpeg",
		"image/png"
	].includes(document.mime)) throw new Error("Only PDF, JPEG and PNG are supported.");
	progress("Retrieving authorized document from private Storage…");
	const { data: blob, error } = await vpDb.storage.from(DOC_BUCKET).download(document.storage_path);
	if (error || !blob) throw new Error(error?.message ?? "Private document download failed.");
	if (blob.size < 1 || blob.size > MAX_FILE_BYTES) throw new Error("File must be between 1 byte and 10 MB.");
	let worker;
	async function recognize(image) {
		if (paddleToken !== void 0) {
			progress(`Recognizing with local PaddleOCR (${language}); first use may download models…`);
			return paddleRecognize(image, language, paddleToken);
		}
		if (!worker) {
			progress(`Loading ${language} OCR model (first use may require a download)…`);
			const { createWorker } = await import("../_libs/tesseract.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			worker = await createWorker(language);
		}
		return {
			text: (await worker.recognize(image)).data.text ?? "",
			engine: "tesseract",
			truncated: false
		};
	}
	const pages = [];
	let pdfPageCount;
	let nextPage = null;
	try {
		if (document.mime !== "application/pdf") {
			progress("Recognizing image text on this device…");
			const recognized = await recognize(blob.type === document.mime ? blob : new Blob([blob], { type: document.mime }));
			pages.push(safePage(1, recognized.text, recognized.engine, recognized.truncated));
		} else {
			const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
			pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
			const bytes = new Uint8Array(await blob.arrayBuffer());
			const loadTask = pdfjs.getDocument({
				data: bytes,
				isEvalSupported: false
			});
			let pdf;
			try {
				pdf = await loadTask.promise;
				pdfPageCount = pdf.numPages;
				const batch = pdfBatch(pdf.numPages, startPage);
				nextPage = batch.next;
				for (let n = batch.start; n <= batch.end; n++) {
					progress(`Extracting PDF page ${n} of ${pdf.numPages}…`);
					const page = await pdf.getPage(n);
					let text = pdfText((await page.getTextContent()).items);
					let engine = "pdf-text";
					let truncated = false;
					if (text.replace(/\s/g, "").length < 25) {
						const base = page.getViewport({ scale: 1 });
						const scale = Math.min(2, 2200 / Math.max(base.width, base.height));
						const viewport = page.getViewport({ scale });
						const canvas = window.document.createElement("canvas");
						canvas.width = Math.ceil(viewport.width);
						canvas.height = Math.ceil(viewport.height);
						const ctx = canvas.getContext("2d");
						if (!ctx) throw new Error("Your browser does not support canvas rendering.");
						progress(`Recognizing scanned PDF page ${n} of ${pdf.numPages}…`);
						await page.render({
							canvas,
							canvasContext: ctx,
							viewport
						}).promise;
						const recognized = await recognize(canvas);
						text = recognized.text;
						engine = recognized.engine;
						truncated = recognized.truncated;
						canvas.width = 0;
						canvas.height = 0;
					}
					pages.push(safePage(n, text, engine, truncated));
					page.cleanup();
				}
			} finally {
				await pdf?.destroy();
			}
		}
	} finally {
		await worker?.terminate();
	}
	return {
		document_id: document.id,
		case_num: caseNum,
		document_name: document.name,
		provider: paddleToken !== void 0 ? "local-paddleocr" : "local-tesseract",
		pages,
		processing_limit: `${MAX_PDF_PAGES} PDF pages per run, max 10 MB; on-device recognition`,
		...pdfPageCount !== void 0 ? {
			pdf_page_count: pdfPageCount,
			next_pdf_page: nextPage
		} : {},
		request_id: `local-${crypto.randomUUID()}`
	};
}
var rules = [
	{
		field: "owner_name",
		label: "Property owner name",
		kind: "text",
		re: /^(?:property\s+owner(?:\s+name)?|name\s+of\s+owner|owner\s+name)\s*[:\-]\s*(.+)$/i
	},
	{
		field: "site_address",
		label: "Site address",
		kind: "text",
		re: /^(?:property\s+address|site\s+address|address\s+of\s+property)\s*[:\-]\s*(.+)$/i
	},
	{
		field: "inspection_contact",
		label: "Inspection contact",
		kind: "text",
		re: /^(?:inspection\s+contact|contact\s+person)\s*[:\-]\s*(.+)$/i
	},
	{
		field: "inspection_contact_mobile",
		label: "Inspection mobile",
		kind: "text",
		re: /^(?:contact\s+(?:mobile|number)|mobile\s+number)\s*[:\-]\s*(\+?[0-9\s\-]{10,16})$/i
	},
	{
		field: "land_length",
		label: "Land length (verify units)",
		kind: "number",
		unitGroup: 2,
		re: /^(?:(?:plot|land)\s+length|length\s+of\s+(?:plot|land))\s*[:\-]\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(feet|ft|metres?|meters?|m))?$/i
	},
	{
		field: "land_breadth",
		label: "Land breadth (verify units)",
		kind: "number",
		unitGroup: 2,
		re: /^(?:(?:plot|land)\s+(?:breadth|width)|(?:breadth|width)\s+of\s+(?:plot|land))\s*[:\-]\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(feet|ft|metres?|meters?|m))?$/i
	},
	{
		field: "property_age",
		label: "Age (years)",
		kind: "number",
		re: /^(?:building\s+age|age\s+of\s+(?:property|building))\s*[:\-]\s*([0-9]{1,3})(?:\s*(?:years?|yrs?))?$/i
	},
	{
		field: "approach_road_width",
		label: "Approach road width (verify units)",
		kind: "number",
		unitGroup: 2,
		re: /^(?:approach\s+road\s+width|width\s+of\s+approach\s+road)\s*[:\-]\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(feet|ft|metres?|meters?|m))?$/i
	},
	{
		field: "plot_facing",
		label: "Plot facing",
		kind: "choice",
		choices: [
			"East",
			"West",
			"North",
			"South"
		],
		re: /^(?:plot\s+facing|facing\s+of\s+plot)\s*[:\-]\s*(east|west|north|south)$/i
	},
	{
		field: "ownership_type",
		label: "Ownership type",
		kind: "choice",
		choices: ["Freehold", "Lease"],
		re: /^(?:ownership\s+type|type\s+of\s+ownership)\s*[:\-]\s*(freehold|lease)$/i
	},
	{
		field: "property_demarcated",
		label: "Demarcated at site",
		kind: "choice",
		choices: [
			"Yes",
			"No",
			"Unable to verify"
		],
		re: /^(?:property\s+demarcated|demarcation)\s*[:\-]\s*(yes|no|unable\s+to\s+verify)$/i
	},
	{
		field: "property_type",
		label: "Property type",
		kind: "choice",
		choices: [
			"Resi",
			"Com",
			"Mix",
			"Land"
		],
		re: /^(?:type\s+of\s+property|property\s+type)\s*[:\-]\s*(resi|com|mix|land)$/i
	},
	{
		field: "occupancy",
		label: "Occupancy",
		kind: "choice",
		choices: [
			"Self occupied",
			"Tenant",
			"Vacant",
			"Under construction",
			"Owner occupied",
			"Tenant occupied",
			"Mixed"
		],
		re: /^(?:occupancy|occupancy\s+status)\s*[:\-]\s*(self\s+occupied|tenant|vacant|under\s+construction|owner\s+occupied|tenant\s+occupied|mixed)$/i
	},
	{
		field: "locality_type",
		label: "Locality type",
		kind: "choice",
		choices: [
			"HIG",
			"MIG",
			"LIG"
		],
		re: /^(?:locality\s+type|locality\s+category)\s*[:\-]\s*(hig|mig|lig)$/i
	},
	{
		field: "structure_type",
		label: "Structure type",
		kind: "choice",
		choices: ["Load Bearing", "Column-Beam"],
		re: /^(?:structure\s+type|type\s+of\s+structure)\s*[:\-]\s*(load\s+bearing|column[\s-]beam)$/i
	},
	{
		field: "floor_count",
		label: "Number of floors",
		kind: "number",
		re: /^(?:number\s+of\s+floors|no\.?\s+of\s+floors)\s*[:\-]\s*([0-9]{1,2})$/i
	},
	{
		field: "block_count",
		label: "Number of blocks",
		kind: "number",
		re: /^(?:number\s+of\s+blocks|no\.?\s+of\s+blocks)\s*[:\-]\s*([0-9]{1,2})$/i
	},
	{
		field: "unit_count",
		label: "Number of units",
		kind: "number",
		re: /^(?:number\s+of\s+units|no\.?\s+of\s+units)\s*[:\-]\s*([0-9]{1,4})$/i
	},
	{
		field: "completion_percent",
		label: "Completion percentage",
		kind: "number",
		re: /^(?:completion\s+(?:percent|percentage)|%\s*completion)\s*[:\-]\s*([0-9]{1,3}(?:\.[0-9]+)?)\s*%?$/i
	},
	{
		field: "amenities",
		label: "Amenities",
		kind: "text",
		re: /^(?:amenities|amenities\s+provided)\s*[:\-]\s*(.+)$/i
	},
	{
		field: "vicinity",
		label: "Nearby landmark",
		kind: "text",
		re: /^(?:nearby\s+landmark|close\s+vicinity|landmark)\s*[:\-]\s*(.+)$/i
	},
	{
		field: "land_rate_reference",
		label: "Land rate reference (not a valuation rate)",
		kind: "text",
		re: /^(?:land\s+rate\s+(?:reference|ref))\s*[:\-]\s*(.+)$/i
	}
];
function valid(rule, raw) {
	const v = raw.replace(/\s+/g, " ").trim();
	if (!v || v.length > 250 || /[<>\x00-\x08]/.test(v)) return null;
	if (rule.kind === "number") {
		const normalized = v.replace(/,/g, "");
		const n = Number(normalized);
		return Number.isFinite(n) && n >= 0 && n <= 1e7 ? String(n) : null;
	}
	if (rule.kind === "choice") {
		const normalized = v.toLowerCase().replace(/[\s-]+/g, " ");
		return rule.choices?.find((choice) => choice.toLowerCase().replace(/[\s-]+/g, " ") === normalized) ?? null;
	}
	return v.length >= 3 ? v : null;
}
function findOcrSuggestions(pages) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const page of pages) {
		if (!Number.isInteger(page.page) || page.page < 1) continue;
		for (const original of page.text.split(/\r?\n/).slice(0, 1e3)) {
			const line = original.trim().slice(0, 300);
			if (!line) continue;
			for (const rule of rules) {
				const match = line.match(rule.re);
				if (!match) continue;
				const value = valid(rule, match[1] ?? "");
				if (value === null) continue;
				const key = `${page.page}\u0000${rule.field}\u0000${value}`;
				if (seen.has(key)) continue;
				seen.add(key);
				const unitRaw = rule.unitGroup ? (match[rule.unitGroup] ?? "").toLowerCase() : "";
				const source_unit = /^(?:ft|feet)$/.test(unitRaw) ? "Feet" : /^(?:m|metre|metres|meter|meters)$/.test(unitRaw) ? "Metres" : void 0;
				out.push({
					field: rule.field,
					label: rule.label,
					value,
					page: page.page,
					source_line: line,
					...source_unit ? { source_unit } : {}
				});
			}
		}
	}
	return out.slice(0, 50);
}
function comparable(value) {
	return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
var plotDimensions = /* @__PURE__ */ new Set(["land_length", "land_breadth"]);
function reviewOcrEvidence(candidate, currentValues) {
	if (candidate.field === "approach_road_width") return {
		status: "manual-only",
		canAccept: false,
		detail: "Approach-road width has no persisted measurement unit. Confirm the unit and enter it manually with provenance."
	};
	if (plotDimensions.has(candidate.field)) {
		const inspectionUnit = currentValues["measurement_unit"]?.trim();
		if (!candidate.source_unit) return {
			status: "unit-check",
			canAccept: false,
			detail: "Source line does not state feet or metres. Verify the original and enter this dimension manually."
		};
		if (!inspectionUnit || inspectionUnit !== candidate.source_unit) return {
			status: "unit-check",
			canAccept: false,
			detail: `OCR states ${candidate.source_unit}; inspection measurement unit is ${inspectionUnit || "unset"}. Set/verify matching units before accepting. No automatic conversion.`
		};
	}
	const existing = currentValues[candidate.field]?.trim() ?? "";
	if (!existing) return {
		status: "new",
		detail: "Empty inspection field; verify the original document.",
		canAccept: true
	};
	if (comparable(existing) === comparable(candidate.value)) return {
		status: "matches",
		detail: "OCR agrees with the current field; verify the original document.",
		canAccept: true
	};
	return {
		status: "conflict",
		canAccept: true,
		detail: `Different from current inspection value: ${existing.slice(0, 120)}. Requires explicit replacement confirmation.`
	};
}
/**
* P6: immutable, unverified, tenant-scoped OCR batches.
* Only the RPCs can read/write the private register. Accepting a suggestion
* into a field remains a separate, human-confirmed inspection form action.
*/
function ocrRegisterError(error) {
	const e = error;
	if (e?.code === "PGRST202" || e?.message?.includes("schema cache")) return "P6 OCR storage is not installed in this Supabase project. Run sql/p6/00_PRECHECK_READONLY.sql and apply the reviewed P6 migration in staging first. OCR remains available only in this browser until then.";
	return e?.message ?? "Unknown OCR register error";
}
async function saveOcrBatch(documentId, caseNum, response, language) {
	const candidates = findOcrSuggestions(response.pages);
	const { data, error } = await vpDb.rpc("vp_p6_save_ocr", {
		p_document_id: documentId,
		p_case_num: caseNum,
		p_request_id: response.request_id,
		p_language: language,
		p_pages: response.pages,
		p_candidates: candidates,
		p_pdf_page_count: response.pdf_page_count ?? null
	});
	if (error) throw new Error(ocrRegisterError(error));
	if (data === null || data === void 0) throw new Error("OCR register did not return an ID");
	return String(data);
}
async function getOcrHistory(documentId, caseNum) {
	const { data, error } = await vpDb.rpc("vp_p6_ocr_history", {
		p_case_num: caseNum,
		p_document_id: documentId
	});
	if (error) throw new Error(ocrRegisterError(error));
	if (!Array.isArray(data)) throw new Error("Invalid OCR history response");
	return data;
}
var OCR_MIMES = /* @__PURE__ */ new Set([
	"application/pdf",
	"image/jpeg",
	"image/png"
]);
/** Honor user selection; otherwise choose a registered OCR-readable file. */
function preferredOcrDocument(documents, selectedId) {
	return documents.find((document) => document.id === selectedId) ?? documents.find((document) => Boolean(document.storage_path) && OCR_MIMES.has(document.mime)) ?? documents[0];
}
/** Preview is deliberately UNVERIFIED. No case/inspection/valuation write occurs here. */
function savedOcrPreview(batch, documentName) {
	return {
		document_id: batch.document_id,
		case_num: batch.case_num,
		document_name: documentName,
		provider: batch.pages.some((p) => p.engine === "paddleocr-3.3.2") ? "local-paddleocr" : batch.pages.some((p) => p.engine === "tesseract") ? "local-tesseract" : "saved-unknown",
		pages: batch.pages,
		processing_limit: "UNVERIFIED saved OCR; review original before acceptance",
		request_id: `saved-${batch.id}`,
		...batch.pdf_page_count != null ? { pdf_page_count: batch.pdf_page_count } : {}
	};
}
var P21_FIELDS = [
	"address",
	"state",
	"district",
	"mandal",
	"village",
	"pincode",
	"municipality",
	"landmark",
	"road_access",
	"building_name",
	"flat_no",
	"east_deed",
	"west_deed",
	"north_deed",
	"south_deed"
];
var fields = [
	{
		field: "address",
		label: "Property address",
		re: /^(property address|site address|address of property|ఆస్తి చిరునామా|संपत्ति का पता)$/iu
	},
	{
		field: "state",
		label: "State",
		re: /^(state|రాష్ట్రం|राज्य)$/iu
	},
	{
		field: "district",
		label: "District",
		re: /^(district|జిల్లా|जिला|ज़िला)$/iu
	},
	{
		field: "mandal",
		label: "Mandal / Taluk",
		re: /^(mandal|taluk|tehsil|మండలం|తాలూకా|तहसील)$/iu
	},
	{
		field: "village",
		label: "Village / locality",
		re: /^(village|locality|గ్రామం|ग्राम|गाँव)$/iu
	},
	{
		field: "pincode",
		label: "PIN code",
		re: /^(pin code|pincode|పిన్ కోడ్|पिन कोड)$/iu
	},
	{
		field: "municipality",
		label: "Municipality",
		re: /^(municipality|gram panchayat|మున్సిపాలిటీ|नगरपालिका)$/iu
	},
	{
		field: "landmark",
		label: "Landmark",
		re: /^(landmark|nearby landmark)$/iu
	},
	{
		field: "road_access",
		label: "Road access",
		re: /^(road access|approach road)$/iu
	},
	{
		field: "building_name",
		label: "Building name",
		re: /^(building name|project name)$/iu
	},
	{
		field: "flat_no",
		label: "Flat / unit number",
		re: /^(flat no\.?|flat number|unit number)$/iu
	},
	...[
		"east",
		"west",
		"north",
		"south"
	].map((d) => ({
		field: d + "_deed",
		label: d[0].toUpperCase() + d.slice(1) + " deed boundary",
		re: new RegExp(`^(?:${d} deed boundary|deed boundary ${d})$`, "i")
	})),
	{
		field: "survey_no",
		label: "Survey number — confirm parcel manually",
		re: /^(survey no\.?|survey number|సర్వే నంబర్|सर्वे नंबर)$/iu
	},
	{
		field: "plot_no",
		label: "Plot number — confirm parcel manually",
		re: /^(plot no\.?|plot number|ప్లాట్ నంబర్|प्लॉट नंबर)$/iu
	},
	{
		field: "deed_area",
		label: "Deed extent — confirm parcel & unit manually",
		re: /^(land extent|deed extent|plot area|land area|విస్తీర్ణం|क्षेत्रफल)$/iu
	},
	{
		field: "owner",
		label: "Owner name — confirm legal capacity manually",
		re: /^(owner name|property owner|name of owner|యజమాని పేరు|मालिक का नाम)$/iu
	},
	{
		field: "document_ref",
		label: "Registration reference — confirm deed manually",
		re: /^(document number|document no\.?|registration number|registration no\.?|దస్తావేజు సంఖ్య|दस्तावेज संख्या)$/iu
	},
	{
		field: "document_date",
		label: "Document date — confirm document manually",
		re: /^(document date|registration date|deed date|రిజిస్ట్రేషన్ తేదీ|पंजीकरण तिथि)$/iu
	},
	{
		field: "sro",
		label: "Sub-Registrar office — confirm document manually",
		re: /^(sro|sub registrar office|sub-registrar office)$/iu
	},
	{
		field: "approval_ref",
		label: "Approval reference — manual review",
		re: /^(building approval number|approval number|sanction number|occupancy certificate number)$/iu
	},
	{
		field: "tax_ref",
		label: "Tax reference — manual review",
		re: /^(property tax number|assessment number|ptin)$/iu
	}
];
function isP21Field(field) {
	return P21_FIELDS.includes(field);
}
function propertyOcrCandidates(pages) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const p of pages) {
		if (!Number.isInteger(p.page) || p.page < 1 || p.truncated) continue;
		for (const raw of p.text.split(/\r?\n/).slice(0, 1e3)) {
			const line = raw.trim();
			if (!line || line.length > 300 || /[\x00-\x08<>]/.test(line)) continue;
			const match = /^([^:：]{1,80})[:：]\s*(.+)$/u.exec(line);
			if (!match) continue;
			const rule = fields.find((f) => f.re.test(match[1].trim()));
			if (!rule) continue;
			const value = match[2].trim();
			if (!value || value.length > 200 || rule.field === "pincode" && !/^[1-9][0-9]{5}$/.test(value)) continue;
			const key = `${p.page}:${rule.field}:${value}`;
			if (seen.has(key)) continue;
			seen.add(key);
			out.push({
				field: rule.field,
				label: rule.label,
				value,
				page: p.page,
				sourceLine: line,
				adoptable: isP21Field(rule.field)
			});
			if (out.length >= 50) return out;
		}
	}
	return out;
}
function P21PropertyReview({ num, documentId, batchId, pages, onSourcePage, onBusy }) {
	const { tenant, can } = useApp();
	const links = useCasePropertyLinks(num);
	const properties = usePropertyMaster();
	const qc = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [reviewContext, setReviewContext] = (0, import_react.useState)("");
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("");
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		onBusy?.(busy);
	}, [busy, onBusy]);
	(0, import_react.useEffect)(() => () => onBusy?.(false), [onBusy]);
	const link = links.data?.[0];
	const property = properties.data?.find((p) => p.id === link?.property_id);
	const candidates = propertyOcrCandidates(pages);
	const context = property && link ? `${property.id}:${property.current_revision}:${link.link_version}` : "";
	const editable = !!batchId && !!property && !!link && can("cases.View") && can("cases.Edit") && links.isSuccess && properties.isSuccess;
	async function adopt() {
		if (!selected || !isP21Field(selected.field) || !editable || !property || !link || !batchId || !confirmed || !reason.trim() || busy || reviewContext !== context) return;
		if (!window.confirm(`Create a new master revision for PM-${property.id}?\n${selected.label}: ${selected.value}\nThe case remains pinned to its existing revision.`)) return;
		setBusy(true);
		setStatus("");
		setFailed(false);
		try {
			const { data, error } = await vpDb.rpc("vp_p21_apply_property_text", {
				p_num: num,
				p_doc: documentId,
				p_batch: batchId,
				p_page: selected.page,
				p_property: property.id,
				p_link: link.link_version,
				p_revision: property.current_revision,
				p_field: selected.field,
				p_value: selected.value,
				p_line: selected.sourceLine,
				p_reason: reason.trim()
			});
			if (error) throw error;
			if (String(data) !== property.id) throw new Error("Unexpected property ID returned. Check revision history before retrying.");
			const check = await vpDb.from("vp_property_revisions").select("revision,data").eq("org_id", tenant.id).eq("property_id", property.id).eq("revision", property.current_revision + 1).single();
			if (check.error || !check.data || check.data.data?.[selected.field] !== selected.value) throw new Error("Save returned an ID but revision read-back was not confirmed. Check history before retrying.");
			setStatus(`Master revision ${property.current_revision + 1} saved and read back. Case association and valuation unchanged.`);
			setSelected(null);
			setConfirmed(false);
			setReason("");
		} catch (e) {
			setFailed(true);
			setStatus(propertyError(e));
		} finally {
			await qc.invalidateQueries({ queryKey: ["vp-p16-properties", tenant.id] });
			await qc.invalidateQueries({ queryKey: [
				"vp-p16-revisions",
				tenant.id,
				property.id
			] });
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded border p-3 space-y-2 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Property field comparison (unverified)" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Explicitly labelled lines only. Compare with the original registered document, including the property schedule. A human-confirmed correction creates a new Property Master revision; it does not change this case's pinned revision, inspection, valuation, or report. Ownership, survey/plot, extent and document references require manual association."
			}),
			links.error || properties.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive",
				children: ["Property reference unavailable: ", propertyError(links.error ?? properties.error)]
			}) : null,
			property && link ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Linked property PM-",
				property.id,
				" · current master r",
				property.current_revision,
				" · case pinned r",
				link.property_revision
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Link an existing property from the case Property tab before adoption." }),
			!batchId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Save and verify this OCR batch before adopting a field." }),
			!candidates.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No safely labelled suggestions. Review extracted text and enter manually." }),
			candidates.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2 rounded border p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 break-words",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [c.label, ":"] }),
						" ",
						c.value,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "break-words text-muted-foreground",
							children: [
								"Page ",
								c.page,
								" · ",
								c.sourceLine
							]
						}),
						onSourcePage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => onSourcePage(c.page),
							children: ["View source page ", c.page]
						}),
						property && isP21Field(c.field) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Master: ", property.data[c.field] || "Not entered"] })
					]
				}), c.adoptable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					disabled: busy || !editable || property && isP21Field(c.field) && property.data[c.field] === c.value,
					onClick: () => {
						onSourcePage?.(c.page);
						setSelected(c);
						setReviewContext(context);
						setConfirmed(false);
						setReason("");
						setStatus("");
					},
					children: "Review correction"
				})]
			}, `${c.field}:${c.page}:${i}`)),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border p-3 rounded",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
						"Review: ",
						selected.label,
						" → ",
						selected.value
					] }),
					reviewContext !== context && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-destructive",
						children: "Property or association changed. Select Review correction again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Page ",
						selected.page,
						": ",
						selected.sourceLine
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: "grid gap-1",
						children: ["Reason for correction", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							maxLength: 250,
							disabled: busy,
							onChange: (e) => setReason(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: confirmed,
							onCheckedChange: (v) => setConfirmed(v === true),
							disabled: busy
						}), "I checked the original document, property identity and field meaning; I authorize this new master revision."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: !editable || !confirmed || !reason.trim() || busy || reviewContext !== context,
							onClick: () => void adopt(),
							children: busy ? "Saving…" : "Save verified correction"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: busy,
							onClick: () => setSelected(null),
							children: "Cancel"
						})]
					})
				]
			}),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: failed ? "alert" : "status",
				className: failed ? "text-destructive" : "text-green-700",
				children: status
			})
		]
	});
}
function verifyInspectionReadback(submitted, server, expectingSubmitted) {
	if (!server || typeof server !== "object" || Array.isArray(server)) return {
		verified: false,
		reason: "Inspection readback did not return a report."
	};
	const report = server;
	if (!report["data"] || typeof report["data"] !== "object" || Array.isArray(report["data"])) return {
		verified: false,
		reason: "Inspection readback has no field data."
	};
	if (expectingSubmitted && report["status"] !== "Submitted") return {
		verified: false,
		reason: "Inspection readback does not confirm Submitted status."
	};
	const stored = report["data"];
	const missing = Object.entries(submitted).filter(([key, value]) => stored[key] !== value).map(([key]) => key);
	if (missing.length) return {
		verified: false,
		reason: `Inspection readback differs for ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? " and more fields" : ""}.`
	};
	return {
		verified: true,
		reason: "Saved inspection fields and source provenance were confirmed by a fresh server read."
	};
}
function verifyOcrReadback(savedId, expectedDocumentId, expectedCaseNum, expectedLanguage, expectedPages, batches) {
	const match = batches.find((x) => String(x.id) === savedId);
	if (!match) return {
		verified: false,
		reason: "OCR save returned an ID, but the saved batch was not found in history."
	};
	if (String(match.document_id) !== String(expectedDocumentId) || match.case_num !== expectedCaseNum || match.language !== expectedLanguage) return {
		verified: false,
		reason: "OCR readback metadata differs from the saved document/case/language."
	};
	if (!Array.isArray(match.pages) || match.pages.length !== expectedPages.length) return {
		verified: false,
		reason: "OCR readback has a different page count."
	};
	for (let i = 0; i < expectedPages.length; i++) {
		const expected = expectedPages[i];
		const actual = match.pages[i];
		if (!expected || !actual || Number(expected.page) !== Number(actual.page) || expected.text !== actual.text || expected.engine !== void 0 && expected.engine !== actual.engine || expected.truncated !== void 0 && expected.truncated !== actual.truncated) return {
			verified: false,
			reason: `OCR page ${expected?.page ?? i + 1} is not identical in saved history.`
		};
	}
	return {
		verified: true,
		reason: "OCR batch confirmed in private Supabase history. No official inspection fields were modified."
	};
}
function VpDocumentOcr({ document, caseNum, canAccept = false, propertyReview = false, onAccept, existingValues, onActivity }) {
	const { tenant } = useApp();
	const queryClient = useQueryClient();
	const [authorized, setAuthorized] = (0, import_react.useState)(false);
	const [engine, setEngine] = (0, import_react.useState)("tesseract");
	const [paddleToken, setPaddleToken] = (0, import_react.useState)("");
	const [savedBatchId, setSavedBatchId] = (0, import_react.useState)(null);
	const [localOrigin, setLocalOrigin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setLocalOrigin(window.location.protocol === "http:" && ["localhost", "127.0.0.1"].includes(window.location.hostname));
	}, []);
	const [language, setLanguage] = (0, import_react.useState)("eng");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)("");
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("idle");
	const [saveError, setSaveError] = (0, import_react.useState)("");
	const [unsavedResult, setUnsavedResult] = (0, import_react.useState)(null);
	const [unsavedLanguage, setUnsavedLanguage] = (0, import_react.useState)("eng");
	const [error, setError] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [selectedPage, setSelectedPage] = (0, import_react.useState)("1");
	const [sourcePage, setSourcePage] = (0, import_react.useState)(1);
	const [propertyBusy, setPropertyBusy] = (0, import_react.useState)(false);
	const valid = previewable(document, tenant.id, caseNum);
	(0, import_react.useEffect)(() => {
		onActivity?.({
			busy: loading || propertyBusy,
			unsaved: !!unsavedResult
		});
	}, [
		onActivity,
		loading,
		propertyBusy,
		unsavedResult
	]);
	(0, import_react.useEffect)(() => {
		if (!loading && !unsavedResult && !propertyBusy) return;
		const warn = (e) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [
		loading,
		unsavedResult,
		propertyBusy
	]);
	function showSource(page) {
		if (Number.isSafeInteger(page) && page > 0) setSourcePage(page);
	}
	const [filter, setFilter] = (0, import_react.useState)("");
	const [startPage, setStartPage] = (0, import_react.useState)("1");
	const history = useQuery({
		queryKey: [
			"vp-p6-ocr-history",
			tenant.id,
			caseNum,
			document.id
		],
		enabled: valid,
		queryFn: () => getOcrHistory(document.id, caseNum),
		staleTime: 5e3,
		retry: false
	});
	const displayedResult = (0, import_react.useMemo)(() => valid ? result ?? (history.data?.[0] ? savedOcrPreview(history.data[0], document.name) : null) : null, [
		valid,
		result,
		history.data,
		document.name
	]);
	const suggestions = (0, import_react.useMemo)(() => findOcrSuggestions(displayedResult?.pages ?? []), [displayedResult]);
	const activePage = displayedResult?.pages.find((p) => String(p.page) === selectedPage) ?? displayedResult?.pages[0];
	async function persistAndVerify(parsed, lang) {
		const savedId = await saveOcrBatch(document.id, caseNum, parsed, lang);
		setSaveStatus("verifying");
		const rows = await getOcrHistory(document.id, caseNum);
		const check = verifyOcrReadback(savedId, document.id, caseNum, lang, parsed.pages, rows);
		if (!check.verified) throw new Error(`OCR save returned an ID but could not be verified: ${check.reason}`);
		queryClient.setQueryData([
			"vp-p6-ocr-history",
			tenant.id,
			caseNum,
			document.id
		], rows);
		return savedId;
	}
	async function start(requestedPage) {
		if (!authorized || !valid || loading || propertyBusy) return;
		if (unsavedResult && !window.confirm("Discard the unconfirmed local extraction and run a new batch?")) return;
		const page = requestedPage ?? Number(startPage);
		if (!Number.isInteger(page) || page < 1) {
			setError("Enter a valid PDF start page (1 or higher).");
			return;
		}
		if (engine === "paddle" && (!localOrigin || paddleToken.length < 32)) {
			setError("Start the localhost PaddleOCR service and enter its token.");
			return;
		}
		setLoading(true);
		setSavedBatchId(null);
		setResult(null);
		setUnsavedResult(null);
		setSaveStatus("idle");
		setSaveError("");
		setError("");
		try {
			const parsed = await extractLocally(document, caseNum, tenant.id, language, setProgress, page, engine === "paddle" ? paddleToken : void 0);
			setStartPage(String(page));
			setResult(parsed);
			setSelectedPage(String(parsed.pages[0]?.page ?? 1));
			showSource(parsed.pages[0]?.page ?? 1);
			setSaveStatus("saving");
			try {
				setSavedBatchId(await persistAndVerify(parsed, language));
				setSaveStatus("saved");
			} catch (e) {
				setUnsavedResult(parsed);
				setUnsavedLanguage(language);
				setSaveStatus("failed");
				setSaveError(e instanceof Error ? e.message : "OCR register failed");
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Local OCR failed");
		} finally {
			setLoading(false);
			setProgress("");
		}
	}
	async function retrySave() {
		if (!authorized || !unsavedResult || loading || propertyBusy) return;
		setSaveStatus("saving");
		setSaveError("");
		setLoading(true);
		try {
			setSavedBatchId(await persistAndVerify(unsavedResult, unsavedLanguage));
			setUnsavedResult(null);
			setSaveStatus("saved");
		} catch (e) {
			setSaveStatus("failed");
			setSaveError(e instanceof Error ? e.message : "OCR register failed");
		} finally {
			setLoading(false);
		}
	}
	function loadSaved(batch) {
		if (unsavedResult && !window.confirm("Discard the unconfirmed local extraction and open a saved batch?")) return;
		setResult(savedOcrPreview(batch, document.name));
		setSavedBatchId(batch.id);
		setSelectedPage(String(batch.pages[0]?.page ?? 1));
		showSource(batch.pages[0]?.page ?? 1);
		setSaveStatus("saved");
		setSaveError("");
		setUnsavedResult(null);
	}
	function accept(item) {
		if (!onAccept || !canAccept || !existingValues || loading || !valid) return;
		const review = reviewOcrEvidence(item, existingValues);
		if (!review.canAccept) return;
		const current = existingValues[item.field]?.trim() ?? "";
		if (!window.confirm(`Verify against the original document before accepting:\n${item.label}: ${item.value}${item.source_unit ? " " + item.source_unit : ""}\nSource: page ${item.page}\n${current ? "Current value: " + current + "\n" : ""}${review.status === "conflict" ? "This will REPLACE the existing value.\n" : ""}\nHave you checked the original document and confirmed the value?`)) return;
		onAccept(item.field, item.value, `Document ${document.id}: ${document.name} · OCR page ${item.page}`, `Human-confirmed local OCR suggestion${item.source_unit ? "; source unit: " + item.source_unit : ""}; source line: ${item.source_line.slice(0, 160)}`);
	}
	if (!valid) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "status",
		className: "rounded border p-3 text-sm text-muted-foreground",
		children: "No supported registered private document in this case scope."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vp-evidence-pane",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "vp-evidence-split",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpOriginalPreview, {
				document,
				caseNum,
				page: sourcePage,
				onPage: setSourcePage
			}, `${tenant.id}:${caseNum}:${document.id}:${document.storage_path}`), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, { className: "size-4" }), " Extraction & evidence review"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded border p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "cursor-pointer text-sm font-medium",
								children: "Extraction settings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "my-2 text-xs text-muted-foreground",
								children: "PDF text is read directly; scanned pages/JPEG/PNG use Tesseract.js or optional localhost PaddleOCR (5 PDF pages per batch). PaddleOCR sends image bytes only to the local service, not a cloud OCR endpoint. After you authorize local OCR, extracted text and suggestions are saved to the tenant's private review register. Existing saved batches display automatically below; viewing them does not accept any field. No paid OCR API."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: `ocr-authorized-${document.id}`,
									checked: authorized,
									onCheckedChange: (v) => setAuthorized(v === true),
									disabled: loading || propertyBusy
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: `ocr-authorized-${document.id}`,
									className: "cursor-pointer font-normal leading-5",
									children: "I am authorized to run NEW local OCR processing of this document and to save its unverified text/suggestions to this tenant's private register. Existing saved batches may be viewed without running OCR again."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 items-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "OCR engine" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: engine,
										onValueChange: (v) => {
											setEngine(v === "paddle" ? "paddle" : "tesseract");
											setAuthorized(false);
											setPaddleToken("");
										},
										disabled: loading || propertyBusy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-44 max-w-full",
											"aria-label": "Extraction setting",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "tesseract",
											children: "Tesseract (browser)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "paddle",
											disabled: !localOrigin,
											children: "PaddleOCR (localhost)"
										})] })]
									})] }),
									engine === "paddle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Local service token" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										autoComplete: "off",
										value: paddleToken,
										onChange: (e) => setPaddleToken(e.target.value),
										disabled: loading || propertyBusy,
										placeholder: "VP_OCR_TOKEN"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "OCR language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: language,
										onValueChange: (v) => {
											setLanguage(v);
										},
										disabled: loading || propertyBusy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-44 max-w-full",
											"aria-label": "Extraction setting",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "eng",
												children: "English"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "hin",
												children: "Hindi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "tel",
												children: "Telugu"
											})
										] })]
									})] }),
									document.mime === "application/pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: `p4-start-${document.id}`,
										children: "PDF start page (5/run)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: `p4-start-${document.id}`,
										type: "number",
										min: 1,
										className: "w-36",
										value: startPage,
										onChange: (e) => setStartPage(e.target.value),
										disabled: loading || propertyBusy
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										type: "button",
										disabled: !authorized || !valid || loading || propertyBusy || engine === "paddle" && (!localOrigin || paddleToken.length < 32),
										onClick: () => void start(),
										children: loading ? "Reading locally…" : displayedResult ? "Run local OCR again" : "Extract locally (free)"
									})
								]
							})
						]
					}),
					!valid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-amber-700",
						children: "This legacy document has no registered private storage file."
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-muted-foreground",
						children: progress
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "alert",
						className: "text-destructive",
						children: [
							"Local OCR error: ",
							error,
							". The file and inspection were not changed."
						]
					}),
					saveStatus === "saving" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-xs",
						children: "Saving unverified OCR pages and mappings to Supabase…"
					}),
					saveStatus === "verifying" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-xs",
						children: "Verifying saved OCR pages against Supabase history…"
					}),
					saveStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-xs text-green-700",
						children: "OCR extraction saved and verified in Supabase history. Field values were NOT changed."
					}),
					saveStatus === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border border-amber-400 p-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							role: "alert",
							children: [
								"OCR recognition succeeded, but storage or read-back verification was not confirmed: ",
								saveError,
								". Do not assume it is unsaved or saved; retry verification/saving (request IDs are idempotent). Official inspection values remain unchanged."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: loading || propertyBusy,
							onClick: () => void retrySave(),
							children: "Retry saving / verifying OCR"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "space-y-2 rounded border p-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
								className: "cursor-pointer text-sm font-medium",
								children: [
									"Saved extractions (",
									history.data?.length ?? 0,
									")"
								]
							}),
							history.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading saved extractions…" }),
							history.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-destructive",
								children: ["Cannot load saved OCR: ", history.error.message]
							}),
							history.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No saved extractions for this document yet. Run local OCR and verify that the Supabase save status says saved." }),
							(history.data?.length ?? 0) > 0 && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "status",
								className: "text-green-700",
								children: "Showing the newest saved batch automatically. These values have not been accepted into any official field."
							}),
							history.data?.map((batch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 border-t pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									new Date(batch.created_at).toLocaleString("en-IN"),
									" · ",
									batch.pages.map((p) => p.page).join(", "),
									" page(s) · ",
									batch.candidates.length,
									" mapped suggestion(s)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: propertyBusy || loading || saveStatus === "saving" || saveStatus === "verifying",
									onClick: () => loadSaved(batch),
									children: "Review saved OCR"
								})]
							}, batch.id))
						]
					}),
					history.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "alert",
						className: "text-xs text-destructive",
						children: ["Saved extractions unavailable: ", history.error.message]
					}),
					history.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-xs",
						children: "Loading extraction history…"
					}),
					!displayedResult && !history.isLoading && !history.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No extraction to review. Open Extraction settings to authorize and run local OCR."
					}),
					displayedResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "status",
							className: "flex items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }),
								" ",
								displayedResult.pages.length,
								" OCR page(s) available for review",
								displayedResult.pdf_page_count ? ` of ${displayedResult.pdf_page_count} PDF pages` : "",
								". OCR text is not verified evidence."
							]
						}),
						displayedResult.next_pdf_page != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							disabled: !authorized || loading || propertyBusy,
							onClick: () => void start(displayedResult.next_pdf_page ?? void 0),
							children: [
								"Process next batch (page ",
								displayedResult.next_pdf_page,
								")"
							]
						}),
						displayedResult.pages.some((p) => p.truncated) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-amber-700",
							children: "Long OCR output was truncated in preview. Check the original document."
						}),
						displayedResult.pages.every((p) => !p.text.trim()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-amber-700",
							children: "No readable text detected. Try a clearer scan or manual transcription."
						}),
						displayedResult.pages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Source page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(activePage?.page ?? 1),
								onValueChange: (v) => {
									setSelectedPage(v);
									showSource(Number(v));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-32",
									"aria-label": "Extracted source page",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: displayedResult.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: String(p.page),
									children: [
										"Page ",
										p.page,
										" · ",
										p.engine ?? "legacy / unknown"
									]
								}, p.page)) })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Search OCR preview" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"aria-label": "Search extracted text",
									value: filter,
									onChange: (e) => setFilter(e.target.value),
									placeholder: "Find owner, address, area…"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "rounded border p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
								className: "cursor-pointer text-sm font-medium",
								children: ["Extracted text · page ", activePage?.page ?? 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded border bg-muted/30 p-3 text-xs",
								children: activePage?.text.split("\n").filter((line) => !filter || line.toLocaleLowerCase().includes(filter.toLocaleLowerCase())).join("\n") || (filter ? "No matching text on this page" : "No recognized text")
							})]
						})] }),
						propertyReview && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(P21PropertyReview, {
							onSourcePage: showSource,
							onBusy: setPropertyBusy,
							num: caseNum,
							documentId: document.id,
							batchId: result ? savedBatchId : history.data?.[0]?.id ?? null,
							pages: displayedResult.pages
						}, `${document.id}:${result ? result.request_id : history.data?.[0]?.id ?? "none"}:${savedBatchId ?? ""}`),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Proposed inspection-field mappings — NOT applied automatically" }),
								suggestions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "No safely labelled field suggestions found. Review OCR text and use manual source entry."
								}),
								suggestions.map((candidate, i) => {
									const review = existingValues ? reviewOcrEvidence(candidate, existingValues) : null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start gap-2 rounded border p-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1 break-words",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [candidate.label, ":"] }),
													" ",
													candidate.value,
													candidate.source_unit ? ` ${candidate.source_unit}` : "",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-muted-foreground",
														children: [
															"Page ",
															candidate.page,
															" · ",
															candidate.source_line
														]
													}),
													existingValues && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs",
														children: ["Recorded inspection: ", existingValues[candidate.field]?.trim() || "Not recorded"]
													}),
													review && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: review.canAccept ? "text-xs text-muted-foreground" : "text-xs text-amber-700",
														children: [
															"Review: ",
															review.status,
															" — ",
															review.detail
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => showSource(candidate.page),
												children: ["Page ", candidate.page]
											}),
											onAccept && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												disabled: !valid || loading || !canAccept || !review?.canAccept,
												onClick: () => accept(candidate),
												children: review?.status === "conflict" ? "Review replacement" : "Review & accept"
											})
										]
									}, `${candidate.field}-${candidate.page}-${i}`);
								})
							]
						})
					] })
				]
			})] })]
		})
	});
}
//#endregion
export { previewable as a, preferredOcrDocument as i, comparisonStatus as n, selectedEvidence as o, filterEvidence as r, verifyInspectionReadback as s, VpDocumentOcr as t };
