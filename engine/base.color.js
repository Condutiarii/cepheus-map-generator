/**
 * Color handler
 * 
 * @author Condutiarii (R.Martinet)
 */

/**
 * @type {{
 *  add: Color.add,
 *  get: (function(string, (CSSStyleDeclaration.float|undefined)=): string),
 *  raw: (function(number, number, number, CSSStyleDeclaration.float): string),
 *  hsv: (function(int, int, int, (CSSStyleDeclaration.float|undefined)=): string),
 *  randomize: ((function(): undefined)|*)
 *  }}
 */
const Color = (function () {
    const colors = {};
    const collection = [];
    /**
     *
     * @param hue
     * @param saturation
     * @param value
     * @returns {{red: number, green: number, blue: number}}
     */
    const hsvCalcul = function (hue, saturation, value) {
        hue = hue.limit(0, 360);
        saturation = saturation.limit(0, 100) / 100;
        value = value.limit(0, 100) / 100;
        hue /= 60;
        const mode = Math.floor(hue);
        const data = [
            value * (1 - saturation),
            value * (1 - (hue - mode) * saturation),
            value * (1 - (1 - (hue - mode)) * saturation)
        ];
        // default saturation = 0
        const result = {
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
        // limit rgb values
        for (let name in result) {
            result[name] = Math.floor((result[name] * 255)).limit(0, 255);
        }
        return result;
    };
    /**
     *
     * @param {string} name
     * @param {object} value
     * @returns {undefined}
     */
    return {
        /**
         *
         * @param {string} name
         * @param {*} value
         * @returns {void}
         */
        add: function (name, value) {
            if (typeof value === 'object') {
                collection.push(name);
                colors[name] = value;
            } else if (typeof value === 'string') {
                value = value.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (hex, r, g, b) {
                    return r + r + g + g + b + b;
                });
                const result = /^#?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i.exec(value);
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
         * @param {int} hue
         * @param {int} saturation
         * @param {int} value
         * @param {float|undefined} alpha
         * @returns {String}
         */
        hsv: function (hue, saturation, value, alpha = undefined) {
            const hsv = hsvCalcul(hue, saturation, value);
            const rgb = 'rgb(' + hsv.red + ',' + hsv.green + ',' + hsv.blue;
            return (alpha === undefined) ? rgb + ')' : rgb + ',' + alpha + ')';
        },
        /**
         *
         * @param {string} name
         * @param {float|undefined} alpha
         * @returns {String}
         */
        get: function (name, alpha = undefined) {
            if (colors[name] === undefined) {
                if (collection.length === 0) {
                    this.randomize();
                }
                collection.shuffle();
                name = collection[0];
            }
            const rgb = 'rgb(' + colors[name].red + ',' + colors[name].green + ',' + colors[name].blue;
            return (alpha === undefined) ? rgb + ')' : rgb + ',' + alpha + ')';
        },
        /**
         *
         * @param {number} red
         * @param {number} green
         * @param {number} blue
         * @param {float} alpha
         * @returns {String}
         */
        raw: function (red, green, blue, alpha) {
            const rgb = 'rgb(' + red + ',' + green + ',' + blue;
            return (alpha === undefined) ? rgb + ')' : rgb + ',' + alpha + ')';
        },
        /**
         *
         * @returns {undefined}
         */
        randomize: function () {
            const value = [255, 125, 0];
            let index = 0;
            for (let r = 1; r < value.length; r++) {
                for (let g = 0; g < value.length; g++) {
                    for (let b = 0; b < value.length; b++) {
                        this.add('random' + index++, { red: value[r], green: value[g], blue: value[b] });
                    }
                }
            }
        }
    };
})();