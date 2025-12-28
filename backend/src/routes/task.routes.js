
const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/task.controller');

router.get('/', auth(['Admin', 'Manager', 'Developer']), ctrl.getTasks);
router.post('/', auth(['Admin', 'Manager']), ctrl.createTask);
router.put('/:id', auth(['Admin', 'Manager', 'Developer']), ctrl.updateTask);

module.exports = router;
