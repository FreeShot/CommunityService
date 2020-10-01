setup.pathfind = {
	cost: (start, end, cost, roomCost) => {
		cost = cost || 0;
		roomCost = roomCost || {};
		if (roomCost[start]) return roomCost;
		roomCost[start] = cost;
		if (start == end) return roomCost;

		var adj = setup.getAdjacentRoom(start);

		return adj.reduce((minCost, room) => {
			return setup.pathfind.cost(room, end, cost+1, roomCost);
		}, roomCost);
	},
	buildPath: (start, end) => {
		var costs = setup.pathfind.cost(start, end);
		var path = [];

		while (costs[end] > 1) {
			var adj = setup.getAdjacentRoom(end);
			path.splice(0, 0, end);
			end = adj.find((room) => costs[room] + 1 == costs[end]);
		}
		if(end) path.splice(0, 0, end);
		return path;
	}
}