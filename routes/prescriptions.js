const prescriptions = require('../controllers/prescriptions');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/',  auth, prescriptions.create);
router.get('/',  auth, prescriptions.index);
router.get('/:id',  auth, prescriptions.show);
router.put('/:id', auth, prescriptions.update);
router.delete('/:id',  auth, prescriptions.remove);

module.exports = router;