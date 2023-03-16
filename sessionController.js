const basicAuth=(function (req, res, next) {
    if (req.headers["authorization"]) {
      const authBase64 = req.headers['authorization'].split(' ');
      console.log('authBase64:', authBase64);
      const userPass = base64decode(authBase64[1]);
      console.log('userPass:', userPass);
      const user = userPass.split(':')[0];
      const password = userPass.split(':')[1];
  
      if (user === 'admin' && password == '1234') {
        // saveSession('admin');
        next();
        return;
      }
    }
    res.status(401);
    res.send({
      error: "Unauthorized"
    });
  });

  module.exports = {
    basicAuth
  }