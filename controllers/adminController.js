const User = require('../models/User');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, count: users.length, data: users });
};

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('user', 'name email');
  res.json({ success: true, count: tasks.length, data: tasks });
};

exports.deleteUser = async (req, res, next) => {
  if (req.user._id.toString() === req.params.id)
    return next(new ErrorResponse('No pots eliminar-te a tu mateix', 400));

  await Task.deleteMany({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Usuari eliminat' });
};

exports.changeUserRole = async (req, res, next) => {
  if (req.user._id.toString() === req.params.id)
    return next(new ErrorResponse('No pots canviar el teu propi rol', 400));

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );

  res.json({ success: true, data: user });
};
