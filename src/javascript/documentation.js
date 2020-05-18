Macro.add("tooltips", {
	tags: [],
	handler: () => {
		if (!settings.tips) return $(this.output).wiki("");
		var tipType = this.args[0]; // One of: "warning", "info", "comment"
		var content;
		if (this.args.length > 1)
			content = State.variables.tooltips[this.args[1]]; // Selects the right tooltip
		else
			content = this.payload[0].contents;
		return $(this.output).wiki(`<div class='tooltip-${tipType}'>${content}</div>`);
	}
});