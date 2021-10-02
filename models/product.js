const getDb = require("../util/database").getDb;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        //**We can insertMany or insertOne. */
        //**We can use this commend: insertOne({name:"jafar",age:32}) */
        return db
            .collection("products")
            .insertOne(this)
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
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
