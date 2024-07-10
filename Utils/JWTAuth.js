const jwt = require('jsonwebtoken');

function JWTAuth(handler) {
  return async (req, res) => {
    try{
      const token = req.headers['token'];
      jwt.verify(token, process.env.JWT, (err, decoded) => {
        if (err) {
          res.status(401).json({message: 'Unauthorized'})
        }
        if(decoded.type && decoded.type !== 'Customer') {
          res.status(401).json({message: 'Unauthorized'})
          return;
        }
        req.user = decoded;
        return handler(req, res);
      })
    }
    catch(error) {
      res.status(401).json({ message: 'Unauthorized'})
    }

  }
}

export default JWTAuth;