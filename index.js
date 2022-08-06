const CacheEngine = {
    store: {},
    /**
     * Request a value from the cache
     * @param {String} key 
     * @returns 
     */
    get(key) {
        return this.store[key];
    },
    /**
     * Set a value in the cache
     * @param {String} key 
     * @param {*} value 
     * @returns 
     */
    set(key, value) {
        this.store[key] = value;
    },
    /**
     * Deletes a key from the cache
     * @param {String} key 
     * @returns {void}
     */
    delete(key) {
        delete this.store[key];
    },
    /**
     * Checks if the key is stored
     * @param {String} key 
     * @returns {Boolean}
     */
    has(key) {
        return this.store.hasOwnProperty(key);
    },
    /**
     * Will log the requested key to console
     * @param {String} key 
     * @returns {void}
     */
    log(key) {
        console.log(this.store[key]);
    },
    /**
     * Clears all data
     * @returns {void}
     */
    clear() {
        this.store = {};
    },
    /**
     * Returns all keys
     * @returns {Array}
     */
    keys() {
        return Object.keys(this.store);
    },
    /**
     * Returns all values
     * @returns {Array}
     */
    values() {
        return Object.values(this.store);
    },
    /**
     * Returns all entrys
     * @returns {Array}
     */
    entries() {
        return Object.entries(this.store);
    },
    /**
     * Returns the amount of stored keys
     * @returns {Number}
     */
    count() {
        return Object.keys(this.store).length;
    },
    /**
     * Stores one variable of a array of objects
     * @param {String} key_name
     * @param {String} value_name
     * @param {Array} data
     * @returns {Void}
     */
    set_data(key_name, value_name, data) {
        for (let i = 0; i < data.length; i++) {
            this.set(data[i][key_name], data[i][value_name]);
        }
    },
    /**
     * Stores a array of objects
     * @param {String} key_name 
     * @param {Array} data 
     * @returns {Void}
     */
    set_object(key_name, data) {
        for (let i = 0; i < data.length; i++) {
            const key_name_store = data[i][key_name]
            delete data[i][key_name];
            this.set(key_name_store, data[i]);
        }
    },
    /**
     * Creates a flow that will automaticly keep the set length to store a array of objects or values
     * @param {String} key_name
     * @param {Number} length
     * @param {Array} value_name
     * @returns {Array}
     */
    create_flow(key_name, length, data = []) {
        const entry = {
            data: data,
            length: length,
        }
        this.set(key_name, entry);
    },
    /**
     * Store value to array if lenth is reached delete first value
     * @param {String} key_name 
     * @param {String | Number} data 
     * @returns 
     */
    set_flow(key_name, data) {
        this.store[key_name].data.push(data);
        if (this.store[key_name].data.length > this.store[key_name].length) {
            this.store[key_name].data.shift();
        }
    },
    /**
     * Returns the stored array
     * @param {String} key_name
     * @returns {Array}
     */
    get_flow(key_name) {
        return this.store[key_name].data;
    },
    /**
     * Will calculate the rough size in bytes of the cached data
     * @returns {Number}
     */
    roughSize() {
        const objectList = [];
        const stack = [this.store];
        const bytes = [0];
        while (stack.length) {
            const value = stack.pop();
            if (value == null) bytes[0] += 4;
            else if (typeof value === 'boolean') bytes[0] += 4;
            else if (typeof value === 'string') bytes[0] += value.length * 2;
            else if (typeof value === 'number') bytes[0] += 8;
            else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
                objectList.push(value);
                if (typeof value.byteLength === 'number') bytes[0] += value.byteLength;
                else if (value[Symbol.iterator]) {
                    for (const v of value) stack.push(v);
                } else {
                    Object.keys(value).forEach(k => {
                        bytes[0] += k.length * 2; stack.push(value[k]);
                    });
                }
            }
        }
        return bytes[0];
    }
}

module.exports = CacheEngine;