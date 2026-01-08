const router = require('express').Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const adminCtrl = require('../controllers/adminController');

router.use(auth, roleCheck(['admin']));

router.get('/users', adminCtrl.getAllUsers);
router.get('/tasks', adminCtrl.getAllTasks);
router.delete('/users/:id', adminCtrl.deleteUser);
router.put('/users/:id/role', adminCtrl.changeUserRole);

module.exports = router;
