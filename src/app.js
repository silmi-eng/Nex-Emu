require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(require("body-parser").json());
app.use(express.urlencoded({ extended: true }));
app.use(
  require("cors")({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/", require("./router/pages.route"));
app.use("/files", require("./router/file.route"));
app.get("/", (req, res) => res.status(200).redirect("/dashboard"))
const { server } = require("./sockets/emulator.connection")(app);

require("./controllers/error.controller")(app);

module.exports = { app, server };