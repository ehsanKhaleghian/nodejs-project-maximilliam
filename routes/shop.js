const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const adminData = require("../routes/admin");

const router = express.Router();

router.get("/", (req, res, next) => {
    // console.log("Products:::", adminData.products);
    // res.sendFile(path.join(rootDir, "views", "shop.html"));

    const products = adminData.products;

    //By using  render() method it uses default templating engin
    //And because of that we tolde the browser which folder is our views, we can just use file name without ".pug" to render
    res.render("shop", { prods: products, docTitle: "Shop Title" });
});

module.exports = router;
