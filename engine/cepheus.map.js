
/* global UI, SVGBuilder, Color, Dice */
/**
 * Sector map Drawer (SVG)
 * 
 * @author Condutiarii (R.Martinet)
 */

var CepheusMap = function (generator, parameters) {
    // Clean
    if (document.getElementById('sector')) {
        document.getElementById('sector').remove();
    }
    //  Initialize
    SVGBuilder.initialize('sector');
    //  Information page
    var information = function (sector) {
        var planet = document.getElementById('information');
        if (planet === null) {
            planet = UI('ul', {
                id: 'information'
            }).on(parameters.information);
        }
        var collection = document.querySelectorAll('#information li');
        if (!collection.forEach) { //firefox
            for (var element in collection) {
                collection[element].remove();
            }
        } else { //chrome
            collection.forEach(function (element) {
                element.remove();
            });
        }
        if (sector.prime) {
            var description = {
                uwp: sector.prime.position.x.pad(2) + sector.prime.position.y.pad(2) + " " + sector.prime.code
            };
            for (var name in sector.prime.properties) {
                var values = generator.getPlanetDescription(name, sector.prime.properties);
                for (var label in values) {
                    description[label] = values[label];
                }
            }
            for (var label in description) {
                UI('li', {})
                    .on(planet)
                    .text(label + ' : ' + description[label]);
            }
        }
    };
    // Draw sector
    var draw = function (sector) {

        var fragment = sector.x.pad(2) + '' + sector.y.pad(2);
        var posX = sector.x * 100;
        var posY = sector.y * 100;
        //      click information
        var action = {
            trigger: 'click',
            run: function () {
                information(sector);
            }
        };
        // Drawing star generate star point for path svg element
        var drawingStar = function (property, x, y) {
            var rule = {
                minX: property.center - property.width / 2,
                maxX: property.center + property.width / 2,
                minY: property.center - property.height / 2,
                maxY: property.center + property.height / 2,
                minAX: property.center - (property.width / 2) / 10,
                maxAX: property.center + (property.width / 2) / 10,
                minAY: property.center - (property.height / 2) / 10,
                maxAY: property.center + (property.height / 2) / 10
            };
            var d = 'M' + (property.center + x) + ',' + (rule.minY + y) + ' ';
            d += 'L ' + (rule.maxAX + x) + ',' + (rule.minAY + y) + ' ';
            d += 'L ' + (rule.maxX + x) + ',' + (property.center + y) + ' ';
            d += 'L ' + (rule.maxAX + x) + ',' + (rule.maxAY + y) + ' ';
            d += 'L ' + (property.center + x) + ',' + (rule.maxY + y) + ' ';
            d += 'L ' + (rule.minAX + x) + ',' + (rule.maxAY + y) + ' ';
            d += 'L ' + (rule.minX + x) + ',' + (property.center + y) + ' ';
            d += 'L ' + (rule.minAX + x) + ',' + (rule.minAY + y) + ' ';
            d += 'Z';
            return d;
        };
        //  Palette
        Color.add('black', '#000');
        Color.add('white', '#FFF');
        Color.add('sector', '#9B9');
        Color.add('uwp', '#FF9');
        Color.add('starport', '#FF0');
        Color.add('ocean', '#99F');
        Color.add('technology', '#F60');
        /**
         * Sector generation
         */

        SVGBuilder.items['sector' + fragment] = SVGBuilder.addRectangle({
            x: posX,
            y: posY,
            width: 100,
            height: 100,
            attributes: {
                fill: Color.get('black'),
                stroke: Color.get('sector'),
                class: 'sector'
            },
            event: action
        });
        SVGBuilder.items['position' + fragment] = SVGBuilder.addText({
            x: posX + 6,
            y: posY + 14,
            width: 100,
            height: 20,
            fontFamily: 'Cepheus',
            fontSize: 12,
            attributes: {
                fill: Color.get('sector'),
                class: 'sector'
            }
        }, sector.x.pad(2) + '-' + sector.y.pad(2));
        /**
         * Star generation
         */

        if (sector.type) {
            var size = Dice.random(34, 42);
            var animation_time = Dice.random(1, 3) + (Dice.random(1, 100) / 100);
            SVGBuilder.items['starbody' + fragment] = SVGBuilder.addCircle({
                x: posX + 50,
                y: posY + 50,
                rayon: size / 6,
                attributes: {
                    fill: Color.get('uwp'),
                    class: 'star'
                },
                style: {
                    animationDuration: animation_time + 's',
                },
                event: action
            });
            SVGBuilder.items['star' + fragment] = SVGBuilder.addPath({
                d: drawingStar({
                    center: 50,
                    width: size,
                    height: size
                }, posX, posY),
                attributes: {
                    fill: Color.get('white'),
                    stroke: Color.get('black'),
                    class: 'star'
                },
                style: {
                    animationDuration: animation_time + 's',
                },
                event: action
            });
            /**
             * Habitable generation
             */

            if (sector.prime) {
                var chips = ['hydrography', 'atmosphere', 'population', 'technology'];

                var atmosphere = generator.getPlanetDescription('atmosphere', sector.prime.properties);

                var color = {
                    h: 200,
                    s: 100,
                    v: 100
                };
                if (atmosphere.atmosphere.indexOf("Tainted") >= 0) {
                    color.v = 40;
                } else if (atmosphere.atmosphere.indexOf("Insidious") >= 0) {
                    color.h = 40;
                    color.s = 60;
                } else if (atmosphere.atmosphere.indexOf("Corrosive") >= 0) {
                    color.h = 20;
                    color.s = 100;
                    color.v = 100;
                } else if (atmosphere.atmosphere.indexOf("Exotic") >= 0) {
                    color.h = 140;
                    color.v = 60;
                } else if (atmosphere.atmosphere.indexOf("None") >= 0) {
                    color.s = 0;
                    color.v = 20;
                }

                var colorCode = {
                    hydrography: Color.hsv(
                        60 + (sector.prime.properties.hydrography * 15),
                        sector.prime.properties.hydrography * 10,
                        sector.prime.properties.hydrography * 8 + 20
                    ),
                    atmosphere: Color.hsv(color.h, color.s, color.v),
                    population: Color.hsv(120 - sector.prime.properties.population * 12, 100, 100),
                    technology: Color.hsv(sector.prime.properties.technology * 12, 70, 70)
                };
                /**
                 * Planets generation
                 */

                SVGBuilder.items['uwp' + fragment] = SVGBuilder.addText({
                    x: posX + 6,
                    y: posY + 96,
                    width: 100,
                    height: 20,
                    fontFamily: 'Cepheus',
                    fontSize: 12,
                    attributes: {
                        fill: Color.get('uwp'),
                        class: 'uwp'
                    }
                }, sector.prime.code);
                SVGBuilder.items['planet' + fragment] = SVGBuilder.addCircle({
                    x: posX + 60,
                    y: posY + 60,
                    rayon: sector.prime.properties.size + 4,
                    attributes: {
                        fill: colorCode.atmosphere,
                        stroke: Color.get('white'),
                        class: 'planet'
                    },
                    event: action
                });
                /**
                 * Info Chips generation
                 */


                chips.forEach(function (item, index) {
                    SVGBuilder.items[item + fragment] = SVGBuilder.addCircle({
                        x: posX + 90,
                        y: posY + 8 + (index * 10),
                        rayon: 4,
                        attributes: {
                            fill: colorCode[item],
                            class: 'information'
                        },
                        event: action
                    });
                });
                /**
                 * starport generation
                 */

                var starport = generator.getPlanetDescription('starport', sector.prime.properties);
                if (starport.starport !== 'No') {
                    var value = { A: 5, B: 4, C: 3, D: 2, E: 1 };
                    for (var n = 0; n < value[starport['starport class']]; n++) {
                        SVGBuilder.items['starport' + fragment + '-' + n] = SVGBuilder.addRectangle({
                            x: posX + 5,
                            y: posY + 20 + (n * 7),
                            width: 6,
                            height: 6,
                            attributes: {
                                fill: Color.get('starport'),
                                class: 'starport'
                            },
                            event: action
                        });
                    }
                }
            }
        }
    };
    generator.createSector(parameters.density).drawMap(draw);
    SVGBuilder.finalize(document.getElementById(parameters.map));
};
