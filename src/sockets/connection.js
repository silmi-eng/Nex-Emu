const WebSocket = require("ws");

class Connection {
  constructor({ server }) {
    this.wss = new WebSocket.Server({
      server,
      perMessageDeflate: false,
    });
  }
}

module.exports = { Connection };