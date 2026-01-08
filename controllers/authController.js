const { validationResult } = require('express-validator');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return next(new ErrorResponse('Aquest email ja està registrat', 400));

  const user = await User.create({ name, email, password });
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'Usuari registrat correctament',
    data: { token, user }
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Credencials incorrectes', 401));
  }

  const token = generateToken(user);
  res.json({ success: true, message: 'Sessió iniciada correctament', data: { token, user } });
};

exports.getMe = (req, res) => {
  res.json({ success: true, data: req.user });
};

exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;

  if (email) {
    const exists = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (exists) return next(new ErrorResponse('Email ja en ús', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true }
  );

  res.json({ success: true, data: user });
};

exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Contrasenya actual incorrecta', 400));
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Contrasenya actualitzada correctament' });
};
