const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db
            .collection("users")
            .insertOne(this)
            .then((result) => console.log("User added!!!"))
            .catch((err) => console.log("Error in adding user:", err));
    }

    static findUserById(id) {
        const db = getDb();
        return db
            .collection("users")
            .findOne({ _id: new ObjectId(id) })
            .next()
            .then((result) => result)
            .catch((err) => console.log("Error in finding user:", err));
    }
}

module.exports = User;
