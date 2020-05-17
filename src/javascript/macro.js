Macro.add("scale", {
	tags: undefined,
	handler: function() {
		var value = this.args[0];
		var min = this.args.length > 1 ? this.args[1] : 0;
		var max = this.args.length > 2 ? this.args[2] : 0;
		var charOn = this.args.length > 3 ? this.args[3] : '█';
		var charOff = this.args.length > 4 ? this.args[4] : '░';
		var str = "";
		if (value < min) {
			return this.error("value must be higher than min");
		} else if (value > max) {
			return this.error("value must be lower than max");
		} else {
			for (var i = min; i < value; i += (max - min) / 10) {
				str += charOn;
			}
			for (var i = value; i < max; i += (max - min) / 10) {
				str += charOff;
			}
			return jQuery(this.output).wiki(str);
		}
	}
});

Macro.add("debug", {
	tags: [],
	handler: function() {
		var id = this.args[0];
		var obj = process(id);
		return jQuery(this.output).wiki(String.format(
			"<<debug-internal>>{1}<</debug-internal>>",
			id,
			obj
		));
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
				if (obj[tag] instanceof Object) {
					str += String.format(
						"<li>{0}: <<debug-internal>>{1}<</debug-internal>></li>",
						tag, 
						obj[tag]
					);
				} else if (obj[tag] != "") {
					str += String.format(
						"<li>{0} : {1}</li>",
						tag,
						obj[tag]
					);
				}
			});
			str += "</ul>";
		} else if (Array.isArray(obj)) {
			str += "<li><ol>"
			obj.forEach(function(val) {
				str += String.format(
					"<li><<debug-internal>>{0}<</debug-internal>></li>",
					val
				);
			});
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
		if (this.payload.lenght === 0) {
			return this.error("bad expression: this macro require at least one argument");
		}
		var end = "";
		var def = "";
		var id = Date.now();
		if (this.payload[this.payload.length - 1].name == "default") {
			def = "<br>" + this.payload.pop().contents;
		}
		if (this.payload[this.payload.length - 1].name == "end") {
			end = this.payload.pop().contents;
		}
		var str = this.payload.reduce(function(str, p, i) {
			if (i != 0 && p.name != "option") {
				return "";
			} else {
				return str + String.format(
					"<<link \"{0}\">><<replace '#{1}'>>{2}{3}<</replace>><</link>><br>",
					p.args[0],
					id,
					p.contents,
					end
				);
			}
		}, "");
		if (str === "") {return this.error("One of the tags is invalid")}
		return $(this.output).wiki(String.format(
			"<span id='{0}'>{1}{2}</span>",
			id,
			str,
			def
		));
	}
});