const router = require('express').Router();
const auth = require('../middleware/auth');
const taskCtrl = require('../controllers/taskController');

// 🔐 Totes les rutes requereixen autenticació
router.use(auth);

// ------------ CRUD BÀSIC --------------
router.post('/', taskCtrl.createTask);          // Crear tasca
router.get('/', taskCtrl.getAllTasks);          // Llistar totes les tasques
router.get('/:id', taskCtrl.getTaskById);       // Obtenir tasca per ID
router.put('/:id', taskCtrl.updateTask);        // Actualitzar tasca
router.delete('/:id', taskCtrl.deleteTask);     // Eliminar tasca

// ------------ IMATGES --------------
router.put('/:id/image', taskCtrl.updateTaskImage);                 // Actualitzar imatge de la tasca
router.put('/:id/image/reset', taskCtrl.resetTaskImageToDefault);   // Restablir imatge per defecte

// ------------ ESTADÍSTIQUES --------------
router.get('/stats/overview', taskCtrl.getTaskStats);              // Obtenir estadístiques de les tasques

module.exports = router;
