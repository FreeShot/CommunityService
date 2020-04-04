Macro.add("roomHeader", {
	tags : null,
	handler : function () {
		var roomId = this.args[0];
		var displayImage = 0;
		var display = true;
		if (this.args.count() > 1) {
			displayImage = this.args[1];
			if (this.args.count() > 2) {
				display = this.args[2];
			}
		}

		if (State.variables.rooms[roomId].imgNames[displayImage] != null && display) {
			$(this.output).wiki(String.format(
				"<span class='estateRoom'>{0}</span><br>[img[{1}estate/{2}/{3}.jpg]]",
				State.variables.rooms[roomId].displayName,
				setup.ImagePath,
				roomId,
				State.variables.rooms[roomId].imgNames[displayImage]
			))
		} else {
			$(this.output).wiki(String.format(
				"<span class='estateRoom'>{0}</span><br>",
				State.variables.rooms[roomId].displayName
			))
		}
	}
});