const ailments = require('../controllers/ailments');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/',  auth, ailments.create);
router.get('/',  auth, ailments.index);
router.get('/:id',  auth, ailments.show);
router.put('/:id', auth, ailments.update);
router.delete('/:id',  auth, ailments.remove);

module.exports = router;