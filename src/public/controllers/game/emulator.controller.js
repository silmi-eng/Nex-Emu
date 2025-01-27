const canvas = document.getElementById("nes");
const ctx = canvas.getContext("2d");
const fW = 256;
const fH = 240;

class Emulator {
    constructor ({ game, system }) {
        this.windowController.resize();
        this.socket = new WebSocket('ws://192.168.1.160:3000');
        this.id = null;
        audio.setup();

        this.socket.onmessage = (e) => {
            const message = JSON.parse(e.data); 

            switch (message.type) {
                case 'welcome':
                    this.id = message.id;
                    this.socket.send(JSON.stringify({
                        type: 'initialize',
                        id: this.id,
                        game,
                        system
                    }))
                    break;
                case 'renders':
                    this.system.start(message.render);
                    break;
                case 'sound':
                    audio.play(message.sound);
                    break;
            }
        };

        document.addEventListener('keydown', (e) => this.socket.send(JSON.stringify({
            type: 'controller',
            id: this.id,
            action: 'buttonDown',
            key: e.code
        })));

        document.addEventListener('keyup', (e) => this.socket.send(JSON.stringify({
            type: 'controller',
            id: this.id,
            action: 'buttonUp',
            key: e.code
        })));
    };

    system = {
        frame: null,
        imageFrame: null,
        start: (compressed) => {
            const { frame } = this.decompress(compressed);
            this.frame = frame;
            
            this.imageFrame = ctx.createImageData(fW, fH);

            this.system.update();

            const offScreenCanvas = document.createElement('canvas');
            offScreenCanvas.width = fW;
            offScreenCanvas.height = fH;
            const offScreenCtx = offScreenCanvas.getContext('2d');;
            offScreenCtx.putImageData(this.imageFrame, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offScreenCanvas, 0, 0, canvas.width, canvas.height);
        },
        update: () => {
            for (let i = 0; i < this.frame.length; i++) {
                const pixel = i * 4;

                this.imageFrame.data[pixel] = this.frame[i];
                this.imageFrame.data[pixel + 1] = this.frame[i];
                this.imageFrame.data[pixel + 2] = this.frame[i];
                this.imageFrame.data[pixel + 3] = 255;
            }
        },
    };

    decompress = (buffer) => {
        const decompressedB = Uint8Array.from(atob(buffer), c => c.charCodeAt(0));

        return {
            frame: pako.inflate(decompressedB)
        }
    };

    windowController = {
        resize: () => {
            this.windowController.resizeAspect();
            window.addEventListener('resize', this.windowController.resizeAspect);
        },
        resizeAspect: () => {
            const aspect = 256 / 240;
            let width = window.innerWidth;
            let height = window.innerHeight;

            if (width / height > aspect) 
                width = height * aspect;
            else
                height = width / aspect;

            canvas.width = Math.floor(width);
            canvas.height = Math.floor(height);
        }
    }
}