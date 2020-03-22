const placements = require('../controllers/placements');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/',  auth, placements.create);
router.get('/',  auth, placements.index);
router.get('/:id',  auth, placements.show);
router.put('/:id', auth, placements.update);
router.delete('/:id',  auth, placements.remove);

module.exports = router;