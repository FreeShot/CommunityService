class Event {
	constructor(config) {
		this.name = ''; // Not used, just for us to remeber it
		this.passage = ''; // Passage in which it starts
		this.inline = false; // If true, will be included in the current passage
		this.repeats = false;
		this.category = "";
		this.tags; // add Tags here
		this.priority = 0;

		Object.keys(config).forEach((pn) => this[pn] = clone(config[pn]), this);
	}

	playEvent(debug) {
		if (this.inline) {
			if (!this.repeats) {
				State.variables.mansion.removeEvent(this.category, this.name);
			}
			return `<<include "${this.passage}">>`;
		} else {
			return `<<link "${this.name}" "${this.passage}">>${this.repeats ? "" : `<<set $mansion.removeEvent("${this.category}","${this.name}")>>`}<</link>>`;
		}
	}

	get active() {
		return window.tags.eval(this.tags.tag, this.tags.data, this.tags.expected)
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