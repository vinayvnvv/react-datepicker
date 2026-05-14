import { useEffect as e, useMemo as t, useRef as n, useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region node_modules/date-fns/toDate.mjs
function o(e) {
	let t = Object.prototype.toString.call(e);
	return e instanceof Date || typeof e == "object" && t === "[object Date]" ? new e.constructor(+e) : typeof e == "number" || t === "[object Number]" || typeof e == "string" || t === "[object String]" ? new Date(e) : /* @__PURE__ */ new Date(NaN);
}
//#endregion
//#region node_modules/date-fns/constructFrom.mjs
function s(e, t) {
	return e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region node_modules/date-fns/isDate.mjs
function c(e) {
	return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
//#endregion
//#region node_modules/date-fns/isValid.mjs
function l(e) {
	if (!c(e) && typeof e != "number") return !1;
	let t = o(e);
	return !isNaN(Number(t));
}
//#endregion
//#region node_modules/date-fns/getDaysInMonth.mjs
function u(e) {
	let t = o(e), n = t.getFullYear(), r = t.getMonth(), i = s(e, 0);
	return i.setFullYear(n, r + 1, 0), i.setHours(0, 0, 0, 0), i.getDate();
}
//#endregion
//#region src/utils/format.ts
function d(e) {
	let t = /(dd|MM|yyyy)/g, n = [], r = 0, i;
	for (; (i = t.exec(e)) !== null;) {
		i.index > r && n.push({
			type: "sep",
			value: e.slice(r, i.index)
		});
		let t = i[1];
		n.push({
			type: "field",
			key: t,
			length: t === "yyyy" ? 4 : 2
		}), r = i.index + i[1].length;
	}
	return r < e.length && n.push({
		type: "sep",
		value: e.slice(r)
	}), n;
}
//#endregion
//#region src/utils/string.ts
function f(e, t) {
	return String(e).padStart(t, "0");
}
//#endregion
//#region src/utils/constants.ts
var p = {
	dd: "DD",
	MM: "MM",
	yyyy: "YYYY"
}, m = {
	dd: "Day",
	MM: "Month",
	yyyy: "Year"
}, h = {
	dd: "",
	MM: "",
	yyyy: ""
};
//#endregion
//#region src/utils/time.ts
function g(e) {
	return !e || !l(e) ? h : {
		dd: f(e.getDate(), 2),
		MM: f(e.getMonth() + 1, 2),
		yyyy: f(e.getFullYear(), 4)
	};
}
function _(e, t) {
	let n = parseInt(e, 10);
	if (!n || n < 1 || n > 12) return 31;
	let r = t.length === 4 ? parseInt(t, 10) : 2e3;
	return u(new Date(r, n - 1, 1));
}
function v(e) {
	if (e.dd.length !== 2 || e.MM.length !== 2 || e.yyyy.length !== 4) return;
	let t = parseInt(e.dd, 10), n = parseInt(e.MM, 10), r = parseInt(e.yyyy, 10), i = new Date(r, n - 1, t);
	if (i.getFullYear() === r && i.getMonth() === n - 1 && i.getDate() === t) return i;
}
//#endregion
//#region src/DatePicker.tsx
function y({ value: o, onChange: s, dateFormat: c = "dd/MM/yyyy", disabled: u = !1, name: h, id: y, showDropdowns: b = !1, maxYear: x, yearRange: S = 100, dropdownIcon: C, theme: w = "light", outlined: T = !1, isPlainStyle: E = !1, classNames: D, styles: O, ...k }) {
	let A = x ?? (/* @__PURE__ */ new Date()).getFullYear(), j = t(() => d(c), [c]), M = t(() => j.filter((e) => e.type === "field").map((e) => e.key), [j]), [N, P] = r(() => g(o)), F = n({
		dd: null,
		MM: null,
		yyyy: null
	}), I = n(o && l(o) ? o.getTime() : void 0), L = o && l(o) ? o.getTime() : void 0;
	e(() => {
		L !== I.current && (I.current = L, P(g(o)));
	}, [L]);
	function R(e) {
		let t = v(e);
		if (t) {
			I.current = t.getTime(), s?.(t);
			return;
		}
		I.current = void 0, s?.(void 0);
	}
	function z(e, t) {
		let n = M[M.indexOf(e) + t];
		if (!n) return;
		let r = F.current[n];
		if (r) if (r.focus(), t === -1) {
			let e = r.value.length;
			try {
				r.setSelectionRange(e, e);
			} catch {}
		} else try {
			r.setSelectionRange(0, r.value.length);
		} catch {}
	}
	function B(e, t, n) {
		let r = t.replace(/\D/g, "").slice(0, n);
		P((t) => {
			let i = {
				...t,
				[e]: r
			};
			if (r.length > 0) {
				let a = parseInt(r, 10);
				if (r.length < n && (e === "dd" && parseInt(r[0], 10) > 3 || e === "MM" && parseInt(r[0], 10) > 1) || r.length === n && (e === "dd" && (a < 1 || a > _(i.MM, i.yyyy)) || e === "MM" && (a < 1 || a > 12) || e === "yyyy" && a < 1)) return t;
			}
			return e !== "dd" && i.dd.length === 2 && parseInt(i.dd, 10) > _(i.MM, i.yyyy) && (i.dd = ""), r.length === n && queueMicrotask(() => z(e, 1)), R(i), i;
		});
	}
	function V(e) {
		if (e === "dd") {
			let e = _(N.MM, N.yyyy);
			return Array.from({ length: e }, (e, t) => f(t + 1, 2));
		}
		return e === "MM" ? Array.from({ length: 12 }, (e, t) => f(t + 1, 2)) : Array.from({ length: S }, (e, t) => f(A - t, 4));
	}
	function H(e, t, n) {
		B(e, t, n);
	}
	function U(e, t) {
		let n = t.currentTarget, r = n.selectionStart === 0 && n.selectionEnd === 0, i = n.selectionStart === n.value.length && n.selectionEnd === n.value.length;
		if (t.key === "Backspace" && n.value === "") {
			t.preventDefault(), z(e, -1);
			return;
		}
		if (t.key === "ArrowLeft" && r) {
			t.preventDefault(), z(e, -1);
			return;
		}
		t.key === "ArrowRight" && i && (t.preventDefault(), z(e, 1));
	}
	let W = E ? {
		position: "relative",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: "1em",
		height: "1em",
		cursor: u ? "not-allowed" : "pointer",
		userSelect: "none",
		lineHeight: 1
	} : { position: "relative" }, G = {
		position: "absolute",
		inset: 0,
		width: "100%",
		height: "100%",
		opacity: 0,
		cursor: u ? "not-allowed" : "pointer",
		appearance: "none",
		WebkitAppearance: "none",
		MozAppearance: "none",
		border: 0,
		padding: 0,
		margin: 0,
		background: "transparent",
		color: "transparent",
		fontSize: "inherit"
	}, K = E ? {
		display: "inline-flex",
		alignItems: "center"
	} : void 0, q = (e, t) => {
		let n = D?.[t];
		return e ? n ? `${e} ${n}` : e : n;
	}, J = (e, t) => {
		let n = O?.[t];
		return e ? n ? {
			...e,
			...n
		} : e : n;
	};
	return /* @__PURE__ */ i("span", {
		role: "group",
		"aria-label": k["aria-label"] ?? "Date",
		id: y,
		className: q(E ? void 0 : "rdp-root", "root"),
		style: J(void 0, "root"),
		"data-theme": E ? void 0 : w,
		"data-outlined": E ? void 0 : T ? "true" : "false",
		"data-disabled": E ? void 0 : u ? "true" : "false",
		children: j.map((e, t) => e.type === "sep" ? /* @__PURE__ */ i("span", {
			"aria-hidden": "true",
			className: q(E ? void 0 : "rdp-sep", "separator"),
			style: J(void 0, "separator"),
			children: e.value
		}, `s${t}`) : /* @__PURE__ */ a("span", {
			className: q(E ? void 0 : "rdp-segment", "segment"),
			style: J(K, "segment"),
			children: [/* @__PURE__ */ i("input", {
				ref: (t) => {
					F.current[e.key] = t;
				},
				type: "text",
				inputMode: "numeric",
				pattern: "[0-9]*",
				autoComplete: "off",
				disabled: u,
				name: h ? `${h}-${e.key}` : void 0,
				maxLength: e.length,
				size: e.length,
				placeholder: p[e.key],
				"aria-label": m[e.key],
				className: q(E ? void 0 : "rdp-input", "input"),
				style: J(void 0, "input"),
				value: N[e.key],
				"data-segment": e.key,
				onChange: (t) => B(e.key, t.target.value, e.length),
				onKeyDown: (t) => U(e.key, t),
				onFocus: (e) => e.currentTarget.select()
			}), b && /* @__PURE__ */ a("span", {
				className: q(E ? void 0 : "rdp-trigger", "trigger"),
				style: J(W, "trigger"),
				children: [/* @__PURE__ */ i("span", {
					"aria-hidden": "true",
					className: q(void 0, "dropdownIcon"),
					style: J(void 0, "dropdownIcon"),
					children: typeof C == "function" ? C(e.key) : C ?? "▾"
				}), /* @__PURE__ */ a("select", {
					"aria-label": `Pick ${m[e.key]}`,
					disabled: u,
					className: q(E ? void 0 : "rdp-select", "select"),
					value: N[e.key],
					onChange: (t) => H(e.key, t.target.value, e.length),
					style: J(G, "select"),
					children: [/* @__PURE__ */ i("option", {
						value: "",
						disabled: !0,
						hidden: !0,
						children: m[e.key]
					}), V(e.key).map((e) => /* @__PURE__ */ i("option", {
						value: e,
						children: e
					}, e))]
				})]
			})]
		}, e.key))
	});
}
//#endregion
export { y as DatePicker };

//# sourceMappingURL=index.js.map