const pool = require("../config/database-config");
const HttpError = require("../models/http-error");
const { isSafeFromSQLInjection } = require("../validation");

const getAvailableTablesController = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const query = `
        SELECT table_name                                            
        FROM information_schema.tables
        WHERE table_schema = current_schema()
        `;
        const result = await client.query(query);
        const tables = result.rows.map(row => row.table_name);
        res.json({ tables });
    } catch (error) {
        return next(new HttpError('Failed to retrieve data!', 500));
    } finally {
        client.release()
    }
}

const getTableDescriptionController = async (req, res, next) => {
    const client = await pool.connect();
    const tableName = req.params.table_name;
    if (!isSafeFromSQLInjection([tableName])) {
        throw new HttpError('Invalid Inputs passed', 422)
    }
    const query = `
    SELECT 
      column_name, 
      data_type, 
      (
        SELECT jsonb_agg(jsonb_build_object(
          'referenced_table_name', confrelid::regclass::text,
          'referenced_column_name', b.attname
        ))
        FROM pg_constraint c
        JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
        JOIN pg_attribute b ON b.attnum = ANY(c.confkey) AND b.attrelid = c.confrelid
        WHERE conrelid = $2::regclass
          AND columns.column_name = a.attname
      ) AS foreign_keys
    FROM information_schema.columns columns
    WHERE table_name = $1`;
    try {
        const result = await client.query(query, [tableName, 'public.' + tableName]);
        result.rows.forEach((row) => {
            if (row.data_type === 'character varying') {
                row.data_type = 'varchar';
            } else if (row.data_type === 'double precision') {
                row.data_type = 'float';
            }
        });
        res.json({ name: tableName, description: result.rows })
    } catch (error) {
        return next(new HttpError(error.message || 'Error executing query:', 500));
    } finally {
        client.release()
    }
}

const getColumnsController = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const tableName = req.params.table_name;
        if (!isSafeFromSQLInjection([tableName])) {
            throw new HttpError('Invalid Inputs passed', 422)
        }
        const query = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2`;

        const result = await client.query(query, ['public', tableName]);
        const rows = result.rows;

        rows.forEach((row) => {
            if (row.data_type === 'character varying') {
                row.data_type = 'varchar';
            } else if (row.data_type === 'double precision') {
                row.data_type = 'float';
            }
        });

        res.status(200).json(rows);
    } catch (error) {
        return next(new HttpError(`Failed to retrieve columns for table ${tableName}, Please try again later`, 500));
    } finally {
        client.release()
    }
}

exports.getAvailableTablesController = getAvailableTablesController
exports.getTableDescriptionController = getTableDescriptionController
exports.getColumnsController = getColumnsController