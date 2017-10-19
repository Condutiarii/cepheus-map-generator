/**
 * Storage handler
 * 
 * @author Condutiarii (R.Martinet)
 * @param {string} namespace Espace de nom du stockage
 * @param {boolean} session [optionnel] Stockage de session (temporaire) par défaut local (permanent)
 * @returns {Storage} Accès stockage locale
 */
var Storage = function (namespace, session, strict) {
    /*
     * Valeur par défaut
     */
    namespace = namespace || 'default';
    strict = strict === undefined ? false : strict;
    session = session || false;
    /*
     * Stockage par défaut
     * @type Storage|Window.localStorage
     */
    var storage = (session === true) ? window.sessionStorage : window.localStorage;
    /**
     * Exception Storage
     * @param {type} message
     * @returns {Storage.StorageException}
     */
    var StorageException = function (message) {
        this.message = message;
        this.name = "StorageException";
    };
    /**
     *
     * @param {string} key clé de la valeur
     * @param {integer} id [optionnel] identifiant unique (couple key / id)
     * @returns {String} la clé avec espace de nom
     */
    var format = function (key, id) {
        if (id !== undefined) {
            key += '[' + id + ']';
        }
        return namespace + '.' + key;
    };
    /**
     *
     * @type
     */
    var Collection = function (name) {
        return {
            /**
             * Retourne la liste des id d'un type de key précis
             * @param {string} key lé de la collection
             * @returns {Array|Object} valeur retournée
             */
            get: function (key) {
                return JSON.parse(storage.getItem(format(name, key))) || [];
            },
            /**
             *
             * @param {type} key
             * @returns {Array|Object}
             */
            update: function (list, key) {
                storage.setItem(format(name, key), JSON.stringify(list));
            },
            /**
             * Enregistre l'identifiant dans une liste
             * @param {string} key clé de la valeur
             * @param {integer} id [optionnel] identifiant unique (couple key / id)
             * @returns {Array} Liste des identifiants
             */
            addItem: function (key, id) {
                if (id !== undefined) {
                    var list = Collection.get(key);
                    if (list.indexOf(id) < 0) {
                        list.push(id);
                        Collection.update(list, key);
                    } else if (strict && list.indexOf(id) > -1) {
                        throw new StorageException("Tentative d'écrire un nouvel élément avec un id existant en mode strict : " + key + '[' + id + '] (Méthode update conseillée)');
                    }
                }
            },
            /**
             *
             * @param {string} key clé de la valeur
             * @param {integer} id [optionnel] identifiant unique (couple key / id)
             */
            deleteItem: function (key, id) {
                if (id !== undefined) {
                    var list = Collection.get(key);
                    var index = list.indexOf(id);
                    if (index > -1) {
                        list.splice(index, 1);
                        Collection.update(list, key);
                    }
                }
            }
        };
    }('collection');
    //objet retourné
    return {
        /**
         * Sauvegarde d'une valeur serialisée
         * @param {string} key clé de la valeur
         * @param {Array|Object} data valeur à stocker
         * @param {integer} id [optionnel] identifiant unique (couple key / id)
         * @returns {Array|Object} valeur sauvegardée
         */
        set: function (key, data, id) {
            Collection.addItem(key, id);
            storage.setItem(format(key, id), JSON.stringify(data));
            return data;
        },
        /**
         * Récupère une valeur serialisée
         * @param {string} key clé de la valeur
         * @param {integer} id [optionnel] identifiant unique (couple key / id)
         * @returns {Array|Object} valeur retournée
         */
        get: function (key, id) {
            var value = storage.getItem(format(key, id));
            return JSON.parse(value);
        },
        /**
         * Mise à jour d'une valeur serialisée
         * @param {string} key clé de la valeur
         * @param {Array|Object} data valeur à stocker
         * @param {integer} id [optionnel] identifiant unique (couple key / id)
         * @returns {Array|Object} valeur sauvegardée
         */
        update: function (key, data, id) {
            storage.setItem(format(key, id), JSON.stringify(data));
        },
        /**
         * Suppression une valeur
         * @param {string} key clé de la valeur
         * @param {integer} id [optionnel] identifiant unique (couple key / id)
         */
        delete: function (key, id) {
            Collection.deleteItem(key, id);
            storage.removeItem(format(key, id));
        },
        /**
         * Retourne la liste des id d'un type de key précis
         * @param {string} key lé de la collection
         * @returns {Array|Object} valeur retournée
         */
        collection: Collection.get,
        /**
         * Nettoyage complet du stockage
         */
        drop: function () {
            storage.clear();
        },
        /**
         * Retourne la définition du stockage
         * @returns {Storage.cdadr.storageAnonym$0.definition.cdadr.storageAnonym$1}
         */
        definition: {
            storage: storage,
            type: session ? 'session' : 'locale',
            strict: strict,
            namespace: namespace
        }
    };
};
