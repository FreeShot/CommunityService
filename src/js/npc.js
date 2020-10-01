setup.findNpc = function(name) {
	return setup.npc[setup.npcLookup.findIndex((_name) => name === _name)]
}

setup.lastRoomNpc = function(name) {
	var schedule = setup.npc[name].schedule;
	if (schedule.length === 0) return null
	var index = schedule.findIndex((sp) => sp.start >= State.variables.time.minute);
	return (index + schedule.length - 1) % schedule.length;
}

setup.locationNpc = function(name) {
	var scheduleNow = setup.lastRoomNpc(name);
	console.log(scheduleNow);
	if (scheduleNow === null) return null;
	var scheduleNext = (scheduleNow + 1) % setup.npc[name].schedule.length;

	var currRoom = setup.npc[name].schedule[scheduleNow].room;
	var nextRoom = setup.npc[name].schedule[scheduleNext].room;

	if(currRoom === -2) currRoom = 0;
	else if(currRoom === -1) currRoom = random(0, setup.rooms.length);
	if(nextRoom === -2) nextRoom = 0;
	else if(nextRoom === -1) nextRoom = random(0, setup.rooms.length);

	var path = setup.pathfind.buildPath(currRoom, nextRoom);

	var timeleft = setup.npc[name].schedule[scheduleNext].start - State.variables.time.minute
	
	var room = setup.npc[name].schedule[scheduleNow].room;
	if (timeleft < (path.length * 5)) {
		room = path[Math.floor(timeleft / 5)];
	}
	return room;
}