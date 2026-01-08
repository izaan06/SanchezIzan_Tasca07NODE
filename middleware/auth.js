const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return next(new ErrorResponse('No autoritzat. Token no proporcionat', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ErrorResponse('Usuari no trobat', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ErrorResponse('Token invàlid o expirat', 401));
  }
};
