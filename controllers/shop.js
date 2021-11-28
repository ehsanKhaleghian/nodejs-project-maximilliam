const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
//**For generating pdf file*/
const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
    //**Here for taking all products mongoose has a method which is find */
    //**  and it would fetch all the items in the collection and .then().catch()*/
    //**  works properly */
    // Product.find()
    //     .then((products) => {
    //         res.render("shop/product-list", {
    //             prods: products,
    //             pageTitle: "All Products",
    //             path: "/products",
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    //Pagination functionality
    //**Plus is for changing page from string to number*/
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments().then(numProducts => {
        totalItems=numProducts;
        //**Find in here gives us all the items so we used skip method*/
        return Product.find()
            //**The skip method will skip items in database and limit will limit the data that should be shown*/
            .skip((page-1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    }).then((products) => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "Products",
            path: "/products",
            currentPage : page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page -1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            //**This is available by csrf package */
            // csrfToken: req.csrfToken(),
        });
    }).catch((err) => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    //**This is mongoose method: findById() and it will automatically turn */
    //**  a string to ObjectId and it is not needed anymore to change it */
    //**  manually */
    Product.findById(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
    //Pagination functionality
    //**Plus is for changing page from string to number*/
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments().then(numProducts => {
        totalItems=numProducts;
        //**Find in here gives us all the items so we used skip method*/
        return Product.find()
            //**The skip method will skip items in database and limit will limit the data that should be shown*/
            .skip((page-1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    }).then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                currentPage : page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page -1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                //**This is available by csrf package */
                // csrfToken: req.csrfToken(),
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        //**To execute populate and chain promise */
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            res.redirect("/cart");
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((i) => {
                //**_doc is a mongoose method that we can takes data */
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    //**Mongoose will pick the Id from entire object */
                    userId: req.user,
                },
                products,
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => res.redirect("/orders"))
        .catch((err) => console.log("Error in the post CARD::::", err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
            });
        })
        .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    //**These line is used so only the user who ordered that item can access data*/
    Order.findById(orderId).then(order => {
        if (!order) {
            return next(new Error ("No order found"))
        }
        // if (order.user.userId.toString() === req.user._id.toString()) {
        //     return next(new Error("Unauthorized"))
        // }
        const invoiceName = "invoice-" + orderId + ".txt";
        const invoicePath = path.join("data", "invoices", invoiceName);

        //**For creating PDF files*/
        const pdfDoc = new PDFDocument();
        res.setHeader("Content-Type", "application/txt");
        res.setHeader("Content-Disposition", 'inline ; filename=ehsan');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text("Invoice" , {
            underline: true
        });
        pdfDoc.text("-------------------------------------------------");

        pdfDoc.end();

        //**This kind of sending file is good for little files because in this way node will access the file*/
        //**    read the entire file and return it by response which if the file is big it will be very heavy*/
        //**    and we should streaming it.*/
        // fs.readFile(invoicePath, (err , data) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     //**This gives the browser some extra information that can handle it in a better way*/
        //     res.setHeader("Content-Type", "application/txt");
        //     //**This will define how the content should serve to the client*/
        //     /**Inline means : tell the browser to open it inline*/
        //     /**Inline means : tell the browser to open it inline*/
        //     res.setHeader("Content-Disposition", "attachment; filename=ehsan.txt");
        //     res.send(data);
        // })

        //**For streaming in reading file*/
        // const file=fs.createReadStream(invoicePath);
        // res.setHeader("Content-Type", "application/txt");
        // //**This will define how the content should serve to the client*/
        // /**Inline means : tell the browser to open it inline*/
        // /**Inline means : tell the browser to open it inline*/
        // res.setHeader("Content-Disposition", "attachment; filename=ehsan.txt");
        // //**Pipe is used to forward streaming data to the res (response)*/
        // //**    the data will be downloaded by browser step by step.*/
        // file.pipe(res);

    }).catch(err => next(err))

}
