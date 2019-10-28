var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

var ChatController = require("../controller/ChatController");

router.get("/", ChatController.get_all_messages);
router.post("/", upload.single("video"), ChatController.create_message);

module.exports = router;
