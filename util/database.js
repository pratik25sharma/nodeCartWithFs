const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = cb => {
    MongoClient.connect("mongodb://127.0.0.1:27017/shop", {
        useUnifiedTopology: true
    })
        .then(client => {
            db = client.db('shop');
            cb();
        })
        .catch(e => {
            console.log(e);
            throw e;
        });
};

const getDb = () => {
    if(db){
        return db;
    }
    throw 'No database to connect';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
