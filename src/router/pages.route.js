const router = require("express").Router();

const { FileManager } = require("../controllers/file.controller");
const fileManager = new FileManager();

router.get("/dashboard", async (req, res, next) => {
  const { snes, nes } = req.query;
  const filter = {
    nes: nes === "true",
  };

  fileManager.read(filter).then((documents) => {
    res.status(200).render("dashboard", { documents });
  });
});

router.get("/:game/:console/play", (req, res, next) => {
  res.status(200).render("game", {
    game: req.params.game,
    console: req.params.console
  });
});

module.exports = router;
