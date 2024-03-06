const express = require('express');
const { checkTableExists } = require('../middleware/checkTableExists');
const { deleteTableController, deleteColumnController } = require('../controller/delete-controller');

const deleteRouter = express.Router()

//Delete table
deleteRouter.delete('/:table_name', checkTableExists, deleteTableController);

//Delete column
deleteRouter.delete('/:table_name/columns/:column_name', checkTableExists, deleteColumnController);

module.exports = deleteRouter