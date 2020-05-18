class Item {
	constructor (config) {
		this.name = "Unnamed item";
		this.tags = [];
		this.price = 0;
		this.femininity = 0;
		this.img = null;

		Object.keys(config || {}).forEach(function (pn) {
			this[pn] = clone(config[pn]);
		}, this);
	}

	description(count, parent, canEquip) {
		var str = "<div class='item-display'>";

		// Adds name and image if any
		str += `<div class='item-display-name'>${this.name}</div>`;
		if (this.img != null) {
			str += `<div class='item-display-img'>[img["${setup.ImagePath + this.img}"]]</div>`;
		} else {
			str += `<div class='item-display-img'></div>`;
		}

		var info = "";
		var button = "";

		// Creates base info for the item
		info += (this.tags.includes("shopItem") ? "$ " + this.price + " " : "") + 
				(count !== Infinity ? (`[Amnt: ${count}]`) : "") + " " + 
				((`[Fem: ${this.femininity}]`) || "");

		if (canEquip === false) {
			return `${str}<div class='item-display-info'>${info}</div><div class='item-display-button'></div></div>`;
		}

		var actionTags = ["shopItem", "gettable", "equippable", "equipped"].find((tag) => this.tags.includes(tag), this);

		button += String.format([actionTags].map((tag) => {
				switch (tag) {
					case "shopItem": return "<span id='{5}-{6}-buy'><<button 'buy'>><<if $player.femininity >= {4}>><<= {0}.buyItem('{2}',{3})>><<goto {1}>><<else>><<replace '#{5}-{6}-buy'>><<= $player.speak('<i>I would never buy that</i>')>><</replace>><</if>><</button>></span>";
					case "gettable": return "<span id='{5}-{6}-get'><<button 'get'>><<if $player.femininity >= {4}>><<= {0}.buyItem('{2}', 0 )>><<goto {1}>><<else>><<replace '#{5}-{6}-get'>><<= $player.speak('<i>I would never get that</i>')>><</replace>><</if>><</button>></span>";
					case "equippable": return "<span id='{5}-{6}-wear'><<button 'wear'>><<if $player.femininity >= {4}>><<= $player.equip('{2}')>><<goto {1}>><<else>><<replace '#{5}-{6}-wear'>><<= $player.speak('<i>I would never wear that</i>')>><</replace>><</if>><</button>></span>";
					case "equipped": return "<span id='{5}-{6}-remove'><<button 'remove' '{1}'>><<= $player.unequip('{2}')>><</button>></span>";
				}
			}).reduce((str, action) => str + action, button),
			parent, 
			State.passage, 
			this.name,
			this.price,
			this.femininity,
			Date.now(),
			this.name.replace(/ /g, "-")
		);

		return `<div class='item-display-info'>${info}</div><div class='item-display-button'>${button}</div></div>`
	}

	addTag(tag) {
		if (!this.tags.includes(tag))
			this.tags.push(tag)
	}

	removeTag(tagName) {
		this.tags = this.tags.filter((tag) => tag !== tagName);
	}
	
	clone() {
		return new Item(this);
	}

	toJSON() {
		var ownData = {};
		Object.keys(this).forEach(function (pn) {
			ownData[pn] = clone(this[pn]);
		}, this);
		return JSON.reviveWrapper('new Item($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Item', {
	value : Item
});