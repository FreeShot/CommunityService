window.tags = {
	base: {
		isPresent: (data) => State.variables.player.currRoom === State.variables[data.npc].schedule.currRoom,
		appreciation: (data) => State.variables[data.npc].appreciation > data.value,
		day: (data) => State.variables.time.weekDayFormat === data.day,
		bodyPart: (data) => State.player.bodyPart[data.bodyPart] === data.value,
		weekEven: (data) => State.variables.time.day % 14 >= 7,
		time: (data) => {
			if (data.time === "Morning")
				return State.variables.time.inInterval("wakeup", {hour: 12, minutes: 0});
			if (data.time === "Evening")
				return State.variables.time.inInterval("sleep", "wakeup");
		},
		flag: (data) => State.variables.flags[data.flag] === data.state,
		random: (data) => State.random() > data.threshold

	},
	eval: function(tag, data, expected) {
		switch (tag) {
			case "some":
				return data.some((val) => window.tags.eval(val.tag, val.data, val.expected) === expected);
			case "every":
				return data.every((val) => window.tags.eval(val.tag, val.data, val.expected) === expected);
			case "count":
				return data.reduce((total, val) => total + window.tags.eval(val.tag, val.data, val.expected) === expected ? 1 : 0, 0);
			case "not":
				return this.base[tag](data) !== expected;
			default:
				return this.base[tag](data) === expected;
		}
	}
};