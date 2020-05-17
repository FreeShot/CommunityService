Macro.add("tooltips", {
	tag: [],
	handler: function() {
		if (!settings.tips) return $(this.output).wiki("");
		var tipType = this.args[0]; // One of: "warning", "info", "comment"
		var content;
		if (this.args.length > 1) {
			content = State.variables.tooltips[this.args[1]]; // Selects the right tooltip
		}
		else {
			content = this.payloads[0].content;
		}
		return $(this.output).wiki(String.format("<<if !visited()>><div class='tooltip-{0}'>{1}</div><</if>>", tipType, content));
	}
});