Macro.add("speak", {
	tags : null,
	handler : function () {
		$(this.output).wiki(
			String.format(
				"<span style=\"color:{0};\">{1}</span>",
				this.args[0], 
				this.payload[0].contents
			)
		);
	}
});

Macro.add("think", {
	tags : null,
	handler : function () {
		$(this.output).wiki(
			String.format(
				"<span style=\"color:{0};font-style:italic\">{1}</span>",
				this.args[0], 
				this.payload[0].contents
			)
		);
	}
});