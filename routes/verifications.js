const verifications = require('../controllers/verifications');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/',  auth, verifications.create);
router.get('/',  auth, verifications.index);
router.get('/:id',  auth, verifications.show);
router.put('/:id', auth, verifications.update);
router.delete('/:id',  auth, verifications.remove);

module.exports = router;