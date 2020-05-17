Macro.add("tooltips", {
	tag: [],
	handler: function() {
		if (!settings.tips) return $(this.output).wiki("");
		var tipType = this.args[0]; // One of: "warning", "info", "comment"
		var content = State.variables.tooltips[this.args[1]]; // Selects the right tooltip
		return $(this.output).wiki(String.format("<div class='tooltip-{0}'>{1}</div>", tipType, content));
	}
});