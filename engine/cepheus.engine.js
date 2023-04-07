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
/**
 *
 * @param mapEngine
 * @param mapId
 * @param informationId
 * @returns {(function(): void)|*}
 * @constructor
 */
const CepheusEngine = function (mapEngine, mapId, informationId) {
    /**
     *
     * @param references
     * @returns {{getPlanetDescription: (function(*, *): *), createSector: (function(*): {density: *, get: function(*, *): *, drawMap: function(*): void}), createStar: (function(*, *): *), createPlanet: (function(*): {code: String, position: *, properties: {}}), getPlanetProperty: (function(*, *): *), properties: {atmosphere: {get: (function(*): Array), description: (function(*): {atmosphere: *, pressure: string}), generate: (function(*): *)}, hydrography: {get: (function(*): Array), description: (function(*): {"hydrographic percentage": string, "hydrographic description": *}), generate: (function(*): *)}, government: {get: (function(*): Array), description: (function(*): {government: *}), generate: (function(*): *)}, law: {get: (function(*): Array), description: (function(*): {law: *}), generate: (function(*): *)}, size: {get: (function(*): Array), description: (function(*): {"surface gravity": *, "world size": string}), generate: (function(): *)}, starport: {get: (function(*): Array), description: ((function(*): ({starport: string}))|*), generate: (function(*): *)}, technology: {get: (function(*): Array), description: (function(*): {technology: *}), generate: (function(*): *)}, population: {get: (function(*): *), description: (function(*): {range: string, population: *}), generate: (function(*): *)}}}}
     * @constructor
     */
    const Generator = function (references) {
        /**
         *
         * @param properties
         * @param name
         * @returns {*}
         */
        const getReference = function (properties, name) {
            return references[name][properties[name]];
        };
        /**
         *
         * @param {object} properties
         * @param {string} name
         * @param {string} subName
         * @returns {String}
         */
        const uwp = function (properties, name, subName = "") {
            let part;
            if (subName !== "") {
                part = getReference(properties, name)[subName];
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
        const generateCode = function (properties) {
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
             * @param density
             * @returns {{density, get: (function(*, *): *), drawMap: drawMap}}
             */
            createSector: function (density) {
                const sector = [];
                for (let x = 0; x < 10; x++) {
                    if (sector[x] === undefined) {
                        sector[x] = [];
                    }
                    for (let y = 0; y < 10; y++) {
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
             * @param density
             * @param position
             * @returns {*}
             */
            createStar: function (density, position) {
                const star = position;
                if (Dice.d6() >= density) {
                    star.type = 'Star';
                    star.prime = (Dice.d6() <= 3) ? this.createPlanet(position) : null;
                }
                return star;
            },
            /**
             *
             * @param position
             * @returns {{code: String, position, properties: {}}}
             */
            createPlanet: function (position) {
                const properties = {};
                for (const name in this.properties) {
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
             * @param name
             * @param properties
             * @returns {*}
             */
            getPlanetProperty: function (name, properties) {
                return this.properties[name].get(properties);
            },
            /**
             *
             * @param name
             * @param properties
             * @returns {*}
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
                        const atmosphere = properties.size === 0 ? 0 : Dice.gen7() + properties.size;
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
                        let modHydrographics = 0;
                        if (properties.atmosphere === 14) {
                            modHydrographics = -2;
                        } else if (properties.atmosphere <= 1 || (properties.atmosphere >= 10 && properties.atmosphere <= 12)) {
                            modHydrographics = -4;
                        }
                        const hydrography = properties.size <= 1 ? 0 : Dice.gen7() + properties.size + modHydrographics;
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
                        let modPopulation = 0;
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
                        const population = Dice.gen2() + modPopulation;
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
                        let government = 0;
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
                        let law = 0;
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
                        let technology = Dice.d6();
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
                        const starport = Dice.gen7() + properties.population;
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
        new mapEngine(new Generator(Referential), mapId, informationId);
    };
};
