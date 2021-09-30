module.exports = {
    'up': async function (connection, cb) {
        try {
            await connection.promise().query("CREATE TABLE `apikeys` ("
                + " `apiKey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `scope` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'authOnly',"
                + " `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `createdAt` int NOT NULL,"
                + " `updatedAt` int DEFAULT NULL,"
                + " `deletedAt` int DEFAULT NULL,"
                + " PRIMARY KEY (`apiKey`),"
                + " KEY `apikeys_name_index` (`name`),"
                + " KEY `apikeys_scope_index` (`scope`),"
                + " KEY `apikeys_createdat_index` (`createdAt`),"
                + " KEY `apikeys_updatedat_index` (`updatedAt`),"
                + " KEY `apikeys_createdby_index` (`createdBy`)"
                + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
            );

            await connection.promise().query(
                "INSERT INTO `apikeys` VALUES ('5cba85b5e919387c2f33e85f05dd7a68ead9bcd9','Rest API Key','fullAccess','app_system',1629373583,1629373583,NULL),('7077ee7bbe984cfa03f4d45274c70ca074e1645e','Auth Key','authOnly','app_system',1629373583,1629373583,NULL),('76e8ce14ebf31c2024dd40558207d71459423808','DA_192292e8424f8d89_1656','dashboardAccess','app_system',1629373583,1629373583,NULL);"
            );
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    },
    'down': "DROP TABLE `apikeys`;"
}