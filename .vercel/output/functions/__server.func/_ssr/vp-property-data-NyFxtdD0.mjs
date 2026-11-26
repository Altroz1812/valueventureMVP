//#region node_modules/.nitro/vite/services/ssr/assets/vp-property-data-NyFxtdD0.js
var PROPERTY_CATEGORIES = [
	"Land",
	"House",
	"Flat",
	"Commercial",
	"Industrial",
	"Agricultural",
	"Other"
];
var AREA_UNITS = [
	"sqyd",
	"sqft",
	"sqm",
	"acre",
	"gunta",
	"cent",
	"hectare"
];
var emptyParcel = () => ({
	survey_no: "",
	plot_no: "",
	deed_area: null,
	deed_unit: "sqyd",
	actual_area: null,
	actual_unit: "sqyd",
	notes: ""
});
var emptyOwner = () => ({
	name: "",
	interest: "",
	share_pct: null,
	from_date: "",
	to_date: "",
	evidence: ""
});
var emptyDocument = () => ({
	kind: "",
	reference: "",
	date: "",
	sro: "",
	notes: ""
});
var emptyProperty = () => ({
	category: "Land",
	label: "",
	address: "",
	state: "",
	district: "",
	mandal: "",
	village: "",
	pincode: "",
	municipality: "",
	landmark: "",
	road_access: "",
	notes: "",
	flat_no: "",
	building_name: "",
	east_deed: "",
	west_deed: "",
	north_deed: "",
	south_deed: "",
	east_actual: "",
	west_actual: "",
	north_actual: "",
	south_actual: "",
	latitude: null,
	longitude: null,
	parcels: [],
	owners: [],
	documents: []
});
function propertyError(e) {
	if (e instanceof Error) return e.message;
	if (e && typeof e === "object" && "message" in e) return String(e.message);
	return String(e);
}
function validateProperty(d) {
	if (!d.label.trim() || !d.address.trim() || !d.state.trim() || !d.district.trim()) return "Name, address, state and district are required.";
	if (d.label.length > 200 || d.address.length > 2e3) return "Name or address is too long.";
	if (d.pincode && !/^[1-9][0-9]{5}$/.test(d.pincode)) return "PIN must contain six digits.";
	if (d.latitude === null !== (d.longitude === null)) return "Enter both coordinates or neither.";
	if (d.latitude !== null && (!Number.isFinite(d.latitude) || Math.abs(d.latitude) > 90) || d.longitude !== null && (!Number.isFinite(d.longitude) || Math.abs(d.longitude) > 180)) return "Coordinates out of range.";
	if ([
		d.parcels,
		d.owners,
		d.documents
	].some((a) => a.length > 100)) return "Maximum 100 entries per section.";
	for (const p of d.parcels) {
		if (!p.survey_no.trim() && !p.plot_no.trim()) return "Each parcel needs a survey or plot number.";
		if ([p.deed_area, p.actual_area].some((n) => n !== null && (!Number.isFinite(n) || n <= 0 || n > 0xe8d4a51000))) return "Parcel areas must be positive.";
	}
	for (const o of d.owners) {
		if (!o.name.trim()) return "Owner name is required.";
		if (o.share_pct !== null && (!Number.isFinite(o.share_pct) || o.share_pct < 0 || o.share_pct > 100)) return "Ownership share must be between 0 and 100.";
		if (o.from_date && o.to_date && o.from_date > o.to_date) return "Ownership end precedes start.";
	}
	for (const dref of d.documents) if (!dref.kind.trim() || !dref.reference.trim()) return "Document type and reference are required.";
	return null;
}
//#endregion
export { emptyParcel as a, validateProperty as c, emptyOwner as i, PROPERTY_CATEGORIES as n, emptyProperty as o, emptyDocument as r, propertyError as s, AREA_UNITS as t };
