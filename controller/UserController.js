var express = require("express");
var router = express.Router();
var userModel = require("../model/User");

exports.register = function(req, res) {
  let user = req.body.user,
    email = req.body.mail,
    pass = req.body.pass;

  if (user.length === 0 || email.length === 0 || pass.length === 0) {
    return res.render("register", {
      error: "Todos os campos devem ser preenchidos"
    });
  }

  //check if user exists
  userModel.findOne({ mail: email }, function(err, doc) {
    if (doc !== null) {
      return res.render("register", {
        error: "Usuário já cadastrado"
      });
    }
  });

  userModel.create({ user: user, mail: email, pass: pass }, function(err) {
    return res.render("cadastrar", {
      success: "Usuário cadastrado com sucesso"
    });
  });
};

exports.show_friends = function(req, res) {
  if (req.session && req.session.key) {
    userModel.findOne({ user: req.session.key }, function(err, doc) {
      if (err || doc === null) {
        return res.send(
          "[" + JSON.stringify({ message: "Database error." }) + "]"
        );
      }

      amigos({ _id: { $in: doc.friends } }).then(function(listaAmigos) {
        res.render("friends", {
          title: "Amigos",
          logado: req.session.key,
          amigos: listaAmigos
        });
      });
    });
  } else {
    res.redirect("/");
  }
};

const amigos = async function(params) {
  try {
    return await userModel.find(params);
  } catch (err) {
    console.log(err);
  }
};

exports.login = function(req, res) {
  let user = req.body.user,
    pass = req.body.pass;

  if (user.length === 0 || pass.length === 0) {
    return res.render("index", { error: "Os campos não podem ser vázios" });
  }

  userModel.findOne({ user: user }, function(err, doc) {
    if (err || doc === null) {
      return res.render("index", { error: "Usuário ou senha inválidos" });
    }
    if (doc.pass === pass) {
      req.session.key = user;
      return res.redirect("/users/amigos");
    } else {
      return res.render("index", { error: "Os campos não podem ser vázios" });
    }
  });
};

exports.sair = function(req, res) {
  req.session.destroy();
  return res.redirect("/");
};

exports.buscar = function(req, res) {
  let search = req.query.q;
  userModel
    .find(
      {
        user: {
          $not: { $regex: req.session.key },
          $regex: ".*" + search + ".*",
          $options: "i"
        }
      },
      function(err, doc) {
        if (err) console.log(err);

        if (doc == undefined) {
          return res.send('<p style="color:#fff;">Nothing Found</p>');
        }
        console.log(doc);
        res.render("search", { resultados: doc, layout: "search" });
      }
    )
    .limit(10);
};

// Recebo id do usuário para adicionar
exports.addUser = function(req, res) {
  let id = req.query.id;
  if (req.session && req.session.key) {
    userModel.findOne({ user: req.session.key }, function(err, doc) {
      if (err || doc === null) {
        return res.send(
          "[" + JSON.stringify({ message: "Database error." }) + "]"
        );
      }

      doc.friends.push({ _id: id });

      doc.save(function() {
        res.send('<p style="color:#fff;">Friend added</p>');
      });
    });
  } else {
    res.redirect("/");
  }
};
