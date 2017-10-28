//* TITLE Old Sidebar **//
//* VERSION 1.2.2 **//
//* DESCRIPTION Get the sidebar back **//
//* DEVELOPER estufar **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.estufars_sidebar_fix = new Object({

	running: false,

	preferences: {
		"dashonly": {
			text: "Only run on the dashboard",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		// Temporary hotfix for Firefox issues
		if (XKit.browser().firefox) {
			console.error("Refusing to run old sidebar on Firefox due to pinned-target bug");
			return;
		}

		if (XKit.extensions.estufars_sidebar_fix.preferences.dashonly.value) {
			if (document.location.href.indexOf('://www.tumblr.com/dashboard') === -1) {
				return;
			}
		} else {
			var disallowedurls = [
				"://www.tumblr.com/explore",
				"://www.tumblr.com/search",
				"://www.tumblr.com/following",
				"/reblog",
				"://www.tumblr.com/help",
				"://www.tumblr.com/support",
				"://www.tumblr.com/docs",
				"://www.tumblr.com/developers",
				"://www.tumblr.com/about",
				"://www.tumblr.com/themes",
				"://www.tumblr.com/policy",
				"://www.tumblr.com/jobs",
				"://www.tumblr.com/apps",
				"://www.tumblr.com/logo",
				"://www.tumblr.com/business",
				"://www.tumblr.com/buttons",
				"://www.tumblr.com/press",
				"://www.tumblr.com/security"
			];
			for (var i = 0; i < disallowedurls.length; i++) {
				if (document.location.href.indexOf(disallowedurls[i]) !== -1) {
					return;
				}
			}
		}

		XKit.tools.init_css("estufars_sidebar_fix");

		function movesidebar() {
			var popover = $(".popover--account-popover")[0];
			var sidebar = document.getElementById("right_column");
			popover.childNodes[0].classList.add("estufars_sidebar_fix");
			sidebar.insertBefore(popover.childNodes[0], sidebar.firstChild);
			var account = document.getElementById("account_button");
			account.style.display = "none";
			// wait and then let tumblr know the menu is no longer active
			window.setTimeout(function() {
				document.querySelector(".tab_nav_account.active").click();
			}, 250);
		}

		if (!$(".popover--account-popover").length) {
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var popover = $(".popover--account-popover")[0];
					if (mutation.addedNodes[0] == popover) {
						observer.disconnect();
						movesidebar();
					}
				});
			});
			observer.observe(document.body, {childList: true});
			var account = document.getElementById("account_button");
			account.click();
		} else {
			movesidebar();
		}
	},

	destroy: function() {
		XKit.tools.remove_css("estufars_sidebar_fix");
		this.running = false;

		var account = document.getElementById("account_button");
		var sidebar = document.getElementsByClassName("estufars_sidebar_fix")[0];
		account.style.display = "inline-block";
		var popover = $(".popover--account-popover")[0];
		popover.insertBefore(sidebar, popover.firstChild);
		account.click();
		popover.style.opacity = "0";
		popover.style.display = "block";
		account.click();
		window.setTimeout(function() {
			popover.style.opacity = "1";
		}, 500);
	}
});
