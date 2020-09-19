Macro.add("scale", {
	tags: undefined,
	handler: function() {
		var value = this.args[0];
		var min = this.args.length > 1 ? this.args[1] : 0;
		var max = this.args.length > 2 ? this.args[2] : 0;
		var charOn = this.args.length > 3 ? this.args[3] : '█';
		var charOff = this.args.length > 4 ? this.args[4] : '░';
		var nb = this.args.length > 5 ? this.args[5] : 10;
		var str = "";
		if (value < min || value > max)
			return this.error("value must be in the min max range")
		const scale = (max - min) / nb;
		for (var i = min; i < max; i += scale)
			str += (i < value) ? charOn : charOff;
		return jQuery(this.output).wiki(str);
	}
});

Macro.add("debug", {
	tags: [],
	handler: function() {
		return jQuery(this.output).wiki(
		    `<<debug-internal>>${process(this.args[0])}<</debug-internal>>`)
	}
});

Macro.add("debug-internal", {
	tags: [],
	handler: function() {
		var obj = this.payload[0].contents;
		try {
			obj = JSON.parse(obj);
		} catch {}
		var str = "";
		if (obj instanceof Object && !Array.isArray(obj)) {
			str += "<ul>";
			Object.keys(obj).forEach(function(tag) {
				if (obj[tag] instanceof Object)
					str += `<li>${tag}: <<debug-internal>>${obj[tag]}<</debug-internal>></li>`
				else if (obj[tag] != "")
					str += `<li>${tag} : ${obj[tag]}</li>`
			});
			str += "</ul>";
		} else if (Array.isArray(obj)) {
			obj.reduce((str, val) => str + `<li><<debug-internal>>${val}<</debug-internal>></li>`, `${str}<li><ol>`);
			str += "</ol></li>"
		} else {
			str += JSON.stringify(obj);
		}
		return jQuery(this.output).wiki(str);
	}
});

Macro.add("chooseOption", {
	tags: ["option", "end", "default"],
	handler: function() {
		if (this.payload.length === 0)
			return this.error("bad expression: this macro require at least one argument")
		var end = "";
		var def = "";
		var id = Date.now();
		if (this.payload[this.payload.length - 1].name == "default")
			def = "<br>" + this.payload.pop().contents;
		if (this.payload[this.payload.length - 1].name == "end")
			end = this.payload.pop().contents;
		var str = this.payload.reduce(function(str, p, i) {
			if (i != 0 && p.name != "option")
				return ""
			return str + `<<link \"${p.args[0]}\">><<replace '#${id}'>>${p.contents}${end}<</replace>><</link>><br>`
		}, "");
		if (str === "") 
			return this.error("One of the tags is invalid")
		return $(this.output).wiki(`<span id='${id}'>${str}${def}</span>`)
	}
});

Macro.add("listChores", {
	tags: [],
	handler: function () {
		console.log(State.variables.mansion.displayChores(this.args[0] || true, State.variables.flags.filterDone));
		$(this.output).wiki("<table>" + State.variables.mansion.displayChores(this.args[0] || true, State.variables.flags.filterDone) + "</table>");
	}
});