/**
 * Storage handler
 *
 * @author Condutiarii (R.Martinet)
 *
 * @param namespace
 * @param session
 * @param strict
 * @returns {{
 *  drop,
 *  set: (function(string, (Array|Object), (int|undefined)): Array|Object),
 *  get: (function(string, int): any),
 *  update: (function(string, (Array|Object), int): Array|Object),
 *  definition: {namespace: string, storage: Storage, type: (string), strict: boolean},
 *  collection: (function(string): *),
 *  delete: (function(string, int)),
 *  }}
 * @constructor
 */
const Storage = function (namespace, session = false, strict = false) {
    /*
     * Default value
     */
    namespace = namespace || 'default';
    /*
     * Default storage
     * @type Storage|Window.localStorage
     */
    const storage = (session === true) ? window.sessionStorage : window.localStorage;
    /**
     * Exception storage
     * @param message
     * @constructor
     */
    const StorageException = function (message) {
        this.message = message;
        this.name = "StorageException";
    };
    /**
     *
     * @param {string} key value key
     * @param {*} id (Optional) Unique identifier (pair key / id)
     * @returns {String} the key with namespace
     */
    const format = function (key, id) {
        if (id !== undefined) {
            key += '[' + id + ']';
        }
        return namespace + '.' + key;
    };
    /**
     *
     * @type {{addItem: ((function(string, int): Array)|*), deleteItem: Function, get: (function(string): *), update: ((function(Array, string): (Array|Object))|*)}}
     * @constructor
     */
    const Collection = function (name) {
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
             * @param {Array} list
             * @param {string} key
             * @returns {Array|Object}
             */
            update: function (list, key) {
                storage.setItem(format(name, key), JSON.stringify(list));
            },
            /**
             * Saves the identifier in a list
             * @param {string} key value key
             * @param {int|undefined} id (Optional) Unique identifier (pair key / id)
             * @returns {Array} Identifiers list
             */
            addItem: function (key, id) {
                if (id !== undefined) {
                    const list = Collection.get(key);
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
             * @param {int|undefined} id (Optional) Unique identifier (pair key / id)
             * @type {Function}
             */
            deleteItem: function (key, id) {
                if (id !== undefined) {
                    const list = Collection.get(key);
                    const index = list.indexOf(id);
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
         * @param {int|undefined} id (Optional) Unique identifier (pair key / id)
         * @returns {Array|Object} saved value
         */
        set: function (key, data, id ) {
            Collection.addItem(key, id);
            storage.setItem(format(key, id), JSON.stringify(data));
            return data;
        },
        /**
         * Retrieves a serialized value
         * @param {string} key value key
         * @param {int} id (Optional) Unique identifier (pair key / id)
         * @returns {Array|Object} value
         */
        get: function (key, id) {
            const value = storage.getItem(format(key, id));
            return JSON.parse(value);
        },
        /**
         * Updating a serialized value
         * @param {string} key value key
         * @param {Array|Object} data value to store
         * @param {int} id (Optional) Unique identifier (pair key / id)
         * @returns {Array|Object} saved value
         */
        update: function (key, data, id) {
            storage.setItem(format(key, id), JSON.stringify(data));
            return data;
        },
        /**
         * Delete value
         * @param {string} key value key
         * @param {int} id (Optional) Unique identifier (pair key / id)
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
         */
        definition: {
            storage: storage,
            type: session ? 'session' : 'locale',
            strict: strict,
            namespace: namespace
        }
    };
};
