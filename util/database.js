const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; //**Underscore shows this is only used internally */

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://ehsanScript:E55268199Yk@cluster0.ytldu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
        .then((client) => {
            console.log("CONNECTED!");
            //**It gives access to the data base, the name is myFirstDatabase and we can write the name of databasse if don't wanna connect to this*/
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
