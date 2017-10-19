/**
 * Color handler
 * 
 * @author Condutiarii (R.Martinet)
 */

var Color = (function () {
    var colors = {};
    var collection = [];
    /**
     *
     * @param {type} hue 0-360
     * @param {type} saturation 0-100
     * @param {type} value 0-100
     * @returns {cdadr_color_L1.hsvCalcul.cdadr.colorAnonym$0}
     */
    var hsvCalcul = function (hue, saturation, value) {
        hue = hue.limit(0, 360);
        saturation = saturation.limit(0, 100) / 100;
        value = value.limit(0, 100) / 100;
        hue /= 60;
        var mode = Math.floor(hue);
        var data = [
            value * (1 - saturation),
            value * (1 - (hue - mode) * saturation),
            value * (1 - (1 - (hue - mode)) * saturation)
        ];
        //default saturation = 0
        var result = {
            red: value,
            green: value,
            blue: value
        };
        if (saturation !== 0) {
            switch (mode) {
                case 0:
                    result.green = data[2];
                    result.blue = data[0];
                    break;
                case 1:
                    result.red = data[1];
                    result.blue = data[0];
                    break;
                case 2:
                    result.red = data[0];
                    result.blue = data[2];
                    break;
                case 3:
                    result.red = data[0];
                    result.green = data[1];
                    ;
                    break;
                case 4:
                    result.red = data[2];
                    result.green = data[0];
                    break;
                case 5:
                    result.green = data[0];
                    result.blue = data[1];
                    break;
                default:
                    break;
            }
        }
        //limit rgb
        for (var name in result) {
            result[name] = Math.floor((result[name] * 255)).limit(0, 255);
        }
        return result;
    };
    /**
     *
     * @param {type} name
     * @param {type} value
     * @returns {undefined}
     */
    return {
        /**
         *
         * @param {type} name
         * @param {type} value
         * @returns {undefined}
         */
        add: function (name, value) {
            if (typeof value === 'object') {
                collection.push(name);
                colors[name] = value;
            } else if (typeof value === 'string') {
                value = value.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (hex, r, g, b) {
                    return r + r + g + g + b + b;
                });
                var result = /^#?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d]{1})([a-f\d]{1})([a-f\d]{1}))$/i.exec(value);
                if (result) {
                    collection.push(name);
                    colors[name] = {
                        red: result[1].toHex(),
                        green: result[2].toHex(),
                        blue: result[3].toHex()
                    };
                } else {
                    throw Error('Error format HTML color.');
                }
            }
        },
        /**
         *
         * @param {type} hue
         * @param {type} saturation
         * @param {type} value
         * @param {type} alpha
         * @returns {String}
         */
        hsv: function (hue, saturation, value, alpha) {
            var hsv = hsvCalcul(hue, saturation, value);
            var rgb = 'rgb(' + hsv.red + ',' + hsv.green + ',' + hsv.blue;
            return (alpha === undefined) ? rgb + ')' : rgb + ',' + alpha + ')';
        },
        /**
         *
         * @param {type} name
         * @param {type} alpha
         * @returns {String}
         */
        get: function (name, alpha) {
            if (colors[name] === undefined) {
                if (collection.length === 0) {
                    this.randomize();
                }
                collection.shuffle();
                name = collection[0];
            }
            var rgb = 'rgb(' + colors[name].red + ',' + colors[name].green + ',' + colors[name].blue;
            return (alpha === undefined) ? rgb + ')' : rgb + ',' + alpha + ')';
        },
        /**
         *
         * @param {type} red
         * @param {type} green
         * @param {type} blue
         * @param {type} alpha
         * @returns {String}
         */
        raw: function (red, green, blue, alpha) {
            var rgb = 'rgb(' + red + ',' + green + ',' + blue;
            return (alpha === undefined) ? rgb + ')' : rgb + ',' + alpha + ')';
        },
        /**
         *
         * @returns {undefined}
         */
        randomize: function () {
            var value = [255, 125, 0];
            var index = 0;
            for (var r = 1; r < value.length; r++) {
                for (var g = 0; g < value.length; g++) {
                    for (var b = 0; b < value.length; b++) {
                        this.add('random' + index++, { red: value[r], green: value[g], blue: value[b] });
                    }
                }
            }
        }
    };
})();