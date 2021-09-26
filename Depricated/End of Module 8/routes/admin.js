// const path = require("path");

const express = require("express");

// const rootDir = require("../utils/path");

const productsController = require("../controllers/products");

const router = express.Router();

// const products = [];

//* /admin/add-product => GET

// router.get("/add-product", (req, res, next) => {
//     res.sendFile(path.join(rootDir, "views", "add-product.html"));
// });

// router.get("/add-product", (req, res, next) => {
//     res.render("add-product", {
//         pageTitle: "Add Product",
//         path: "/admin/add-product",
//         formsCSS: true,
//         productCSS: true,
//         activeAddProduct: true,
//     });
// });

router.get("/add-product", productsController.getAddProduct);

//* /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
