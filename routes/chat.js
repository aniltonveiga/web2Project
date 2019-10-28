var express = require('express');
var router = express.Router();
var ChatController = require('../controller/ChatController')

router.get('/', ChatController.get_all_messages);
router.post('/', ChatController.create_message);

module.exports = router;
