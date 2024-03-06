const { validationResult } = require("express-validator");
const pool = require("../config/database-config");
const HttpError = require("../models/http-error");
const { isSafeFromSQLInjection } = require("../validation");

const createTableController = async (req, res, next) => {
    const client = await pool.connect();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data = req.body;

    if (!isSafeFromSQLInjection([data.table_name])) {
        throw new HttpError('Invalid Inputs passed', 422)
    }
    if (data.columns?.length > 0) {
        let columnValues = []
        data.columns?.map(col => {
            columnValues.push(col.data_type)
            columnValues.push(col.column_name)
            if (col.foreign_keys[0]?.referenced_table_name && col.foreign_keys[0]?.referenced_column_name) {
                columnValues.push(col.foreign_keys[0].referenced_table_name, col.foreign_keys[0].referenced_column_name)
            }
        })
        if (!isSafeFromSQLInjection([...columnValues])) {
            throw new HttpError('Invalid Inputs passed', 422)
        }
    }

    if (!data || !data.table_name || !data.columns) {
        return res.status(400).send('Missing required data');
    }

    const tableName = data.table_name.toLowerCase();
    const columns = data.columns;

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

        if (tableExists.rows[0].exists) {
            return next(new HttpError(`Table '${data.table_name}' already exists`, 422))
        }
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Internal server error.' });
    }

    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    columns.forEach((column, index) => {
        const dataType = column.data_type;
        const foreignKeys = column.foreign_keys;

        let columnDefinition = `${column.column_name} ${dataType}`;

        if (dataType === 'VARCHAR' || dataType === 'varchar') {
            columnDefinition += `(50)`;
        }

        if (foreignKeys) {
            foreignKeys.forEach(foreignKey => {
                columnDefinition += ` REFERENCES ${foreignKey.referenced_table_name}(${foreignKey.referenced_column_name})`;
            });
        }

        sql += `${columnDefinition}`;

        if (index !== columns.length - 1) {
            sql += ', ';
        }
    });

    sql += ');';
    try {
        await client.query(sql);
        res.status(200).json({ message: 'Table created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error creating table' });
    } finally {
        client.release()
    }
}

const addColumnController = async (req, res) => {
    const client = await pool.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await client.query('BEGIN TRANSACTION');
        const { table_name } = req.params;
        const { column_name, data_type, foreign_keys = [] } = req.body;

        if (!isSafeFromSQLInjection([table_name, column_name, data_type])) {
            throw new HttpError('Invalid input passed', 422)
        }
        if (foreign_keys[0]?.referenced_table_name && foreign_keys[0]?.referenced_column_name) {
            if (!isSafeFromSQLInjection([foreign_keys[0].referenced_table_name, foreign_keys[0].referenced_column_name])) {
                throw new HttpError('Invalid input passed', 422)
            }
        }

        let query = `ALTER TABLE ${table_name} ADD COLUMN ${column_name} ${data_type}`;
        await client.query(query);
        query = ''

        if (foreign_keys.length > 0) {
            const referencedTableName = foreign_keys[0].referenced_table_name;
            const referencedColumnName = foreign_keys[0].referenced_column_name;

            const uniqueConstraintExists = await client.query(
                `SELECT 1 FROM pg_constraint
                     WHERE conrelid = 'public.${referencedTableName}'::regclass
                     AND contype = 'u'
                     AND conname = '${referencedColumnName}_unique'`
            );

            if (!uniqueConstraintExists.rows.length) {
                await client.query(
                    `ALTER TABLE ${referencedTableName}
                         ADD CONSTRAINT ${referencedColumnName}_unique UNIQUE (${referencedColumnName})`
                );
            }

            const constraintName = `fk_${table_name}_${column_name}`;
            query = `
                ALTER TABLE ${table_name}
                ADD CONSTRAINT ${constraintName} FOREIGN KEY (${column_name})
                REFERENCES ${referencedTableName} (${referencedColumnName})`;

            await client.query(query);
        }

        await client.query('COMMIT TRANSACTION');
        res.status(200).json({ message: 'Column added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to add column' });
    } finally {
        client.release()
    }
}

exports.createTableController = createTableController
exports.addColumnController = addColumnController