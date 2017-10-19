/* global Palette */
/**
 * Constructeur de SVG
 * 
 * @author Condutiarii (R.Martinet)
 */
var SVGBuilder = {
    SVGNS: 'http://www.w3.org/2000/svg',
    XLINKNS: 'http://www.w3.org/1999/xlink',
    root: null,
    container: null,
    filters: {},
    items: {},
    /**
     *
     * @param {type} min
     * @param {type} max
     * @returns {Number}
     */
    alea: function (min, max) {
        return Math.floor((Math.random() * max)) + min;
    },
    /***
     *
     * @param {type} tagname
     * @param {type} attributes
     * @param {type} texte
     * @returns {SVGBuilder.addElement.element|Element}
     */
    addElement: function (tagname, attributes, texte) {
        var element = document.createElementNS(SVGBuilder.SVGNS, tagname);
        if (attributes !== undefined) {
            for (var name in attributes) {
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
     * @param {type} item
     * @param {type} style
     * @returns {undefined}
     */
    addStyles: function (item, style) {
        if (style !== undefined) {
            for (var nom in style) {
                item.style[nom] = style[nom];
            }
        }
    },
    /**
     *
     * @param {type} item
     * @param {type} attributes
     * @returns {undefined}
     */
    addAttributes: function (item, attributes) {
        if (attributes !== undefined) {
            for (var nom in attributes) {
                item.setAttribute(nom, attributes[nom]);
            }
        }
    },
    /**
     *
     * @param {type} item
     * @param {type} event
     * @returns {undefined}
     */
    addEvents: function (item, event) {
        if (event !== undefined) {
            item.addEventListener(event.trigger, event.run);
        }
    },
    /**
     *
     * @param {type} item
     * @param {type} param
     * @returns {undefined}
     */
    addOptions: function (item, param) {
        SVGBuilder.addStyles(item, param.style);
        SVGBuilder.addAttributes(item, param.attributes);
        SVGBuilder.addEvents(item, param.event);
    },
    /**
     *
     * @param {type} id
     * @returns {undefined}
     */
    initialize: function (id) {
        SVGBuilder.items = {};
        SVGBuilder.root = SVGBuilder.addElement('svg', {
            width: '100%',
            height: '100%',
            viewBox: '0 0 1000 1000',
            preserveAspectRatio: 'xMinYMin meet',
            id: id

        });
        SVGBuilder.container = SVGBuilder.addElement('defs');
    },
    /**
     *
     * @param {type} id
     * @param {type} param
     * @returns {SVGBuilder.addRectangle.item|Element}
     */
    addRectangle: function (param) {
        var item = SVGBuilder.addElement('rect', {
            x: param.x,
            y: param.y,
            width: param.width,
            height: param.height
        });
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {type} id
     * @param {type} param
     * @returns {SVGBuilder.addElement.element|Element}
     */
    addCircle: function (param) {
        var item = SVGBuilder.addElement('circle', {
            cx: param.x,
            cy: param.y,
            r: param.rayon
        });
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {type} texte
     * @param {type} param
     * @param {type} id
     * @returns {SVGBuilder.addElement.element|Element|SVGBuilder.addText.item}
     */
    addText: function (param, texte) {
        var item = SVGBuilder.addElement('text', {
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
     * @param {type} id
     * @param {type} param
     * @returns {SVGBuilder.addElement.element|Element|SVGBuilder.addPath.item}
     */
    addPath: function (param) {
        var item = SVGBuilder.addElement('path', {
            d: param.d
        });
        SVGBuilder.addOptions(item, param);
        return item;

    },
    /**
     *
     * @param {type} id
     * @param {type} param
     * @returns {SVGBuilder.addImage.item|Element}
     */
    addImage: function (param) {
        var item = SVGBuilder.addElement('image', {
            x: param.x,
            y: param.y,
            width: param.width,
            height: param.height
        });
        item.setAttributeNS(SVGBuilder.XLINKNS, 'xlink:href', param.file);
        SVGBuilder.addOptions(item, param);
        return item;
    },
    /**
     *
     * @param {type} id
     * @param {type} param
     * @returns {undefined}
     */
    addFilter: function (id, param) {
        var filter = SVGBuilder.addElement('filter', {
            x: param.x,
            y: param.y,
            width: param.width,
            height: param.height,
            id: id
        });
        for (var name in param.filters) {
            var item = document.createElementNS(SVGBuilder.SVGNS, param.filters[name].name);
            for (var attribute in param.filters[name]) {
                if (attribute !== 'name' && typeof param.filters[name]) {
                    item.setAttribute(attribute, param.filters[name][attribute]);
                }
            }
            filter.appendChild(item);
        }
        if (param.merge !== undefined && param.merge.length > 0) {
            var merge = document.createElementNS(SVGBuilder.SVGNS, 'feMerge');
            param.merge.forEach(function (value) {
                var item = document.createElementNS(SVGBuilder.SVGNS, value.name);
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
     * @param {type} parent
     * @returns {undefined}
     */
    finalize: function (parent) {
        SVGBuilder.root.appendChild(SVGBuilder.container);
        for (var objet in SVGBuilder.items) {
            SVGBuilder.items[objet].id = objet;
            SVGBuilder.root.appendChild(SVGBuilder.items[objet]);
        }
        parent.appendChild(SVGBuilder.root);
    }
};