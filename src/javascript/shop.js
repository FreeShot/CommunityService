class Shop {
	constructor (config) {
		this.categories = [];
		this.name = "Unnamed shop";

		Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addCategory(categoryName)
	{
		this.categories.push(new Inventory({"name": categoryName}));
	}

	addItem(category, item, count)
	{
		this.categories.find(
			function(el){return el.name == category}).addItem(item, count);
	}

	get listItem()
	{
		var str = "<ul>";
		this.categories.forEach(function(el) {
			str += String.format(
				"<li>{0}</li>",
				el.listItem()
			);
		});
		return str + "</ul>";
	}
	
	clone() {
        return new Shop(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Shop($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Shop', {
    value : Shop
});