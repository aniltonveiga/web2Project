var userModel = require("../model/User");
var jwt = require("jsonwebtoken");
var secret = "deep coxinha carpado";

exports.create_user = function(req, res) {
  //res.write(req.body.user);
  let user = req.body.user,
    email = req.body.mail,
    pass = req.body.pass;
  let instanceUser = new userModel({ user: user, mail: email, pass: pass });
  /*
    instanceUser.create(function(err){
        if(err){
            var erros = '[', i = 0; 
            for(let ind in err.errors){
                if(i>0)
                    erros +=', ';
                erros += JSON.stringify(err.errors[ind]);
                i++;
            }
            erros += ']';
            res.send(erros);
            return console.log(req.body.user);
        }
        res.send('['+JSON.stringify({message: "Cadastrado com sucesso."})+']');
    });
    */
  userModel.create({ user: user, mail: email, pass: pass }, function(err) {
    if (err) {
      var erros = "[",
        i = 0;
      for (let ind in err.errors) {
        if (i > 0) erros += ", ";
        erros += JSON.stringify(err.errors[ind]);
        i++;
      }
      if (err.code === 11000) {
        if (i > 0) erros += ", ";
        erros += JSON.stringify({ message: "Usuário ou email já cadastrado" });
      }
      erros += "]";
      res.send(erros);
      return console.log(err);
    }
    res.send(
      "[" + JSON.stringify({ message: "Cadastrado com sucesso." }) + "]"
    );
  });
};

exports.show_friends = function(req, res) {
  //if (req.session && req.session.key) {
  let user = req.body.user;
  userModel.findOne({ user: user }, function(err, doc) {
    if (err || doc === null) {
      return res.send(
        "[" + JSON.stringify({ message: "Erro no banco de dados" }) + "]"
      );
    }

    amigos({ _id: { $in: doc.friends } }).then(function(listaAmigos) {
      //res.render('friends', {title: "Amigos", logado: req.session.key, amigos: listaAmigos});
      res.send(JSON.stringify(listaAmigos));
    });
  });
  // }
  //  else{
  // res.redirect('/');
  ///  }
};

const amigos = async function(params) {
  try {
    return await userModel.find(params).select({ user: 1 });
  } catch (err) {
    console.log(err);
  }
};

exports.login = function(req, res) {
  let user = req.body.user,
    pass = req.body.pass;

  if (user.length === 0 || pass.length === 0) {
    return res.send('[{"message": "Nenhum campo pode estar vazio"}]');
  }
  userModel.findOne({ user: user }, function(err, doc) {
    if (err || doc === null) {
      return res.send(
        "[" + JSON.stringify({ message: "Dados incorretos" }) + "]"
      );
    }
    if (doc.pass === pass) {
      //req.session.key = user;
      //res.send('['+JSON.stringify({message: "Sucesso"})+']')
      const payload = { user };
      const token = jwt.sign(payload, secret, {
        expiresIn: "1h"
      });

      res.cookie("token", token, { httpOnly: true }).sendStatus(200);
      console.log(token);
    } else {
      return res.send(
        "[" + JSON.stringify({ message: "Dados incorretos" }) + "]"
      );
    }
  });
};

exports.sair = function(req, res) {
  res.clearCookie("token");
  res.redirect("/");
};

exports.buscar = function(req, res) {
  let search = req.query.q,
    user = req.query.user;

  userModel
    .find(
      {
        user: {
          $not: { $regex: user },
          $regex: ".*" + search + ".*",
          $options: "i"
        }
      },
      function(err, doc) {
        if (err) console.log(err);

        if (doc == undefined) {
          return res.json({ message: "Nada encontrado" });
        }
        console.log(doc);
        res.send(doc);
      }
    )
    .limit(10);
};

/*
        docs = doc.map((item, key) => {
            if(item.user !== user){
                let obj = JSON.parse(JSON.stringify(item));
                obj.friend = null;
                return obj;
            }
            
            //console.log('else '+item.user);
            
            return userlogado = item;  
        });
 
        docs.forEach(function(item){
            
            if(userLogado.friends !== undefined && userlogado.friends.includes(item._id)){
                item.friend = true;
            }
            else{
                item.friend = false;
            }
           // console.log('teste'+item)
        });
        //console.log(docs);
        res.send(docs);
        

    }).limit(10).select({"user": 1, "friends": 1});
};*/

// Recebo id do usuário para adicionar
exports.addUser = function(req, res) {
  let id = req.body.id,
    user = req.body.user;
  // if (req.session && req.session.key && id != undefined) {

  userModel.findOne({ user: user }, function(err, doc) {
    if (err || doc === null) {
      return res.send(
        JSON.stringify({ message: "Erro no banco de dados" }) + "]"
      );
    }

    doc.friends.push({ _id: id });

    userModel.findById({ _id: id }, (insideErr, insideDoc) => {
      if (insideErr || insideDoc === null) {
        return res.send(
          JSON.stringify({ message: "Erro no banco de dados" }) + "]"
        );
      }
      insideDoc.friends.push({ _id: doc.id });

      insideDoc.save();
    });

    doc.save(function() {
      res.send(JSON.stringify({ message: "Amigo adicionado com sucesso" }));
    });
  });

  /* }
    else{
        res.redirect('/');
    }*/
};
