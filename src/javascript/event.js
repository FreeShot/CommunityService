class Event {
	constructor(config) {
		this.name = ''; // Not used, just for us to remeber it
		this.passage = ''; // Passage in which it starts
		this.inline = false; // If true, will be included in the current passage
		this.available = function() {return false;}; // Condition for it to appear

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	playEvent(debug) {
		if(this.available()) {
			if (this.inline) {
				return "<<include '" + this.passage + "'>>";
			} else {
				return "<<link '" + this.name + "' '" + this.passage + "'>></link>>";
			}
		} else {
			if (debug) {return "No event but picked " + this.name;}
			return "";
		}
	}

	setCondition(fun) {
		this.available = fun;
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