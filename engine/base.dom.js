/**
 * Dom handler
 *
 * @author Condutiarii (R.Martinet)
 *
 * @class
 * @param tagName
 * @param attributes
 * @returns {{mouseover: (function(string): *), get: (function(): *), style: style, attach: (function(string, Function): *), attribute: ((function(type, *): undefined)|*), text: (function(string): *), trigger: ((function(type): undefined)|*), classList: *, on: (function(*): *)}}
 * @constructor
 */
const UI = function (tagName, attributes) {
    // Create tag
    const item = document.createElement(tagName);
    // Add attributes
    if (attributes !== undefined && typeof attributes === 'object') {
        for (const name in attributes) {
            item.setAttribute(name, attributes[name]);
        }
    }
    return {
        /**
         *
         */
        classList: item.classList,
        /**
         *
         * @returns {Element|UI.item} Le node créé
         */
        get: function () {
            return item;
        },
        /**
         * Add inline style
         * @param {object} css liste des propriété css (exemple : {border: "1px solid red", backgroundColor: 'rgb(200, 200, 200)'})
         */
        style: function (css) {
            for (const property in css) {
                item.style[property] = css[property];
            }
        },
        /**
         * Attach listener
         *
         * @param action
         * @param callback
         * @returns {*}
         */
        attach: function (action, callback) {
            item.addEventListener(action, callback);
            return this;
        },
        /**
         * Bind node to element
         * @param {*} element
         * @returns {UI}
         */
        on: function (element) {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            } else if (typeof element.get === 'function') {
                element = element.get();
            }
            if (element !== null && element.tagName) {
                element.appendChild(item);
            }
            return this;
        },
        /***
         *
         * @param {type} name
         * @param {string|undefined} value
         * @returns {string}
         */
        attribute: function (name, value) {
            if (value !== undefined) {
                item.setAttribute(name, value);
                return value;
            } else {
                return item.getAttribute(name);
            }
        },
        /**
         * Change text node
         * @param {string} text Nouveau texte
         */
        text: function (text) {
            item.innerHTML = text;
            return this;
        },
        /**
         *
         * @param {string} type
         */
        trigger: function (type) {
            if (item.hasOwnProperty('fireEvent')) {
                item.fireEvent('on' + type);
            } else {
                const event = new Event(type, { bubbles: true, cancelable: false });
                item.dispatchEvent(event);
            }
        },
        /**
         *
         * @param {string} classname
         * @returns {UI}
         */
        mouseover: function (classname) {
            this.attach('mouseover', function () {
                item.classList.add(classname);
            }).attach('mouseout', function () {
                item.classList.remove(classname);
            });
            return this;
        }
    };
};