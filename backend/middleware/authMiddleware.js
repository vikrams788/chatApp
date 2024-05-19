const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    req.user = {
      userId: decodedToken.userId,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.log("JWT Error: ", error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;