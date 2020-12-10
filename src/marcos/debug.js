Macro.add("debugVar", {
    handler: function() {
        var name = this.args[0];
        var display = this.args.length > 0 ? this.args[1] : this.args[0];

        var out = this.self.compute(display, State.getVar(name));

        $(this.output).append(out);
    },
    compute: function(key, val) {
        var t = this;
        var out;

        switch (typeof val) {
            case "object":
                if (Array.isArray(val)) {
                    out = val.reduce((dom, el, i) => {
                        var item = $("<li></li>").append(t.compute(i, el))
                        return dom.append(item);
                    }, $("<ul></ul>"))
                } else {
                    out = Object.keys(val).reduce((dom, key) => {
                        var item = $("<li></li>").append(t.compute(key, val[key]))
                        return dom.append(item);
                    }, $("<ul></ul>"))
                }
                break;
            default:
                out = $(`<span>${val}</span>`)
                break;
        }


        var debugKey = $(`<span class="debug-key">${key}: </span>`);
        var debugVal = $(`<span class="debug-val"></span>`).append(out);

        return $("<span></span>").append(debugKey).append(debugVal);
    }
})