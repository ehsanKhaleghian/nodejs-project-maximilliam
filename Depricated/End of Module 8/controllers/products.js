//* We dont need below line anymore by usign controller
// const products = [];

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
    });
};

exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title });

    //*title is the name attribute of input field in the html
    const product = new Product(req.body.title);
    product.save();

    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) =>
        res.render("shop", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true,
        })
    );
};
