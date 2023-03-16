const jwt = require('jsonwebtoken');
const secretPhrase = "fifapp";

const basicAuth = (function (req, res, next) {
  if (req.headers["authorization"]) {
    const authBase64 = req.headers['authorization'].split(' ');
    const userPass = base64decode(authBase64[1]);
    const user = userPass.split(':')[0];
    const password = userPass.split(':')[1];

    if (user === 'admin' && password == '1234') {
      next();
      return;
    }
  }
  res.status(401);
  res.send({
    error: "Unauthorized"
  });
});

const JWTsetTokenAuth = (req, res, next) => {
  if (!req.body) {
    res.status(404).send({ err: "Username and password not provided." })
  }
  if (!(req.body.user === "admin" && req.body.password === "admin")) {
    res.status(404).send({ err: "Username and password incorrect." })
  }
  const newToken = jwt.sign({
    "user": req.body.user
  }, secretPhrase, { expiresIn: "1h" });
  res.status(201).send({ token: newToken })
};

const JWTgetToken = (token) => {
  if (token) {
    try {
      const jsonToken = jwt.verify(token, secretPhrase);
      return jsonToken;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }
  else {
    return null;
  }
};

function tokenVerification(req, res, next) {
  if (req.headers["authorization"]) {
      const token = req.headers['authorization'].split(' ')[1];
      try {
          //validate token
          const session = JWTgetToken(token);
          if (session) {
              res.locals.session = session;
              next();
              return;
          }
          else {
              res.status(422).json({Message: "Token invalid or expired."})

          }
      } catch (e) {
          res.status(422);
          res.send({error: "There was an error: " + e.message});
      }
  } else {
      res.status(401);
      res.send({error: "Unauthorized "});
  }
}

module.exports = {
  basicAuth,
  JWTsetTokenAuth,
  tokenVerification
}