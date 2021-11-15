const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};

exports.postAddProduct = (req, res, next) => {
    //**The imageUrl is commented because we want to upload a file instead of url */
    const title = req.body.title;
    // const imageUrl = req.body.imageUrl;
    //**Change the other side of = to req.file for uploading a file */
    const imageUrl = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    console.log("IMAGE URL:::", imageUrl);

    //**If we throw error it will go to the catch block and then will show the 500 page */
    // throw new Error("SOME DUMMY ERROR")

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: {
                title,
                imageUrl,
                price,
                description,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
    }
    //**The left side like title:... refers to Schema item and right side refers to*/
    //**    items that we take here */
    //**We should pass the Schema object here: */
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        //**We can store entire mongoos object and that will choose only the id */
        //**    of that object */
        userId: req.user,
    });
    product
        //**Mongoose gives us the save() method and it acts like promise */
        .save()
        .then((result) => {
            console.log("Created Product");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            //**This error occurs when something went wrong with database */
            // return res.status(500).render("admin/edit-product", {
            //     pageTitle: "Add Product",
            //     path: "/admin/add-product",
            //     editing: false,
            //     hasError: true,
            //     product: {
            //         title,
            //         imageUrl,
            //         price,
            //         description,
            //     },
            //     errorMessage: "Database operation failed, please try again.",
            //     validationError: [],
            // });

            //**Another way of returning 500 errors.*/
            // res.redirect("/500");

            //**Another way of returning 500 errors. */
            const error = new Error(err);
            //**We can pass extra information through error. */
            error.httpStatusCode = 500;
            //**When error pass to the next the express will skip all other middleware and
            //**    will go to the error middlware which we created.*/
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: [],
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            //**When error pass to the next the express will skip all other middleware and
            //**    will go to the error middlware which we created.*/
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
    }

    Product.findById(prodId)
        .then((product) => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/");
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            //**Inside product mongoose has save() method */
            //**By returning we create a chain of promises so we can use .then and .catch again */
            return product.save().then((result) => {
                console.log("UPDATED PRODUCT!");
                res.redirect("/admin/products");
            });
        })

        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            //**When error pass to the next the express will skip all other middleware and
            //**    will go to the error middlware which we created.*/
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    //**This user._id parameter is passed to the req in the app.js */
    Product.find({ userId: req.user._id })
        //**By using select() can select which field we want here and by using minus */
        //**    that field would be excluded like -_id */
        //.select("title price")
        //**Here the data of user will populated and in the second field we can */
        //**    choose which field we need in here the "name" field */
        //.populate("userId")
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            //**When error pass to the next the express will skip all other middleware and
            //**    will go to the error middlware which we created.*/
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    //**This is the method that provided by mongoos : findByIdAndRemove */
    Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(() => {
            console.log("DESTROYED PRODUCT");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            //**When error pass to the next the express will skip all other middleware and
            //**    will go to the error middlware which we created.*/
            return next(error);
        });
};
