const { exec } = require("child_process");

const migrationExecutor = function (req, res, next) {
    global.dbName = req.query.db;

    exec("node migration.js up", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    next();
}

module.exports = migrationExecutor;