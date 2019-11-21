var express = require('express');
var router = express.Router();
var ChatController = require('../controller/ChatController')
//var auth = require('..')

/* GET home page. */

router.get('/messages', ChatController.get_all_messages);
router.post('/message', ChatController.create_message);

module.exports = router;
