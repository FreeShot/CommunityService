class Item {
    constructor (config) {
        this.name = "Unnamed item";
        this.tags = [];
        this.price = 0;
        this.feminity = 0;

        Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
    }

    description(count, parent) {
        var str = String.format("<li class='itemDescription' id='{0}'>{0} ", this.name);
        if (count != Infinity) {
            str += String.format(
                "(Amnt: {0}) ",
                count
            );
        }

        if (this.tags.includes("shopItem"))
        {
            str += String.format(
                "<<button 'Buy (${3})' '{2}'>><<= {0}.buyItem('{1}', {3})>><</button>>",
                parent,
                this.name,
                State.passage,
                this.price
            );
        } else if (this.tags.includes("gettable")) {
            // Get for free
            str += String.format(
                "<<button 'Get' '{2}'>><<= {0}.buyItem('{1}', 0)>><</button>>",
                parent,
                this.name,
                State.passage
            );
        } else {
            if (this.tags.includes("equippable")) {
                console.log(State.variables.player.feminity);
                if (this.feminity <= State.variables.player.feminity) {
                // Only if not a shop item
                str += String.format(
                    "<<button 'Equip' '{1}'>><<= $player.equip('{0}')>><</button>>",
                    this.name,
                    State.passage
                    );
            } else {
                str += String.format(
                    "[Fem: {2}] <span id='{1}-equip-button'><<button 'Equip'>><<replace '#{1}-equip-button'>>Feminity too low<</replace>><</button>></span>",
                    this.name,
                    this.name.split(' ').join('-').toLowerCase(),
                    this.feminity
                    );
            }
        } else if (this.tags.includes("equipped")) {
            // Currently equipped tag can't be both equipped and equippable
            str += String.format(
                "<<button 'Unequip' '{1}'>><<= $player.unequip('{0}')>><</button>>",
                this.name,
                State.passage
                );
        }
        }
        return str + "</li>";
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