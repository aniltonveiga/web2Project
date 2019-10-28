var express = require("express");
var router = express.Router();
var Message = require("../model/Message");
var User = require("../model/User");
var fs = require("fs");

exports.create_message = function(req, res) {
  let sender = req.session.key,
    recipient = req.query.id,
    msg = req.body.msg,
    video = req.file;

  if (req.session && req.session.key) {
    //video handling

    User.findOne({ user: sender }, function(err, doc) {
      if (err || doc === null) {
        return res.send(
          "[" + JSON.stringify({ message: "Database error." }) + "]"
        );
      }

      if (video) {
        return console.log(video.path);
        var tmp_path = req.file.path;

        /** The original name of the uploaded file
      stored in the variable "originalname". **/
        var target_path = "uploads/" + req.file.originalname;

        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", function() {
          res.render("complete");
        });
        src.on("error", function(err) {
          res.render("error");
        });
      }

      if (msg.length > 0) {
        Message.create(
          { message: msg, sender: doc.id, recipient: recipient, video: dest },
          function(err, doc) {
            if (err) console.log(err);
          }
        );
      }
      res.redirect("/chat?id=" + recipient);
    });
  } else {
    res.redirect("/");
  }
};

exports.get_all_messages = function(req, res) {
  var sender = req.session.key,
    idRecipient = req.query.id;
  if (idRecipient == null) {
    return res.send("Oops!");
  }
  User.findOne({ user: sender }, function(err, doc) {
    Message.find(
      {
        $and: [
          { sender: { $in: [doc.id, idRecipient] } },
          { recipient: { $in: [doc.id, idRecipient] } }
        ]
      },
      function(err, docs) {
        res.render("chat", {
          title: "Página de mensagens",
          idGet: idRecipient,
          msgs: docs,
          layout: "chatContainer"
        });
      }
    );
  });
};
