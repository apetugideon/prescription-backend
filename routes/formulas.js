const formulas = require('../controllers/formulas');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/',  auth, formulas.create);
router.get('/',  auth, formulas.index);
router.get('/:id',  auth, formulas.show);
router.put('/:id', auth, formulas.update);
router.delete('/:id',  auth, formulas.remove);

module.exports = router;