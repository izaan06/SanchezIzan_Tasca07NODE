const ErrorResponse = require('../utils/errorResponse');

module.exports = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse('No tens permisos per accedir a aquest recurs', 403)
      );
    }
    next();
  };
};
