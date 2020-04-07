class Chore {
	constructor (config) {
		this.name = '';
		this.duration = {"day" : 0, "hour": 0, "minute": 0};
		this.passages = [
			{name: '', weight: 1}
		];
		this.img = [];
		this.energyCost  = 0;
		this.done = false;
		this.room = '';
		this.id = '';

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	do() {
		if (this.done) {
			return String.format(
				"<span class='ChoreDone'>{0} (Done)</span>",
				this.name
			);
		} else {
			return String.format(
				"<<link '{0}' '{1}'>><<set $player.useEnergy({2})>><<= $dateTime.addTime({3})>><<= $mansion.findRoom('{5}').findChore('{0}').done = true>><</link>> (Costs {2} energy, takes about {4})",
				this.name,
				this.passage,
				this.energyCost,
				this.duration,
				this.getDuration,
				this.room
			);
		}
	}

	reset() {
		this.done = false;
	}

	get getDuration() {
		// Returns the duration of the Chore in string
		var timeOrder = ["day", "hour", "minute"];
		var str = "";
		for (var i = 0; i < timeOrder.length; i++) {
			if (this.duration[timeOrder[i]] > 1) {
				str += this.duration[timeOrder[i]] + " " + timeOrder[i] + "s ";
			} else if (this.duration[timeOrder[i]] == 1) {
				str += 1 + " " + timeOrder[i] + " ";
			}
		}
		return str;
	}

	addPassage(passage) {
		this.passages.push();
	}

	removePassage(passageName) {
		this.passages.filter(function(pass){pass.name != passageName});
	}

	get passage() {
		var sum = 0; for (var i = this.passages.length - 1; i >= 0; i--) {sum += this.passages[i].weight;}
		var val = random(0, sum - 1);
		for (var i = 0; i < this.passages.length; i++) {
			val -= this.passages[i].weight;
			console.log(this.passages[i].name);
			if (val < 0) {
				return this.passages[i].name;
			}
		}
		//return this.passageName; // Use instead of this.passageName
	}

	clone() {
        return new Chore(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Chore($ReviveData$)', ownData);
	}

	display(imgIndex) {
		var imgIndex = imgIndex || 0;

		var str = "<span class='estateChore'>" + this.name + "</span><br>";

		return str + (imgIndex < this.img.length ? "[img[" + this.getImgPath(imgIndex) + "]]" : "");
	}

	getImgPath(imgIndex) {
		return setup.ImagePath + "events/chores/" + this.id + "/" + this.img[imgIndex]; 
	}

}
Object.defineProperty(window, 'Chore', {
    value : Chore
});