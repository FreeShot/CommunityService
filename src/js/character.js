setup.character = {
	speak: (color, text) => `<span style="color:${color}">"${text}"</span>`
}

setup.player = {
	getColor: () => {
		var player = State.variables.player;
		var ratio = player.femininity / 100;

		function pickHex(color1, color2, weight) {
			var w1 = (weight * 2) /2;
			var w2 = 1 - w1;
			return color1.map((col, i) => Math.floor(col * w2 + color2[i] * w1));
		}
		console.log(pickHex(player.color[0], player.color[1], ratio));
		return pickHex(player.color[0], player.color[1], ratio).reduce((color, canal) => color + canal.toString(16), "#");

	}
}