class Character {
	constructor(config) {
		this.name = '';
		this.title = '';
		this.currentRoom = '';
		this.acceptance = 0;
		this.color = '';

        Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	speak(text) {
		return Character.speakAnonymous(text, this.color);
	}

	static speakAnonymous(text, color) {
		return String.format(
			'<span class="speak" style="color:{0};">"{1}"</span>',
			color,
			text
		);
	}

	clone() {
        return new Character(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Character($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Character', {
    value : Character
});

class Player extends Character {
	gradiant = ["#1335A9", "#212EB0", "#3831B5", "#5941BC", "#7852C2", "#9465C7", "#AD78CE", "#C38CD3", "#D4A1DA", "#E0B9DE"];

	constructor(config) {
		super(Object.assign(
            {
                name: "Alex",
                title: "Alex",
                feminity: 0,
                hairColor: "Brunette",
                energy: {current : 100, max : 100}
            }, config));
		this.feminize = 0;
	}

	useEnergy(amnt) {
		this.energy.current = Math.max(this.energy.current - amnt, 0);
	}

	get getColor() {
		if (this.feminity > this.gradiant.length - 1) {this.feminity = this.gradiant.length - 1;}
		return this.gradiant[this.feminity];
	}

	speak(text) {
		return Character.speakAnonymous(text, this.getColor);
	}

	clone() {
        return new Player(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Player($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Player', {
    value : Player
});