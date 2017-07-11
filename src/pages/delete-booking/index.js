'use strict';

const express = require('express');
const {get, post} = require('./functions');

const router = new express.Router();

router.get('/:id', get);
router.post('/:id', post);

module.exports = router;
