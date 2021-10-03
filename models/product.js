const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this.id) {
            //**For editing and updating one/many element/s inside database we use \/  */
            //** updateOne()/updateMany() */
            dbOp = db
                .collection("products")
                //**Determine the item by finding it by id and use "$set" to set the finded */
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            //**We can use this commend: insertOne({name:"jafar",age:32}) */
            //**We can insertMany or insertOne. */
            dbOp = db.collection("prodcuts").insertOne(this);
        }
        return dbOp
            .then((result) => console.log("SAVED!!!"))
            .catch((err) => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        //**We can use find() method only if there is a few items and if it was many of them it would be better  */
        //**if we use some filters infort of it */
        return db
            .collection("products")
            .find()
            .toArray()
            .then((products) => {
                console.log(products);
                return products;
            })
            .catch((err) => console.log(err));
    }

    static findById(prodId) {
        const db = getDb();
        return (
            db
                .collection("products")
                //**Mongo db save data on it's format and we use mongodb.ObjectId to resemble it to mongodb object */
                .find({ _id: new mongodb.ObjectId(prodId) })
                .next()
                .then((product) => {
                    return product;
                })
                .catch()
        );
    }

    static deleteById(prodId) {
        const db = getDb();
        db.collection("products")
            //**There is deleteOne and deleteMany command */
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then((result) => console.log("Deleted"))
            .catch((err) => console.log("Error in deleting:", err));
    }
}

// **Last Version */
// const fs = require("fs");
// const path = require("path");

// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     "data",
//     "products.json"
// );

// const getProductsFromFile = (cb) => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     });
// };

// module.exports = class Product {
//     constructor(title, imageUrl, description, price) {
//         this.id = Math.random().toString();
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         getProductsFromFile((products) => {
//             products.push(this);
//             fs.writeFile(p, JSON.stringify(products), (err) => {
//                 console.log(err);
//             });
//         });
//     }

//     static delete(id) {
//         getProductsFromFile((products) => {
//             const productIndex = products.findIndex((p) => p.id === id);
//             products.splice(productIndex, 1);
//             fs.writeFile(p, JSON.stringify(products), (err) => {
//                 console.log("delete Error:", err);
//             });
//         });
//     }

//     static fetchAll(cb) {
//         getProductsFromFile(cb);
//     }

//     static findById(id, cb) {
//         getProductsFromFile((products) => {
//             const product = products.find((p) => p.id === id);
//             cb(product);
//         });
//     }
// };

module.exports = Product;
