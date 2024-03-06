const { escapeIdentifier } = require('pg');
const pool = require('../config/database-config');
const { isSafeFromSQLInjection } = require('../validation');
const HttpError = require('../models/http-error');


const tableRenameController = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { new_name } = req.body;
        const tableId = req.params.table_id;
        if (!isSafeFromSQLInjection([new_name, tableId])) {
            throw new HttpError('Invalid Inputs passed', 422)
        }
        if (!new_name || new_name.trim().length === 0) {
            throw new HttpError('New table name is required', 400);
        }

        const checkNameQuery = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`;
        const nameExists = await client.query(checkNameQuery, [new_name]);

        if (nameExists.rows[0].exists) {
            throw new Error('Table with that name already exists');
        }

        const renameQuery = `ALTER TABLE ${tableId} RENAME TO ${new_name}`;
        await client.query(renameQuery);

        res.json({ message: 'Table renamed successfully', new_name });
    } catch (error) {
        res.status(500).json({ message: 'Error renaming table', error: error.message });
    } finally {
        client.release()
    }
}

const columnRenameController = async (req, res) => {
    const client = await pool.connect();
    try {
        const { newName } = req.body;
        const { table_id, column_id } = req.params;
        if (!isSafeFromSQLInjection([newName, table_id, column_id])) {
            throw new HttpError('Invalid Inputs passed', 422)
        }
        const sanitizedNewName = escapeIdentifier(newName.trim());
        await client.query(
            `ALTER TABLE ${table_id} RENAME COLUMN ${column_id} TO ${sanitizedNewName}`
        );
        res.status(200).json({ message: 'Column name updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating column name' });
    } finally {
        client.release();
    }
}

exports.tableRenameController = tableRenameController
exports.columnRenameController = columnRenameController