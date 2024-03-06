const express = require('express');
const { createTableValidation, addColumnValidation } = require('../validation');
const { createTableController, addColumnController } = require('../controller/create-controller');
const { checkTableExists } = require('../middleware/checkTableExists');

const createRouter = express.Router()

//create tables
createRouter.post('', createTableValidation, createTableController);

// add column
createRouter.post('/:table_name/columns', addColumnValidation, checkTableExists, addColumnController);

module.exports = createRouter