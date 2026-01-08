const { body } = require('express-validator');

exports.registerValidation = [
  body('email').isEmail().withMessage('Email no vàlid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contrasenya ha de tenir mínim 6 caràcters'),
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('El nom ha de tenir mínim 2 caràcters')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Email no vàlid'),
  body('password').notEmpty().withMessage('La contrasenya és obligatòria')
];

exports.updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Email no vàlid'),
  body('name').optional().isLength({ min: 2 })
];

exports.changePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
];
