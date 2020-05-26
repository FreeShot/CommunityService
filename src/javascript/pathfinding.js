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
	return rooms[Math.floor(State.random() * rooms.length)];
};

pathfind.path = (start, room) => {
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

window.schedule = {
	new: (data) => Object.assign({
		waypoints: [],
		path: [],
		currRoom: "PlayerBdRm",
		addPoint: function(room, start, end) {
			this.waypoints.push({
				room: room,
				start: start,
				end: end
			});
		},
		curPoint: function() {
			var i = this.waypoints.findIndex((wp) => State.variables.time.inInterval(wp.start, wp.end));
			return this.waypoints[i];
		},
		nextPoint: function() {
			return this.waypoints.find((wp) => State.variables.time.compareTime(wp.start) === -1);
		},
		updatePath: function() {
			var nextPoint = this.curPoint();
			var path;
			if (nextPoint !== undefined) {
				path = pathfind.path(this.currRoom, nextPoint.room);
			} else {
				path = pathfind.path(this.currRoom, this.nextPoint().room);
			}
			this.currRoom = path.length > 1 ? path[1] : path[0];
		}
	}, data || {})
};
