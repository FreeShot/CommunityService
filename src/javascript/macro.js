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
			for (var i = min; i < value; i+= (max - min) / 10) {
				str += charOn;
			}
			for (var i = value; i < max; i += (max - min) / 10) {
				str += charOff;
			}
			return jQuery(this.output).wiki(str);
		}
	}
});