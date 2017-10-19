
/**
 * Parameters are Array of number of faces of usually dices
 *
 * @author Condutiarii (R.Martinet)
 * @type purse Object with methods to use
 */
var Dice = (function (dices) {
    var DiceException = function (message) {
        this.message = message;
        this.name = "DiceException";
    };
    var purse = {
        /**
         * Raw Random dice
         * @param {int} min minimal value
         * @param {int} max maximal value
         * @returns {int} random result between min and max
         */
        random: function (min, max) {
            return min.random(max);
        },
        /**
         * Register new dice
         * Example :
         * Dice.register('2d6-2', function () {
         *     return this.d6({quantity: 2, mod: -2});
         * });
         * @param {type} name
         * @param {type} callback
         * @returns {undefined}
         */
        register: function (name, callback) {
            if (name === undefined || typeof name !== 'string') {
                throw new DiceException('Nom indéfini.');
            }
            callback = (typeof callback !== 'undefined') ? callback : function () { };
            this[name] = callback;
        }
    };
    dices.forEach(function (face) {
        /**
         * Options :
         * quantity: number of dices
         * mod: modificator to apply
         * Example :
         * Dice.d6({quantity: 2, mod: -2}); => 2d6-2
         */
        purse.register('d' + face, function (options) {
            options = (typeof options !== 'undefined') ? options : { mod: 0, quantity: 1 };
            options.quantity = (typeof options.quantity !== 'undefined') ? options.quantity : 1;
            options.mod = (typeof options.mod !== 'undefined') ? options.mod : 0;
            var total = 0;
            for (var n = 0; n < options.quantity; n++) {
                total += purse.random(1, face);
            }
            return total + options.mod;
        });
    });
    return purse;
}([2, 4, 6, 8, 10, 12, 20]));
