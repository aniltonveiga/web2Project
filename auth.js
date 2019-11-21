let jwt = require("jsonwebtoken");
var secret = "deep coxinha carpado";

module.exports.withAuth = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdGUiLCJpYXQiOjE1NzQzMTEzNjIsImV4cCI6MTU3NDMxNDk2Mn0.40nFeLfJoYlzgtqoc9K023uusNS8UciA8D5eYpzTWpo";

  if (!token) {
    res.status(401);
    res.send("Não autorizado: Sem token");
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send("Não autorizado: Token inválido");
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
};
