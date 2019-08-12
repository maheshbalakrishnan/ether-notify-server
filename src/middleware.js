let jwt = require("jsonwebtoken");

let checkToken = (req, res, secretToken, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if(!token || token === '') {
    return res.json({
        success: false,
        message: "Auth token is not supplied"
      });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, secretToken, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied"
    });
  }
};

module.exports = {
  checkToken: checkToken
};
