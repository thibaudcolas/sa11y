import { Sa11y, Lang } from '../assets/js/sa11y.esm.js';
import CustomChecks from '../assets/js/sa11y-custom-checks.esm.js';

// Translations
import Sa11yLangEn from '../assets/js/lang/en.js';
import Sa11yLangFr from '../assets/js/lang/fr.js';
import Sa11yLangPl from '../assets/js/lang/pl.js';
import Sa11yLangUa from '../assets/js/lang/ua.js';
import SallyLangSv from '../assets/js/lang/sv.js';

// Sa11y's version.
const v = "2.3.5";
const webV = document.getElementById("v");
webV.innerHTML = v;

// Custom checks for English demo pages only.
let customChecks = false;
let readabilityISO = false;

// Set translations
const url = window.location.href;
if (url.indexOf("pl") > -1) {
  Lang.addI18n(Sa11yLangPl.strings);
} else if (url.indexOf("fr") > -1) {
  Lang.addI18n(Sa11yLangFr.strings);
  readabilityISO = 'fr';
} else if (url.indexOf("ua") > -1) {
  Lang.addI18n(Sa11yLangUa.strings);
} else if (url.indexOf("sv") > -1) {
	Lang.addI18n(SallyLangSv.strings);
  readabilityISO = 'sv';
} else {
  Lang.addI18n(Sa11yLangEn.strings);
  customChecks = new CustomChecks;
  readabilityISO = 'en';
}

class CustomSa11y extends Sa11y {
	constructor(options) {
		super(options);
		
		this.sa11yUpdateBadge = this.updateBadge;
		this.updateBadge = () => {
			this.sa11yUpdateBadge();
			const userbarTrigger = document.getElementById('wagtail-userbar-trigger');
			const notifBadge = document.getElementById('sa11y-notification-badge');
      const notifCount = document.getElementById('sa11y-notification-count');
      const notifText = document.getElementById('sa11y-notification-text');

			const newCount = notifCount.cloneNode();
			newCount.innerHTML = notifCount.innerHTML;
			newCount.id = 'new-count';

			userbarTrigger.appendChild(newCount)
		}

		// Re-implement Sa11y's initialize method.
		this.initialize = () => {
			this.globals();
			this.utilities();

			// Addition:
			this.buildCustomUI();
			this.settingPanelToggles();
			this.mainToggle();
			this.skipToIssueTooltip();
			this.detectPageChanges();

			// Pass Sa11y instance to custom checker
			if (options.customChecks && options.customChecks.setSa11y) {
				options.customChecks.setSa11y(this);
			}

			// Check page once page is done loading.
			document.getElementById('sa11y-toggle').disabled = false;
			if (this.store.getItem('sa11y-remember-panel') === 'Closed' || !this.store.getItem('sa11y-remember-panel')) {
				this.panelActive = true;
				this.checkAll();
			}
		}
	}

	buildCustomUI() {
		this.buildSa11yUI();
		const toggle = document.getElementById('sa11y-toggle');
		const container = document.getElementById('sa11y-container');
		const panel = document.getElementById('sa11y-panel');
		const badge = document.getElementById('sa11y-notification-badge');
		
		const userbar = document.querySelector('[data-wagtail-userbar]');
		const sa11yParent = document.querySelector('[data-sa11y-parent]')
		const userbarTrigger = document.getElementById('wagtail-userbar-trigger');
		// const newBadge = badge.cloneNode();
		// newBadge.innerHTML = badge.innerHTML;
		// userbarTrigger.appendChild(newBadge);
		// const newPanel = panel.cloneNode();
		// newPanel.innerHTML = panel.innerHTML;
		// userbar.appendChild(panel);
		
		container.parentElement.removeChild(container);
		sa11yParent.appendChild(container);
	}
}

// Instantiate
const sa11y = new CustomSa11y({
  customChecks: customChecks,
	// Use doNotRun to initialise Sa11y without it showing anything.
	// In particular binding Sa11y methods to the object instance.
	doNotRun: 'body',
  checkRoot: 'body',
  headerIgnore: '.ignore-this-heading',
  contrastIgnore: '.card-footer *',
  readabilityRoot: 'main',
  readabilityLang: readabilityISO,
  containerIgnore: '.wagtail-userbar-reset',
  linksToFlag: "a[href^='https://www.dev.']",
  linkIgnoreSpan: '.sr-only-example',
  detectSPArouting: true,
});

document.addEventListener("DOMContentLoaded", function () {
	var e = document.querySelector("[data-wagtail-userbar]"),
		t = e.querySelector("[data-wagtail-userbar-trigger]"),
		n = e.querySelector("[role=menu]"),
		r = n.querySelectorAll("li"),
		i = "is-active";
	function a(r) {
		e.classList.add(i),
			t.setAttribute("aria-expanded", "true"),
			n.addEventListener("click", f, !1),
			window.addEventListener("click", m, !1),
			e.addEventListener("keydown", l, !1),
			r &&
				n.querySelector(
					"a[href],\n    button:not([disabled]),\n    input:not([disabled])"
				) &&
				setTimeout(function () {
					s();
				}, 300);
	}
	function o() {
		e.classList.remove(i),
			t.setAttribute("aria-expanded", "false"),
			n.addEventListener("click", f, !1),
			window.removeEventListener("click", m, !1),
			e.removeEventListener("keydown", l, !1);
	}
	function u() {
		r.forEach(function (e) {
			e.firstElementChild.tabIndex = -1;
		});
	}
	function c(e) {
		u(),
			(e.tabIndex = 0),
			setTimeout(function () {
				e.focus();
			}, 100);
	}
	function s() {
		r.length > 0 && c(r[0].firstElementChild);
	}
	function d() {
		r.length > 0 && c(r[r.length - 1].firstElementChild);
	}
	function l(e) {
		if ("true" === t.getAttribute("aria-expanded")) {
			if ("Escape" === e.key)
				return (
					o(),
					setTimeout(function () {
						return t.focus();
					}, 300),
					u(),
					!1
				);
			if (
				document.activeElement &&
				document.activeElement.closest(".wagtail-userbar-items")
			)
				switch (e.key) {
					case "ArrowDown":
						return (
							e.preventDefault(),
							r.forEach(function (e, t) {
								e.firstElementChild === document.activeElement &&
									(t + 1 < r.length ? c(r[t + 1].firstElementChild) : s());
							}),
							!1
						);
					case "ArrowUp":
						return (
							e.preventDefault(),
							r.forEach(function (e, t) {
								e.firstElementChild === document.activeElement &&
									(t > 0 ? c(r[t - 1].firstElementChild) : d());
							}),
							!1
						);
					case "Home":
						return e.preventDefault(), s(), !1;
					case "End":
						return e.preventDefault(), d(), !1;
				}
		}
		return !0;
	}
	function f(e) {
		e.stopPropagation();
	}
	function m() {
		o();
	}
	t.addEventListener(
		"click",
		function (t) {
			t.stopPropagation(), e.classList.contains(i) ? o() : a(!0);
		},
		!1
	),
		window.addEventListener("pageshow", o, !1),
		e.addEventListener("keydown", function (e) {
			if (
				t === document.activeElement &&
				"false" === t.getAttribute("aria-expanded")
			)
				switch (e.key) {
					case "ArrowUp":
						e.preventDefault(),
							a(!1),
							setTimeout(function () {
								return d();
							}, 300);
						break;
					case "ArrowDown":
						e.preventDefault(),
							a(!1),
							setTimeout(function () {
								return s();
							}, 300);
				}
		}),
		n.addEventListener("focusout", function (e) {
			null == e.relatedTarget ||
				(e.relatedTarget &&
					e.relatedTarget.closest(".wagtail-userbar-items")) ||
				(u(), o());
		}),
		u();
});

// Our custom initialize.
sa11y.initialize();