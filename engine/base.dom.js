/**
 * Dom handler
 * 
 * @author Condutiarii (R.Martinet)
 * @param {string} tagname nom de la balise
 * @param {object} [optionnel] attributes liste des attributs (exemple : {id: 'mon-id', class: 'initial', 'data-descr': "Exemple de texte"})
 * @param {string} [optionnel] text Texte à renseigner
 * @returns {UI.cdadr.uiAnonym$0}
 */
var UI = function (tagname, attributes) {
    // Create tag
    var item = document.createElement(tagname);
    // Add attributes
    if (attributes !== undefined && typeof attributes === 'object') {
        for (var name in attributes) {
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
            for (var property in css) {
                item.style[property] = css[property];
            }
        },
        /**
         * Attach listener
         * @param {string} action listener concerné
         * @param {function} callback Fonction de callback
         * @returns {UI.cdadr.uiAnonym$0} Objet tag
         */
        attach: function (action, callback) {
            item.addEventListener(action, callback);
            return this;
        },
        /**
         * Bind node to element
         * @param {Element} element contenant
         * @returns {UI.cdadr.uiAnonym$0} Objet tag
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
         * @returns {undefined}
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
         * @param {type} type
         * @returns {undefined}
         */
        trigger: function (type) {
            if (item.fireEvent) {
                item.fireEvent('on' + type);
            } else {
                var event = document.createEvent('Events');
                event.initEvent(type, true, false);
                item.dispatchEvent(event);
            }
        },
        /**
         *
         * @param {type} classname
         * @returns {UI.cdadr.uiAnonym$0}
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
