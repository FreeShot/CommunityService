class Character {
	constructor(config) {
        this.name  = '';
        this.title = '';
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

class Player extends Character {
	constructor(config) {
		config = config || {};
		config.name = config.name || "Alex";
		config.color = config.color || "DarkSlateBlue";
		config.title = config.title || config.name;
		super(config);
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

Object.defineProperty(window, 'Character', {
    value : Character
});

Object.defineProperty(window, 'Player', {
    value : Player
});