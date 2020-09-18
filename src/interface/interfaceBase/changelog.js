Macro.add("generateChangelog", {
	skipargs: true,
	tags: [],
	handler: function() {
		var menu = "";
		var changelog = "";

		var passages = Story.lookupWith((p) => p.tags.includes("changelog")).sort();

		var last = [-1, -1, -1];
		passages.forEach(function(p) {
			var title = p.title.substr(10).split('.').map((i) => parseInt(i));
			if (title[0] > last[0]) {
				menu += `${(last[0] > -1 ? "</ul></li>" : "")}<li><a class="changelog-major" href="#changelog-${title[0]}-x-x">Version ${title[0]}.x.x</a><ul>`;
				changelog += `<h2 class="changelog-major" id="changelog-${title[0]}-x-x">Version ${title[0]}.x.x</h2>`;
				last = [title[0], -1, -1];
			}
			if (title[1] > last[1]) {
				menu += `${last[1] > -1 ? "</ul></li>" : ""}<li><a class="changelog-minor" href="#changelog-${title[0]}-${title[1]}-x">Version ${title[0]}.${title[1]}.x</a><ul>`;
				changelog += `<h3 class="changelog-minor" id="changelog-${title[0]}-${title[1]}-x">Version ${title[0]}.${title[1]}.x</h3>`;
				last = [title[0], title[1], -1];
			}
			if (title[2] > last[2]) {
				menu += `<li><a class="changelog-bugfix" href="#changelog-${title[0]}-${title[1]}-${title[2]}">Version ${title[0]}.${title[1]}.${title[2]}</a></li>`;
				changelog += `<h4 class="changelog-bugfix" id="changelog-${title[0]}-${title[1]}-${title[2]}">Version ${title[0]}.${title[1]}.${title[2]}</h4><<include "${p.title}">>`;
				last = title;
			}
		});


		$(this.output).wiki(`<div id="changelog-menu"><h1 class="changelog-main-title">Summary</h1><ul>${menu}</ul></li></ul></li></ul></div><div id="changelog-list"><h1 class="changelog-main-title">Changelog</h1>${changelog}</div>`);
	}
});