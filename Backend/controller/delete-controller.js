const { escapeIdentifier } = require("pg");
const pool = require("../config/database-config");
const HttpError = require("../models/http-error");
const { isSafeFromSQLInjection } = require("../validation");

const deleteTableController = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const tableName = req.params.table_name;
        if (!isSafeFromSQLInjection([tableName])) {
            throw new HttpError('Invalid Inputs passed', 422)
        }

        await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);

        res.status(200).json({ message: `Table ${tableName} deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting table.' });
    } finally {
        client.release()
    }
}

const deleteColumnController = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { table_name, column_name } = req.params;
        if (!isSafeFromSQLInjection([table_name, column_name])) {
            throw new HttpError('Invalid Inputs passed', 422)
        }
        const sanitisedTableName = escapeIdentifier(table_name)
        const sanitisedColumnName = escapeIdentifier(column_name)

        const query = `ALTER TABLE ${sanitisedTableName} DROP COLUMN ${sanitisedColumnName}`;

        await client.query(query);

        res.status(200).json({ message: 'Column deleted successfully' });
    } catch (error) {
        return next(new HttpError('Failed to delete column', 500));
    } finally {
        client.release()
    }
}

exports.deleteTableController = deleteTableController
exports.deleteColumnController = deleteColumnController
