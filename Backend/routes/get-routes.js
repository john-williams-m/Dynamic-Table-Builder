const express = require('express');
const { getAvailableTablesController, getTableDescriptionController, getColumnsController } = require('../controller/get-controller');
const { checkTableExists } = require('../middleware/checkTableExists');

const getRouter = express.Router()

//get available tables
getRouter.get('', getAvailableTablesController)

//get table description
getRouter.get('/:table_name', checkTableExists, getTableDescriptionController);

//get columns of a table
getRouter.get('/:table_name/columns', checkTableExists, getColumnsController);

module.exports = getRouter