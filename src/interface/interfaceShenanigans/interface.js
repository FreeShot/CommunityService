Macro.add("navMenu", {
	skipargs: true,
	tags: [],
	handler: function() {
		var list = State.variables.menuList;
		var index = State.variables.navIndex + this.args[0];
		if (index < 0) index += list.length;
		else if (index >= list.length) index -= list.length;
		$(this.output).wiki(`<span class="nav-button"><<button "${list[index].name}">><<set $navIndex = ${index}>><<replace "#menu-navigation">><<include "menunav">><</replace>><</button>></span>`);
	}
});

Macro.add("displaymenu", {
	skipargs: true,
	tags: [],
	handler: function () {
		var list = State.variables.menuList;
		var index = State.variables.navIndex;
		console.log(index, list);
		$(this.output).wiki(`<div class="ui-menu" id="${list[index].id}"><<include "${list[index].passage}">></div>`)
	}
});