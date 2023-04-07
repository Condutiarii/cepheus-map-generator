/* global Palette */
/**
 * SVG Builder
 *
 * @author Condutiarii (R.Martinet)
 */
const SVGBuilder = {
    SVGNS: 'http://www.w3.org/2000/svg',
    XLINKNS: 'http://www.w3.org/1999/xlink',
    root: null,
    container: null,
    filters: {},
    items: {},
    /**
     *
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    alea: function (min, max) {
        return Math.floor((Math.random() * max)) + min;
    },
    /***
     *
     * @param {string} tagName
     * @param {object|undefined} attributes
     * @param {string|undefined} texte
     * @returns {SVGBuilder.addElement.element|Element}
     */
    addElement: function (tagName, attributes = undefined, texte = undefined) {
        const element = document.createElementNS(SVGBuilder.SVGNS, tagName);
        if (attributes !== undefined) {
            for (const name in attributes) {
                element.setAttribute(name, attributes[name]);
            }
        }
        if (texte !== undefined) {
            element.appendChild(document.createTextNode(texte));
        }
        return element;
    },
    /**
     *
     * @param {Element} item
     * @param {Array} style
     */
    addStyles: function (item, style) {
        if (style !== undefined && item.hasOwnProperty('style')) {
            for (const nom in style) {
                item.style[nom] = style[nom];
            }
        }
    },
    /**
     *
     * @param {Element} item
     * @param {type} attributes
     */
    addAttributes: function (item, attributes) {
        if (attributes !== undefined) {
            for (const nom in attributes) {
                item.setAttribute(nom, attributes[nom]);
            }
        }
    },
    /**
     *
     * @param {Element} item
     * @param {Event: {trigger, run}} event
     */
    addEvents: function (item, event) {
        if (event !== undefined) {
            item.addEventListener(event.trigger, event.run);
        }
    },
    /**
     *
     * @param {Element} item
     * @param {{style, attributes, event}} param
     */
    addOptions: function (item, param) {
        SVGBuilder.addStyles(item, param.style);
        SVGBuilder.addAttributes(item, param.attributes);
        SVGBuilder.addEvents(item, param.event);
    },
    /**
     *
     * @param {string} id
     */
    initialize: function (id) {
        SVGBuilder.items = {};
        SVGBuilder.root = SVGBuilder.addElement('svg', {
            width: '100%', height: '100%', viewBox: '0 0 1000 1000', preserveAspectRatio: 'xMinYMin meet', id: id

        });
        SVGBuilder.container = SVGBuilder.addElement('defs');
    },
    /**
     *
     * @param {{x,y,width,height}} param
     * @returns {SVGBuilder.addRectangle.item|Element}
     */
    addRectangle: function (param) {
        const item = SVGBuilder.addElement('rect', {
            x: param.x, y: param.y, width: param.width, height: param.height
        });
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {{x,y,rayon}} param
     * @returns {SVGBuilder.addElement.element|Element}
     */
    addCircle: function (param) {
        const item = SVGBuilder.addElement('circle', {
            cx: param.x, cy: param.y, r: param.rayon
        });
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {string} texte
     * @param {{x,y,width,height,fontFamily, fontSize}} param
     * @returns {SVGBuilder.addElement.element|Element|SVGBuilder.addText.item}
     */
    addText: function (param, texte) {
        const item = SVGBuilder.addElement('text', {
            x: param.x,
            y: param.y,
            width: param.width,
            height: param.height,
            'font-family': param.fontFamily,
            'font-size': param.fontSize
        }, texte);
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {{d}} param
     * @returns {SVGBuilder.addElement.element|Element|SVGBuilder.addPath.item}
     */
    addPath: function (param) {
        const item = SVGBuilder.addElement('path', {
            d: param.d
        });
        SVGBuilder.addOptions(item, param);
        return item;

    },
    /**
     *
     * @param param
     * @returns {SVGBuilder.addElement.element|Element}
     */
    addImage: function (param) {
        const item = SVGBuilder.addElement('image', {
            x: param.x, y: param.y, width: param.width, height: param.height
        });
        item.setAttributeNS(SVGBuilder.XLINKNS, 'xlink:href', param.file);
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {type} id
     * @param {{in, x, y, width, height, filters: Array, merge: {length}}} param
     */
    addFilter: function (id, param) {
        const filter = SVGBuilder.addElement('filter', {
            x: param.x, y: param.y, width: param.width, height: param.height, id: id
        });
        for (const name in param.filters) {
            const item = document.createElementNS(SVGBuilder.SVGNS, param.filters[name].name);
            for (const attribute in param.filters[name]) {
                if (attribute !== 'name' && typeof param.filters[name]) {
                    item.setAttribute(attribute, param.filters[name][attribute]);
                }
            }
            filter.appendChild(item);
        }
        if (param.merge !== undefined && param.merge.length > 0) {
            const merge = document.createElementNS(SVGBuilder.SVGNS, 'feMerge');
            param.merge.forEach(function (value) {
                const item = document.createElementNS(SVGBuilder.SVGNS, value.name);
                item.setAttribute('in', value.in);
                merge.appendChild(item);
            });
            filter.appendChild(merge);
        }
        SVGBuilder.filters[id] = 'url(#' + id + ')';
        SVGBuilder.container.appendChild(filter);
    },
    /**
     *
     * @param {Element} parent
     */
    finalize: function (parent) {
        SVGBuilder.root.appendChild(SVGBuilder.container);
        for (const objet in SVGBuilder.items) {
            SVGBuilder.items[objet].id = objet;
            SVGBuilder.root.appendChild(SVGBuilder.items[objet]);
        }
        parent.appendChild(SVGBuilder.root);
    }
};