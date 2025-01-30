class Database {
    #storeName;
    #tableName;
    #store;
    #ready;

    constructor(storeName, tableName) {
        this.#storeName = storeName;
        this.#tableName = tableName;

        this.#ready = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.#storeName, 2);

            request.onerror = (e) => {
                console.error(`Error: ${e.target.error}`);
                reject(e.target.error);
            };

            request.onsuccess = (e) => {
                this.#store = e.target.result;
                console.log(`${this.#storeName} database opened successfully`);
                resolve(this.#store);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                if (!db.objectStoreNames.contains(this.#tableName)) {
                    const store = db.createObjectStore(this.#tableName, { keyPath: "id", autoIncrement: true });
                    store.createIndex("email", "email", { unique: true });
                    console.log(`Table "${this.#tableName}" with unique email index created successfully.`);
                } else {
                    console.warn(`Table "${this.#tableName}" already exists.`);
                }
            };
        });
    }

    async insert(data) {
        await this.#ready;
        const transaction = this.#store.transaction(this.#tableName, "readwrite");
        const store = transaction.objectStore(this.#tableName);
        const request = store.add(data);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                console.log("Data inserted successfully");
                resolve(request.result);
            };

            transaction.onerror = (e) => {
                console.error("Error inserting data:", e.target.error);
                reject(`Error inserting data: ${e.target.error}`);
            };
        });
    }

    async get(key, value) {
        await this.#ready;
        const transaction = this.#store.transaction(this.#tableName, "readonly");
        const store = transaction.objectStore(this.#tableName);
        const indexed = store.index(key);
        const request = indexed.get(value);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = (e) => {
                console.error("Error fetching data:", e.target.error);
                reject(`Error fetching data: ${e.target.error}`);
            };
        });
    }

    async getAll() {
        await this.#ready; // ✅ Ensures database is initialized
    
        if (!this.#store.objectStoreNames.contains(this.#tableName)) {
            console.error(`Error: Table "${this.#tableName}" does not exist.`);
            return [];
        }
    
        const transaction = this.#store.transaction(this.#tableName, "readonly");
        const store = transaction.objectStore(this.#tableName);
        const request = store.getAll();
    
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = (e) => reject(`Error fetching all data: ${e.target.error}`);
        });
    }
    

    async update(id, newData) {
        await this.#ready;
        const transaction = this.#store.transaction(this.#tableName, "readwrite");
        const store = transaction.objectStore(this.#tableName);
        const request = store.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result) {
                    const updatedData = { ...request.result, ...newData };
                    store.put(updatedData);
                    console.log("Data updated successfully");
                    resolve(updatedData);
                } else {
                    console.warn(`No record found with id: ${id}`);
                    reject(`No record found with id: ${id}`);
                }
            };

            request.onerror = (e) => {
                console.error("Error updating data:", e.target.error);
                reject(`Error updating data: ${e.target.error}`);
            };
        });
    }

    async delete(id) {
        await this.#ready;
        const transaction = this.#store.transaction(this.#tableName, "readwrite");
        const store = transaction.objectStore(this.#tableName);
        const request = store.delete(id);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                console.log(`Data with id ${id} deleted successfully`);
                resolve(true);
            };

            transaction.onerror = (e) => {
                console.error("Error deleting data:", e.target.error);
                reject(`Error deleting data: ${e.target.error}`);
            };
        });
    }



    async deleteDatabase() {
        await this.#ready;

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this.#storeName);
    
            request.onsuccess = () => {
                console.log(`Database "${this.#storeName}" deleted successfully.`);
                resolve(true);
            };
    
            request.onerror = (e) => {
                console.error(`Error deleting database: ${e.target.error}`);
                reject(`Error deleting database: ${e.target.error}`);
            };
    
            request.onblocked = () => {
                console.warn(`Deletion of database "${this.#storeName}" is blocked. Close all open connections.`);
            };
        });
    }
    
}




export default Database;
