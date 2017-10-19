/* global Function */

/**
 *  @author Condutiarii (R.Martinet)
 */

 if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () { };
        F.prototype = o;
        return new F();
    };
}

Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
};
//Extends Number
Number.method('pad', function (n, char) {
    return new Array(n).join('0').slice((n || 2) * -1) + this;
});

Number.method('random', function (max) {
    return Math.floor(Math.random() * max) + this;
});

Number.method('limit', function (min, max) {
    return Math.max(min, Math.min(max, this));
});

Number.method('gap', function (standard) {
    return (this >= standard) ? this - standard : standard - this;
});
//Extends String
String.method('ucFirst', function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
});

String.method('toHex', function () {
    return parseInt(this, 16);
});
//Extends Array
Array.method('shuffle', function () {
    this.sort(function () {
        return 0.5 - Math.random();
    });
});
//Core
var Core = {
    /**
     *
     * @param {type} item
     * @param {type} value
     * @returns {unresolved}
     */
    defaultValue: function (item, value) {
        return (typeof item !== 'undefined') ? item : value;
    },
    /**
     *
     * @param {type} url
     * @param {type} callback
     * @returns {undefined}
     */
    load: function (url, callback) {
        var head = document.querySelector('head');
        var script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    },
    /**
     *
     * @param {type} parameters
     * @returns {Core.ajaxQuery.cdadr.coreAnonym$0}
     */
    ajaxQuery: function (parameters) {
        //Parametres par defaut
        if (parameters === undefined) {
            parameters = {
                url: 'localhost',
                mode: 'GET',
                success: function (data) {
                    console.log(data);
                },
                fail: function () {
                    throw 'Erreur';
                }
            };
        }
        //selection parsing
        switch (parameters.mode) {
            case 'JSON':
                parameters.mode = 'GET';
                parameters.parsing = JSON.parse;
                break;
            case 'XML':
                parameters.mode = 'GET';
                parameters.parsing = function (data) {
                    var xmlDoc = null;
                    if (window.DOMParser) {
                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(data, "text/xml");
                    } else { // Internet Explorer
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(data);
                    }
                    return xmlDoc;
                };
                break;
            default:
                if (parameters.parsing === undefined) {
                    parameters.parsing = function (data) {
                        return data;
                    };
                }
                break;
        }
        //retourne l'objet
        return {
            query: new XMLHttpRequest(),
            send: function (arg) {
                var entity = this.query;
                entity.onreadystatechange = function () {
                    if (entity.readyState === 4) {
                        if (entity.status === 200) {
                            parameters.status = 'success';
                            var data = null;
                            if (typeof parameters.parsing === 'function') {
                                data = parameters.parsing(entity.responseText);
                            }
                            if (typeof parameters.success === 'function') {
                                parameters.success(data);
                            }
                        } else {
                            parameters.status = 'fail';
                            parameters.fail(parameters);
                        }
                    }
                };
                entity.open(parameters.mode, parameters.url);
                entity.send(arg);
            }
        };
    }

};

//var ajax = new Core.ajaxQuery({
//    url: 'categorie.json',
//    mode: 'JSON',
//    success: function (data) {
//        console.log(data);
//    },
//    fail: function (error) {
//        console.log(error);
//    }
//});
//ajax.send();
