const router = require('express').Router();

const { FileManager } = require("../controllers/file.controller");
const fileManager = new FileManager();

router.get("/games", (req, res, next) => {
    const { nes } = req.query;
    const filter = {
      nes: nes === "true",
    };

    fileManager.read(filter).then((documents) => {
        res.status(200).json(documents);
    });
});

module.exports = router;