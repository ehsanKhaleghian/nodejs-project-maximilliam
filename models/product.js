const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//**In Schema introduce the schem that we want and define the Types and require : */
const prodcutSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    //**Every Product should have a userId to undrestand which user ordered that */
    userId: {
        type: Schema.Types.ObjectId,
        //**It's a refrence to the user model  */
        ref: "User",
        required: true,
    },
});

//**Mongoose takes the product name and create a collection in the */
//**    database based on it's name . In here we will have a collection */
//**    and the name of which is "product"(All in lowercase) */

//**In the model first parameter is the name of schema and */
//**    the second one is it's variable name */
module.exports = mongoose.model("Product", prodcutSchema);

/* -------------------------------------------------------------------------- */
/*const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;  
*/
