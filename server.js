require('dotenv').config();

const express = require('express');
const cors = require('cors');
const database = require('./middlewares/dbConnection');
const migration = require('./middlewares/migrationExec');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(database.openConnection);
app.use(migration.execute);

app.use((req, res, next) => {
    try {
        const url = req.url;
        const routePath = url.split("?").shift();
        require('./routes/' + routePath.split('/')[1] + '/' + routePath.split('/')[2] + '.route')(app);
        next();
    } catch (error) {
        res.status(404).send('Request URL not found');
    }
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.listen(process.env.PORT || 4000);