window.pathfind = {};
pathfind.cost = (startName, endName, c, roomCost) => {
	c = c || 0;
	roomCost = roomCost || {};

	if (Object.keys(roomCost).includes(startName) && c > roomCost[startName]) {
		return roomCost
	}

	roomCost[startName] = c;

	if (startName === endName) {
		return roomCost
	}

	return State.variables.mansion.findRoom(startName).adjacentRooms.reduce((roomCost, room) => {
		return pathfind.cost(room, endName, c + 1, roomCost);
	}, roomCost);
};

pathfind.nextRoom = (start, end, cost) => {
	var cost = cost || pathfind.cost(start, end);
	var rooms = State.variables.mansion.findRoom(end).adjacentRooms.filter((newRoom) => cost[newRoom] === cost[end] - 1);
	return rooms[Math.floor(State.random() * rooms.length)] || start;
};

pathfind.path = (start, room) => {
	if (room === "FreeRoam") return [State.random() > 0.5 ? State.variables.mansion.findRoom(start).adjacentRooms.random() : start];
	var path = [];
	var cost = pathfind.cost(start, room);
	while (room != start) {
		path.unshift(room);
		if (room !== start) {
			cost = pathfind.cost(start, room);
			room = pathfind.nextRoom(start, room, cost);
		}
	}
	path.unshift(room);
	return path;
};

class Schedule {
	constructor(config) {
		this.waypoints = [];
		this.path = [];
		this.currRoom = undefined;

		Object.keys(config || {}).forEach((pn) => this[pn] = clone(config[pn]), this);
	}

	addPoint(room, start, end) {
		this.waypoints.push({
			room: room, start: start, end: end
		});
	}

	curPoint() {
		return this.waypoints[this.waypoints.findIndex((wp) => State.variables.time.inInterval(wp.start, wp.end))];
	}

	nextPoint() {
		return this.waypoints.find((wp) => State.variables.time.compareTime(wp.start) === -1);
	}
	
	updatePath() {
		if (this.currRoom === undefined) {
			return;
		}
		var nextPoint = this.curPoint() || this.nextPoint();
		var path;
		if (this.currRoom === "Void" && nextPoint !== "void") {
			this.currRoom = "Lounge";
		}
		if (nextPoint !== undefined) {
			path = pathfind.path(this.currRoom, nextPoint.room);
		} else 
			path = [this.currRoom];
		this.currRoom = path.length > 1 ? path[1] : path[0];
	}
	
	estimateLoc() {
		if (this.currRoom === "Void") return "Away";
		var loc = this.curPoint();
		if (loc === undefined || loc.room === "FreeRoam") return "Traveling"
		else return State.variables.mansion.findRoom(loc.room).name;
	}

	clone() {
		return new Schedule(this);
	}

	// For twine
	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Schedule($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Schedule', {
	value: Schedule
});

window.schedule = function(tick) {
	while(tick > 0) {
		tick--; 
		npcList.forEach((npc) => State.variables[npc].schedule.updatePath())
	}
};