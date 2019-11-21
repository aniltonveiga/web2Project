var express = require('express');
var router = express.Router();
var Message = require('../model/Message');
var User = require('../model/User');

exports.create_message = function(req, res) {

    let sender = req.body.sender, recipient = req.body.recipient, msg = req.body.msg;
    //console.log('Post: '+ recipient);
    //console.log('Msg: '+ msg);

   // if (req.session && req.session.key) {
        User.findOne({"user": sender}, function(err,doc){
            if(err || doc === null){
                return res.send('['+JSON.stringify({message: "Erro no banco de dados"})+']');
            }
            if(msg.length > 0){
                Message.create({message: msg, sender: doc.id, recipient: recipient }, function(err, doc){
                    if(err) console.log(err);
                    res.send(doc);
                });
            }
            //res.redirect('/chat?id='+recipient);
        });
    /*}
    else{
        res.redirect('/');
    }*/
};

exports.get_all_messages = function(req, res){
    let sender = req.query.sender, idRecipient = req.query.recipient;
    
    console.log('Debug: '+ sender + ' ' + idRecipient);
    
    if(idRecipient == null){
        //return res.send('Oops!');
        let msgs = { 
            message: 'Oops'
        };
        return res.send(JSON.stringify(msgs));
       
    }
    console.log(sender + ' ' + idRecipient );
    User.findOne({user: sender}, function(err, doc){
        
        if(err || doc === null){
            let msgs = {
                message: 'usuario não encontrado'
            };
            return res.send(JSON.stringify(msgs));
        }

        Message.find({$and:[{sender: { "$in" : [doc.id, idRecipient]}},
        {recipient: { "$in" : [doc.id, idRecipient]}}]}, function(err, docs){
            //res.render('chat', { title: 'Página de mensagens', idGet: idRecipient, msgs: docs, layout: 'chat' } );
            res.send(JSON.stringify(docs));
        });
    });
 };

