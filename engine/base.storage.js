/**
 * Storage handler
 * 
 * @author Condutiarii (R.Martinet)
 * @param {string} namespace storage namespace
 * @param {boolean} session (Optional) Local default (temporary) session storage (permanent)
 * @returns {Storage} Local storage access
 */
var Storage = function (namespace, session, strict) {
    /*
     * Default value
     */
    namespace = namespace || 'default';
    strict = strict === undefined ? false : strict;
    session = session || false;
    /*
     * Default storage
     * @type Storage|Window.localStorage
     */
    var storage = (session === true) ? window.sessionStorage : window.localStorage;
    /**
     * Exception storage
     * @param {type} message
     * @returns {Storage.StorageException}
     */
    var StorageException = function (message) {
        this.message = message;
        this.name = "StorageException";
    };
    /**
     *
     * @param {string} key value key
     * @param {integer} id (Optional) Unique identifier (pair key / id)
     * @returns {String} the key with namespace
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
             * Returns the list of ids for a specific key type
             * @param {string} key collection key
             * @returns {Array|Object} list of ids for a specific key type
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
             * Saves the identifier in a list
             * @param {string} key value key
             * @param {integer} id (Optional) Unique identifier (pair key / id)
             * @returns {Array} Identifiers list
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
             * Delete item from the collection
             * @param {string} key value key
             * @param {integer} id (Optional) Unique identifier (pair key / id)
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
    // Return object
    return {
        /**
         * Saving a serialized value
         * @param {string} key value key
         * @param {Array|Object} data value to store
         * @param {integer} id (Optional) Unique identifier (pair key / id)
         * @returns {Array|Object} saved value
         */
        set: function (key, data, id) {
            Collection.addItem(key, id);
            storage.setItem(format(key, id), JSON.stringify(data));
            return data;
        },
        /**
         * Retrieves a serialized value
         * @param {string} key value key
         * @param {integer} id (Optional) Unique identifier (pair key / id)
         * @returns {Array|Object} value
         */
        get: function (key, id) {
            var value = storage.getItem(format(key, id));
            return JSON.parse(value);
        },
        /**
         * Updating a serialized value
         * @param {string} key value key
         * @param {Array|Object} data value to store
         * @param {integer} id (Optional) Unique identifier (pair key / id)
         * @returns {Array|Object} saved value
         */
        update: function (key, data, id) {
            storage.setItem(format(key, id), JSON.stringify(data));
            return data;
        },
        /**
         * Delete value
         * @param {string} key value key
         * @param {integer} id (Optional) Unique identifier (pair key / id)
         */
        delete: function (key, id) {
            Collection.deleteItem(key, id);
            storage.removeItem(format(key, id));
        },
        /**
         * Returns the list of ids for a specific key type
         * @param {string} key collection key
         * @returns {Array|Object} list of ids for a specific key type
         */
        collection: Collection.get,
        /**
         * Drop storage
         */
        drop: function () {
            storage.clear();
        },
        /**
         * Returns the storage definition
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
