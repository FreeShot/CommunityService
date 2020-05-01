class Event {
	constructor(config) {
		this.name = ''; // Not used, just for us to remeber it
		this.passage = ''; // Passage in which it starts
		this.inline = false; // If true, will be included in the current passage
		this.repeats = false;
		this.room = "";
		this.tags = [] // add Tags here
		this.priority = 0;

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	playEvent(debug) {
		if (this.inline) {
			if (!this.repeats) {
				State.variables.mansion.removeEvent(this.room, this.name);
			}
			return "<<include '" + this.passage + "'>>";
		} else {
			if (!this.repeats) {
				return "<<link '" + this.name + "' '" + this.passage + "'>>$mansion.removeEvent('" + this.room + "','" + this.name + "')<</link>>";
			} else {
				return "<<link '" + this.name + "' '" + this.passage + "'>><</link>>";
			}
		}
	}

	active() {
		for (var i = 0; i < this.tags.length; i++) {
			if (State.variables.tags[this.tags[i]]() === false) {
				return false;
			}
		}
		return true;
	}

	clone() {
        return new Event(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Event($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Event', {
    value : Event
});