const fs = require("fs");
const path = require("path");

class FileManager {
    constructor () { this.directory = path.join(__dirname, "../../database"); }

    read = (params = { snes: false, nes: false }) => {
        return new Promise((resolve, reject) => {
            fs.readdir(this.directory, (err, f) => {
                if (err)
                    throw new Error(err);

                const snes = f.filter(f => f.endsWith(".sfc"));
                const nes = f.filter(f => f.endsWith(".nes"));

                if (params.snes)
                    resolve({ snes });

                if (params.nes)
                    resolve({ nes });

                if (snes.length !== 0)
                    resolve({ snes, nes })
                else
                    resolve({ nes })
            });
        })
    };
}

module.exports = { FileManager };