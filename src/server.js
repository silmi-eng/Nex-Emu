require("dotenv").config();
const os = require("os");
const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
const { server, app } = require("../src/app");

const ServerIP = () => {
  const interfaces = os.networkInterfaces();

  for (const dev in interfaces) {
    const face = interfaces[dev];

    for (var i = 0; i < face.length; i++) {
      const alias = face[i];

      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }

  return "127.0.0.1";
};

server.listen(process.env.PORT || 3000, () => {
  const date = new Date();
  const serverIP = ServerIP();

  console.log(
    `[${date.toLocaleTimeString(
      "pt-PT",
      options
    )}] [Server] External: http://${serverIP}:${process.env.PORT || 3000} `
  );
});
