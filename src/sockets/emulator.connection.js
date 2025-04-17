const http = require("http");
const { v4: uuidv4 } = require('uuid');

const { Connection } = require("./connection");
const { Nes } = require("./nes");

module.exports = app => {
    const server = http.createServer(app);
    const wss = new Connection({ server }).wss;

    const connections = new Map();

    wss.on("connection", (ws, req) => {       
        const id = uuidv4();
        ws.id = id;
        console.log('connected');
        

        ws.send(JSON.stringify({
            type: 'welcome',
            id
        }));

        ws.on('message', (dta) => {
            const message = JSON.parse(dta);            
            switch (message.type) {
                case 'initialize':
                    const nes = new Nes({
                        game: message.game,
                        id: message.id,
                        ws
                    });
                    connections.set(id, { nes, ws })
                    break;
                case 'controller':
                    commands(message);
                    break;
            };
        });

        ws.on('close', () => {
            const instance = connections.get(id);
            console.log('disconnected');
            

            if (instance) {
                instance.nes.remove(id);
                connections.delete(id)
            }
        });
    });

    const commands = (message) => {
        const instance = connections.get(message.id);

        if (instance)
            instance.nes.commands({
                id: message.id,
                action: message.action,
                key: message.key
            });
    };

    return { server };
};