/* global Dice, Core */

/**
 * Register dice world
 * 
 *  @author Condutiarii (R.Martinet)
 */
Dice.register('gen2', function () {
    return this.d6({ quantity: 2, mod: -2 });
});
Dice.register('gen7', function () {
    return this.d6({ quantity: 2, mod: -7 });
});

var CepheusEngine = function (mapEngine, mapId, informationId) {
    /**
     *
     * @param {type} references
     * @returns {Generator.eg.engineAnonym$2}
     */
    var Generator = function (references) {
        /**
         *
         * @param {type} properties
         * @param {type} name
         * @returns {unresolved}
         */
        var getReference = function (properties, name) {
            return references[name][properties[name]];
        };
        /**
         *
         * @param {type} properties
         * @param {type} name
         * @param {type} subname
         * @returns {String}
         */
        var uwp = function (properties, name, subname) {
            var part = '@';
            if (subname !== undefined) {
                part = getReference(properties, name)[subname];
            } else {
                part = properties[name].toString(16);
            }
            return part;
        };
        /**
         *
         * @param {type} properties
         * @returns {String}
         */
        var generateCode = function (properties) {
            return (
                uwp(properties, 'starport', 'class') +
                uwp(properties, 'size') +
                uwp(properties, 'atmosphere') +
                uwp(properties, 'hydrography') +
                uwp(properties, 'population') +
                uwp(properties, 'government') +
                uwp(properties, 'law') +
                '-' +
                uwp(properties, 'technology')
            ).toUpperCase();
        };
        return {
            /**
             *
             * @param {type} density
             * @returns {Generator.eg.engineAnonym$2.createSector.eg.engineAnonym$5}
             */
            createSector: function (density) {
                var sector = [];
                for (var x = 0; x < 10; x++) {
                    if (sector[x] === undefined) {
                        sector[x] = [];
                    }
                    for (var y = 0; y < 10; y++) {
                        sector[x][y] = this.createStar(density, {
                            x: x,
                            y: y
                        });
                    }
                }
                return {
                    density: density,
                    get: function (x, y) {
                        return sector[x][y];
                    },
                    drawMap: function (callback) {
                        sector.forEach(function (row) {
                            row.forEach(function (cell) {
                                if (callback !== undefined && typeof callback === 'function') {
                                    callback(cell);
                                }
                            });
                        });
                    }
                };
            },
            /**
             *
             * @param {type} density
             * @param {type} position
             * @returns {Generator.eg.engineAnonym$2.createStar.star}
             */
            createStar: function (density, position) {
                var star = position;
                if (Dice.d6() >= density) {
                    star.type = 'Star';
                    star.prime = (Dice.d6() <= 3) ? this.createPlanet(position) : null;
                }
                return star;
            },
            /**
             *
             * @param {type} position
             * @returns {Generator.eg.engineAnonym$2.createPlanet.eg.engineAnonym$6}
             */
            createPlanet: function (position) {
                var properties = {};
                for (var name in this.properties) {
                    properties[name] = this.properties[name].generate(properties);
                }
                return {
                    position: position,
                    properties: properties,
                    code: generateCode(properties)
                };
            },
            /**
             *
             * @param {type} name
             * @param {type} properties
             * @returns {Generator.eg.engineAnonym$2@arr;properties@call;get}
             */
            getPlanetProperty: function (name, properties) {
                return this.properties[name].get(properties);
            },
            /**
             *
             * @param {type} name
             * @param {type} properties
             * @returns {Generator.eg.engineAnonym$2@arr;properties@call;description}
             */
            getPlanetDescription: function (name, properties) {
                return this.properties[name].description(properties);
            },
            /**
             *
             */
            properties: {
                size: {
                    generate: function () {
                        return Dice.gen2();
                    },
                    get: function (properties) {
                        return getReference(properties, 'size');
                    },
                    description: function (properties) {
                        return {
                            'world size': getReference(properties, 'size').value + ' km',
                            'surface gravity': getReference(properties, 'size').gravity
                        };
                    }
                },
                atmosphere: {
                    generate: function (properties) {
                        var atmosphere = properties.size === 0 ? 0 : Dice.gen7() + properties.size;
                        return atmosphere.limit(0, 15);
                    },
                    get: function (properties) {
                        return getReference(properties, 'atmosphere');
                    },
                    description: function (properties) {
                        return {
                            atmosphere: getReference(properties, 'atmosphere').name,
                            pressure: getReference(properties, 'atmosphere').pressure.min + ' to ' + getReference(properties, 'atmosphere').pressure.max
                        };
                    }
                },
                hydrography: {
                    generate: function (properties) {
                        var modHydrographics = 0;
                        if (properties.atmosphere === 14) {
                            modHydrographics = -2;
                        } else if (properties.atmosphere <= 1 || (properties.atmosphere >= 10 && properties.atmosphere <= 12)) {
                            modHydrographics = -4;
                        }
                        var hydrography = properties.size <= 1 ? 0 : Dice.gen7() + properties.size + modHydrographics;
                        return hydrography.limit(0, 10);
                    },
                    get: function (properties) {
                        return getReference(properties, 'hydrography');
                    },
                    description: function (properties) {
                        return {
                            'hydrographic percentage': getReference(properties, 'hydrography').value.min + '% to ' + getReference(properties, 'hydrography').value.max + '%',
                            'hydrographic description': getReference(properties, 'hydrography').description
                        };
                    }
                },
                population: {
                    generate: function (properties) {
                        var modPopulation = 0;
                        if (properties.size <= 2) {
                            modPopulation += -1;
                        }
                        if (properties.atmosphere >= 10) {
                            modPopulation += -2;
                        } else if (properties.atmosphere === 6) {
                            modPopulation += 3;
                        } else if (properties.atmosphere === 5 || properties.atmosphere === 8) {
                            modPopulation += 1;
                        }
                        if (properties.atmosphere === 0 && properties.atmosphere <= 3) {
                            modPopulation += -2;
                        }
                        var population = Dice.gen2() + modPopulation;
                        return population.limit(0, 10);
                    },
                    get: function (properties) {
                        return references.population[properties.population];
                    },
                    description: function (properties) {
                        return {
                            population: getReference(properties, 'population').value,
                            range: getReference(properties, 'population').range.min + ' to ' + getReference(properties, 'population').range.max
                        };
                    }
                },
                government: {
                    generate: function (properties) {
                        var government = 0;
                        if (properties.population > 0) {
                            government = Dice.gen7() + properties.population;
                        }
                        return government.limit(0, 15);
                    },
                    get: function (properties) {
                        return getReference(properties, 'government');
                    },
                    description: function (properties) {
                        return {
                            government: getReference(properties, 'government').type
                        };
                    }
                },
                law: {
                    generate: function (properties) {
                        var law = 0;
                        if (properties.population > 0) {
                            law = Dice.gen7() + properties.population;
                        }
                        return law.limit(0, 15);
                    },
                    get: function (properties) {
                        return getReference(properties, 'law');
                    },
                    description: function (properties) {
                        return {
                            law: getReference(properties, 'law').type
                        };
                    }
                },
                technology: {
                    generate: function (properties) {
                        var technology = Dice.d6();
                        if (properties.size <= 1) {
                            technology += 2;
                        } else if (properties.size <= 4) {
                            technology += 1;
                        }
                        if (properties.atmosphere <= 3) {
                            technology += 1;
                        } else if (properties.atmosphere >= 10) {
                            technology += 1;
                        }
                        if (properties.hydrography === 0 || properties.hydrography === 9) {
                            technology += 1;
                        } else if (properties.hydrography === 10) {
                            technology += 2;
                        }
                        if (properties.population >= 1 && properties.population <= 5) {
                            technology += 1;
                        } else if (properties.population >= 9 && properties.population <= 12) {
                            technology += properties.population - 8;
                        }
                        if (properties.starport >= 7 && properties.starport <= 8) {
                            technology += 2;
                        } else if (properties.starport >= 9 && properties.starport <= 10) {
                            technology += 4;
                        } else if (properties.starport >= 11) {
                            technology += 6;
                        }
                        if ((properties.hydrography === 0 || properties.hydrography === 10) && properties.population >= 6) {
                            technology = technology.limit(4, 15);
                        }
                        if (properties.atmosphere === 4 || properties.atmosphere === 7 || properties.atmosphere === 9) {
                            technology = technology.limit(5, 15);
                        }
                        if (properties.atmosphere <= 3 || (properties.atmosphere >= 10 && properties.atmosphere <= 12)) {
                            technology = technology.limit(7, 15);
                        }
                        if ((properties.atmosphere === 13 || properties.atmosphere === 14) && properties.hydrography === 10) {
                            technology = technology.limit(7, 15);
                        }
                        return technology.limit(0, 15);
                    },
                    get: function (properties) {
                        return getReference(properties, 'technology');
                    },
                    description: function (properties) {
                        return {
                            technology: getReference(properties, 'technology').level
                        };
                    }
                },
                starport: {
                    generate: function (properties) {
                        var starport = Dice.gen7() + properties.population;
                        return starport.limit(0, 15);
                    },
                    get: function (properties) {
                        return getReference(properties, 'starport');
                    },
                    description: function (properties) {
                        if (getReference(properties, 'starport').class === 'X') {
                            return {
                                'starport': 'No'
                            };
                        } else {
                            return {
                                'starport class': getReference(properties, 'starport').class,
                                descriptor: getReference(properties, 'starport').descriptor,
                                'best fuel': getReference(properties, 'starport').fuel,
                                'annual maintenance': getReference(properties, 'starport').maintenance,
                                'shipyard capacity': getReference(properties, 'starport').capacity,
                                'possible bases': getReference(properties, 'starport').bases
                            };
                        }
                    }
                }
            }
        };
    };
    return function () {
        Core.ajaxQuery({
            url: 'engine/cepheus.ref.json',
            mode: 'JSON',
            success: function (data) {
                new mapEngine(new Generator(data), mapId, informationId);
            },
            fail: function (error) {
                console.log(error);
                throw Error('Reading error of settings.json');
            }
        }).send();
    };
};
