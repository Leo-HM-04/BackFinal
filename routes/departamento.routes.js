const express = require('express');
const router = express.Router();
const { getDepartamentos } = require('../controllers/departamento.controller');

router.get('/', getDepartamentos);

module.exports = router;
