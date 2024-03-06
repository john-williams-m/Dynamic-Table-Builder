const express = require('express')
const { tableRenameController, columnRenameController } = require('../controller/rename-controller')

const renameRouter = express.Router()

//Rename table
renameRouter.patch('/:table_id', tableRenameController)

//Rename column
renameRouter.patch('/:table_id/columns/:column_id', columnRenameController)

module.exports = renameRouter