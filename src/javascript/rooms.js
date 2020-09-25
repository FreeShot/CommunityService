class Room {
	constructor(config) {
		this.name = '';
		this.chores = [];
		this.events = [];
		this.img = undefined;
		this.id = '';
		this.adjacentRooms = [];

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	resetChores() {
		this.chores.forEach((chore) => chore.reset())
	}

	addChore(chore) {
		chore.room = this.id;
		this.chores.push(chore);
	}

	findChore(choreName) {
		return this.chores.find((el) => el.name === choreName);
	}

	displayChores(canDoChores, filterDone, hidelocation) {
        return this.chores.reduce((str, chore) => {
            var choreDo = chore.do(canDoChores, filterDone||false, hidelocation||true);
            return `${str}${choreDo}`;
        }, "");
    }

    get npc() {
    	return npcList.filter((npc) => State.variables[npc].schedule.currRoom === this.id);
    }

	passage(linkContent, callback) {
		// Returns the link to said room's main passage
		return `<<link "${linkContent || this.name}" "${Story.has(this.id) ? this.id : "RoomDescription"}">><<set $player.currRoom to "${this.id}">>${callback || ""}<</link>>`
	}

	get adjacentRoomsLink() {
		// Returns a list of rooms that are link to said room
		var mansion = State.variables.mansion;
		return this.adjacentRooms.reduce((str, room, i) => str + `<li>${mansion.rooms[room].passage()}</li>`, "<ol>") + "</ol>";
	}

	get header() {
		// The header for a room, includes title and picture
		return `<span class="estateRoom">${this.name}${this.picture}</span>`
	}

	get picture() {
		// The picture for said room, if it exists
		return this.img ? `[>img[${setup.ImagePath}estate/${this.id}/${this.img}]]` : "";
	}

	clone() {
        return new Room(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Room($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Room', {
    value : Room
});
