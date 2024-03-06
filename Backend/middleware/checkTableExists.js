const pool = require('../config/database-config');
const HttpError = require('../models/http-error');
const { isSafeFromSQLInjection } = require('../validation');

const checkTableExists = async (req, res, next) => {
    const client = await pool.connect();
    const tableName = req.params.table_name;
    if (!isSafeFromSQLInjection([tableName])) {
        throw new HttpError('Invalid Inputs passed', 422)
    }
    try {
        const tableExists = await client.query(
            `SELECT EXISTS (
              SELECT 1
              FROM information_schema.tables
              WHERE table_schema = current_schema()
                AND table_name = $1
            )`,
            [tableName]
        );
        if (!tableExists.rows[0].exists) {
            return next(new HttpError(`Table '${tableName}' does not exist.`, 400));
        }
        next();
    } catch (error) {
        return next(new HttpError(error.message || 'Internal server error', 500))
    } finally {
        client.release()
    }
}

exports.checkTableExists = checkTableExists