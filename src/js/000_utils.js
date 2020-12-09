window.utils = {
    color: {}
};

utils.color.toHex = function(color) {
    return `#${("0" + color.r.toString(16)).slice(-2)}${("0" + color.g.toString(16)).slice(-2)}${("0" + color.b.toString(16)).slice(-2)}`
}

utils.color.toNumber = function(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(4, 6), 16);
    var b = parseInt(hex.slice(5, 7), 16);

    return {r, g, b};
}

utils.color.brightness = function(color) {
    return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
}

utils.color.isBright = function(color) {
    return utils.color.brightness(color) < 128
}

utils.color.mix = function(color1, color2, amnt = 50) {
    var p = amnt / 100;
    function getMix(a, b, p) {
        return (b - a) * p + a
    }
    return {
        r: getMix(color1.r, color2.r, p),
        g: getMix(color1.g, color2.g, p),
        b: getMix(color1.b, color2.b, p)
    }
}