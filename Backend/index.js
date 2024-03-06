if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const getRouter = require('./routes/get-routes');
const createRouter = require('./routes/create-routes');
const renameRouter = require('./routes/rename-routes');
const deleteRouter = require('./routes/delete-routes');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/tables', getRouter)
app.use('/api/tables', createRouter)
app.use('/api/tables', renameRouter)
app.use('/api/tables', deleteRouter)

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});