const jwt = require('jsonwebtoken');

function JWTAuth(handler) {
  return async (req, res) => {
    const token = req.headers['token'];
    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        res.json({message: 'Unauthorized'})
      }
      req.user = decoded;
      return handler(req, res);
    })

  }
}

export default JWTAuth;