const MongoClient = require("mongodb").MongoClient;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
const prodURI = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
const stgURI = `${process.env.BKP_ACCESS_SECRET_MONGODB}`;
const dbName = "userInfo";
const collections = ["master"];
async function backupData(backupType) {
    try {
        const prodClient = await MongoClient.connect(prodURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const stgClient = await MongoClient.connect(stgURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const prodDB = prodClient.db(dbName);
        const stgDB = stgClient.db(dbName);
        // Apagar coleções existentes no banco de dados de teste de acordo com o tipo de backup
        for (const collection of collections) {
            await stgDB
                .collection(`backup_${backupType}_${collection}`)
                .deleteMany({});
        }
        // Obter os dados do banco de dados de produção
        const dataToCopy = {};
        for (const collection of collections) {
            dataToCopy[collection] = await prodDB
                .collection(collection)
                .find({})
                .toArray();
        }
        // Inserir os dados no banco de dados de teste
        for (const collection of collections) {
            await stgDB
                .collection(`backup_${backupType}_${collection}`)
                .insertMany(dataToCopy[collection]);
        }
        console.log(`Backup ${backupType} concluído com sucesso.`);
        prodClient.close();
        stgClient.close();
    }
    catch (error) {
        console.error("Ocorreu um erro durante o backup:", error);
    }
}
// Executar o backup diariamente
backupData("daily");
// Executar o backup semanalmente às segundas-feiras
const currentDate = new Date();
const currentDayOfWeek = currentDate.getDay();
if (currentDayOfWeek === 0) {
    backupData("weekly");
}
// Executar o backup mensalmente no dia 20
const currentDayOfMonth = currentDate.getDate();
if (currentDayOfMonth === 21) {
    backupData("monthly");
}
