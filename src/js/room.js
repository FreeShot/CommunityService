setup.getAdjacentRoom = function(room) {
	var adjacentRooms = setup.rooms[room].adjacent;
	var rooms = [];
	for (var i = 0; i < setup.rooms.length; i++) {
		if ((adjacentRooms >> i) & 1) rooms.push(i);
	}
	return rooms;
}

setup.getChores = function(room) {
	return (setup.rooms[room].chores || []).filter((chore, i) => (State.variables.currentChores[room] >> i) & 1);
}

setup.setChores = function(probability) {
	var chores = {};
	setup.rooms.forEach((room, i) => {
		room.chores.forEach((chore, j) => {
			if (randomFloat(0, 1) <= probability) {
				chores[i] = (chores[i] || 0) + 1 << j;
			}
		});
	});
	return chores;
}

setup.getNpcPresent = function(room) {
	return setup.npc.map((npc, i) => setup.locationNpc(i)).filter((r) => r === room)
}