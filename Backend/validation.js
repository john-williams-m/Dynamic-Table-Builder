const { check } = require('express-validator');

const createTableValidation = [
    check('table_name')
        .notEmpty().withMessage('Table name is required.')
        .isLength({ max: 64 }).withMessage('Table name must be less than 64 characters.')
        .custom((value) => {
            if (value.split(/\s+/).length > 1) {
                throw new Error('Table name must be a single word.');
            }
            return true;
        }),
    check('columns')
        .isArray().withMessage('Columns must be an array.')
        .notEmpty().withMessage('At least one column is required.'),

    check('columns.*.column_name')
        .notEmpty().withMessage('Column name is required.')
        .isLength({ max: 64 }).withMessage('Column name must be less than 64 characters.'),

    check('columns.*.data_type')
        .isString().withMessage('Data type must be a string.')
        .isIn(['VARCHAR', 'INTEGER', 'FLOAT', 'BOOLEAN', 'DATE', 'varchar', 'integer', 'float', 'boolean', 'date'])
        .withMessage('Data type must be one of: VARCHAR, INTEGER, FLOAT, BOOLEAN, DATE'),

    check('columns.*.foreign_keys')
        .optional()
        .isArray().notEmpty().withMessage('For primary key columns, a non-empty foreign_keys array is required.'),

    check('columns.*.foreign_keys.*.referenced_table_name')
        .isString().withMessage('Referenced table name must be a string.'),

    check('columns.*.foreign_keys.*.referenced_column_name')
        .isString().withMessage('Referenced column name must be a string.'),
]

const addColumnValidation = [
    check('column_name').notEmpty().withMessage('Column name is required').custom((value) => {
        if (value.split(/\s+/).length > 1) {
            throw new Error('Column name must be a single word.');
        }
        return true;
    }),
    check('data_type').notEmpty().withMessage('Data type is required'),

    check('data_type').isIn(['integer', 'varchar', 'date', 'boolean', 'float']).withMessage('Invalid data type'),

    check('foreign_keys').optional().isArray().withMessage('Foreign keys must be an array'),
    check('foreign_keys.*.referenced_table_name').optional().isString().withMessage('Referenced table name must be a string'),
    check('foreign_keys.*.referenced_column_name').optional().isString().withMessage('Referenced column name must be a string'),
]

function isSafeFromSQLInjection(inputs) {
    const sqlInjectionPattern = /(\b(?:SELECT|UPDATE|DELETE|INSERT|FROM|WHERE|DROP|CREATE|ALTER|JOIN)\b)|[-;:'"()#]/i;

    for (let i = 0; i < inputs.length; i++) {
        if (sqlInjectionPattern.test(inputs[i])) {
            return false;
        }
    }
    return true;
}

module.exports = { createTableValidation, addColumnValidation, isSafeFromSQLInjection };
