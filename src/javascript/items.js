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
		str += String.format("<div class='item-display-name'>{0}</div>", this.name);
		if (this.img != null) {
			str += String.format("<div class='item-display-img'>[img['{0}']]</div>", setup.ImagePath + this.img);
		} else {
			str += "<div class='item-display-img'></div>";
		}

		var info = "";
		var button = "";

		// Creates base info for the item
		info += (this.tags.includes("shopItem") ? "$ " + this.price + " " : "") + 
				(count !== Infinity ? ("[Amnt: " + count + "]") : "") + " " + 
				(("[Fem: " + this.femininity + "]") || "");

		if (canEquip === false) {
			return String.format(
				"{0}<div class='item-display-info'>{1}</div><div class='item-display-button'></div></div>",
				str, 
				info
			);
		}

		var actionTags = ["shopItem", "gettable", "equippable", "equipped"].find(function(tag) {
			return this.tags.includes(tag);
		}, this);

		button += String.format([actionTags].map(function(tag) {
				switch (tag) {
					case "shopItem": return "<span id='{5}-{6}-buy'><<button 'buy'>><<if $player.femininity >= {4}>><<= {0}.buyItem('{2}',{3})>><<goto {1}>><<else>><<replace '#{5}-{6}-buy'>><<= $player.speak('<i>I would never buy that</i>')>><</replace>><</if>><</button>></span>";
					case "gettable": return "<span id='{5}-{6}-get'><<button 'get'>><<if $player.femininity >= {4}>><<= {0}.buyItem('{2}', 0 )>><<goto {1}>><<else>><<replace '#{5}-{6}-get'>><<= $player.speak('<i>I would never get that</i>')>><</replace>><</if>><</button>></span>";
					case "equippable": return "<span id='{5}-{6}-wear'><<button 'wear'>><<if $player.femininity >= {4}>><<= $player.equip('{2}')>><<goto {1}>><<else>><<replace '#{5}-{6}-wear'>><<= $player.speak('<i>I would never wear that</i>')>><</replace>><</if>><</button>></span>";
					case "equipped": return "<span id='{5}-{6}-remove'><<button 'remove' '{1}'>><<= $player.unequip('{2}')>><</button>></span>";
				}
			}).reduce(function(str, action) {
				return str + action;
			}, button),
			parent, 
			State.passage, 
			this.name,
			this.price,
			this.femininity,
			Date.now(),
			this.name.replace(/ /g, "-")
		);

		str += String.format("<div class='item-display-info'>{0}</div>", info);
		str += String.format("<div class='item-display-button'>{0}</div>", button);

		return str + "</div>";
	}

	addTag(tag) {
		if (!this.tags.includes(tag))
		{
			this.tags.push(tag);
		}
	}

	removeTag(tagName) {
		this.tags = this.tags.filter(function(tag) {return tag !== tagName});
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