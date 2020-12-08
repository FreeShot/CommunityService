Macro.add("chooseOption", {
    tags: ["option", "end", "default"],
    handler: function() {
        if (this.payload.length === 0) {
            return this.error("Bad expression, this macro expects at least one argument");
        }

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
})