const users = require('../controllers/users');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/profile_pics-config');


router.get('/select', auth, users.selectItems);
router.post('/create', users.create);
router.post('/login', users.getUser);
router.post('/check', auth, users.checkDsUser);
//router.put('/edit-user', auth, multer, users.update);
//router.get('/init-user', auth, users.initUser);

module.exports = router;