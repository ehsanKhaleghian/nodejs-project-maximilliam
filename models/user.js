const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection("users")
            .insertOne(this)
            .then((result) => console.log("User added!!!"))
            .catch((err) => console.log("Error in adding user:", err));
    }

    addToCart(product) {
        // const cartProduct=this.cart.items.findIndex(cp=>{
        //     return cp._id===product._id
        // });
        const updatedCart = { items: [{ ...product, quantity: 1 }] };
        const db = getDb();
        return db
            .collection("users")
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    static findUserById(id) {
        const db = getDb();
        //**It doesn't need .next()  because we used insertOne()*/
        return db.collection("users").findOne({ _id: new ObjectId(id) });
    }
}

module.exports = User;
