const jwt = require('jsonwebtoken');

function JWTAuth(handler) {
  return async (req, res) => {
    const token = req.headers['access'];
    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        res.json({message: 'Token Expired'})
      }
      req.user = decoded;
      return handler(req, res);
    })

  }
}

export default JWTAuth;