const fs = require('fs');
const crypto = require('crypto');
// Nodejs fs documentation
// https://nodejs.org/api/fs.html#fs_fspromises_readfile_path_options

class UsersRepository {
    // Most of the object's functions are asynchronous and have a single purpose.
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
        
    }

    async getAll() {
        // Open the file called this.filename
        return JSON.parse (await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

    async create(attrs) {
         attrs.id = this.randomId();
         const records = await this.getAll();
         records.push(attrs);

        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    // Returns random ID 
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
}
// Temperary test function for the repository's functions
const test = async () => {
    const repo = new UsersRepository('users.json');

    const user = await repo.getOne('937a396a');
    console.log(user);
}

test();
