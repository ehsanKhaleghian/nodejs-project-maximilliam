const path = require("path");

const express = require("express");

// const rootDir = require("../utils/path");

// const adminData = require("../routes/admin");

const router = express.Router();

const productsController = require("../controllers/products");

// router.get("/", (req, res, next) => {
// console.log("Products:::", adminData.products);
// res.sendFile(path.join(rootDir, "views", "shop.html"));

// const products = adminData.products;

//*By using  render() method it uses default templating engin
//*And because of that we tolde the browser which folder is our views, we can just use file name without ".pug" to render
//     res.render("shop", {
//         prods: products,
//         pageTitle: "Shop",
//         path: "/",
//         hasProducts: products.length > 0,
//         activeShop: true,
//         productCSS: true,
//     });
// });

router.get("/", productsController.getProducts);

module.exports = router;
