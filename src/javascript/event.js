class Event {
	constructor(config) {
		this.name = ''; // Not used, just for us to remeber it
		this.passage = ''; // Passage in which it starts
		this.inline = false; // If true, will be included in the current passage
		this.repeats = false;
		this.room = "";
		this.tags = [] // add Tags here
		this.priority = 0;

		Object.keys(config).forEach((pn) => this[pn] = clone(config[pn]), this);
	}

	playEvent(debug) {
		if (this.inline) {
			if (!this.repeats) {
				State.variables.mansion.removeEvent(this.room, this.name);
			}
			return `<<include "${this.passage}">>`;
		} else {
			if (!this.repeats)
				return `<<link "${this.name}" "${this.passage}">>$mansion.removeEvent("${this.room}","${this.name}")<</link>>`;
			return `<<link "${this.name}" "${this.passage}">><</link>>`;
		}
	}

	active(canSelfActivate) {
		if ((canSelfActivate || false) && State.random() < State.variables.eventForceActive) return true;
		return !this.tags.find((tag) => {
			var tagTrue = tag[0] === "!";
			var tagName = tagTrue ? tag.substr(1) : tag;
			return (State.variables.tags[tagName] || (() => (State.variables.flags[tagName])))() === tagTrue
		})
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