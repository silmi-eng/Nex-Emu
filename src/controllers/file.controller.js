const fs = require("fs");
const path = require("path");

class FileManager {
    constructor () { this.directory = path.join(__dirname, "../../database"); }

    read = (params = { snes: false, nes: false }) => {
        return new Promise((resolve, reject) => {
            fs.readdir(this.directory, (err, f) => {
                if (err)
                    throw new Error(err);
                
                const nes = f.filter(f => f.endsWith(".nes"));
                resolve({ nes })
            });
        })
    };
}

module.exports = { FileManager };