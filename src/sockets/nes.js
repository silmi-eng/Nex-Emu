const fs = require("fs");
const path = require("path");
const jsnes = require("jsnes");
const zlib = require("zlib");
const { NesController } = require("./controller");

class Nes {
    constructor ({game, ws, id}) {
        this.nes = new Map();
        this.rom = path.join(__dirname, '../../database', `${game}.nes`);
        this.audioSample = [];
        this.AUDIO_BUFFERING = 512;

        if (!fs.existsSync(this.rom))
            ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));

        this.binaryRom = fs.readFileSync(this.rom, { encoding: 'binary' });
        this.system = new jsnes.NES({
            onFrame: async (buffer) => {
                ws.send(JSON.stringify({
                    type: 'renders',
                    render: this.compress(buffer)
                }))
            },
            onAudioSample: (left, right) => {
                this.audioSample.push({ left, right });

                if (this.audioSample.length >= this.AUDIO_BUFFERING)
                    if (this.audioSample.length > 0) {
                        ws.send(JSON.stringify({
                            type: 'sound',
                            sound: this.audioSample
                        }));

                        this.audioSample = [];
                    }
            },
        });

        this.system.loadROM(this.binaryRom);
        const interval = setInterval(() => this.system.frame(), 1000/ 60);
        this.nes.set(id, { system: this.system, interval });
    }

    compress = (buffer) => zlib.deflateSync(Buffer.from(buffer)).toString('base64'); 

    commands = ({ action, key, id }) => {
        const instance = this.nes.get(id);

        if (instance) {
            const { system, interval } = instance;
            
            const controller = new NesController(jsnes);
            const selected = controller.keys[key];

            if (selected || selected === 0)
                system[action](1, selected);
        }
    }

    remove = (id) => {
        const instance = this.nes.get(id);

        if (instance) {
            clearInterval(instance.interval);
            this.nes.delete(id);
        }
    }
}

module.exports = { Nes };