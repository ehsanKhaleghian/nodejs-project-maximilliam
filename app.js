const path = require("path");
//**Remove this string from end of mongodb conncetion */
const MONGODB_URI =
    "mongodb+srv://ehsanScript:E55268199Yk@cluster0.ytldu.mongodb.net/shop?retryWrites=true&w=majority";

const express = require("express");
const bodyParser = require("body-parser");
//**Here Mongoose is imported */
const mongoose = require("mongoose");
//**For using session middleware we import it here to access it in every render */
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
//**For using CSRF token*/
const csrf = require("csurf");
//**For feedbacking user */
const flash = require("connect-flash");
//**For uploading and downloading files */
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
//**Connecting session middleware to the database */
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessoins",
});
//**This package store token inside session */
const csrfProtection = csrf();
//**Diskstorage is a multer function that helps you to store your data in the disk*/
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        //**Here you can specify the file name */
        //**We used file.filename to avoid files with same name */
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
//**To determine a filter for files like only jpeg is acceptable */
const fileFilter = (req, file, cb) => {
    //**null which is the first argument is for error */
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        //**True in here means that it should be stored */
        cb(null, true);
    } else cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
//**We can define one file or multiple and then the name of input to be parse which is "image" here */
//**{dest:image} is an option we passed to the multer then it will change the buffer file (which */
//**    nodejs will create if you apload a file) to a file in a folder that it created by itself. */
//**    the name of folder here is images. */
//**We delete {dest:"image"}(<< app.use(multer({ dest: "images", storage }).single("image")); >>) to use our storage funcion  */
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
//**Setting for session API */
//**For every request:*/
//**    1- The middleware will register */
//**    2- The middleware will look for a session cookie */
//**    3- If it finds one then will look for feeding session in the database */
//**    3- Load data from the database */
app.use(
    session({
        //**Secret should be a long string */
        secret: "j;skfsjflskfjslfs;fkasdjfsfd",
        //**This means that session will not save on every response */
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
//**The csrf package should use after session because it use session */
app.use(csrfProtection);
//**The connect-flash package should use after session because it use session */
app.use(flash());

//**For passing some items to every request like "isAuthenticat" or "csrfToken" */
//**    we use this line befor routes */
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    //**If we throw error here out of then().catch() block express will go to the error handler */
    //**    middleware. */
    //throw new Error("DUMMY ERROR")
    if (!req.session.user) {
        return next();
    }
    //**Find user by help of session and regiser it by mongoose to access its methods */
    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                //**Additional check if the user couldn't be find to prevent our app not to crash */
                return next();
            }
            req.user = user;
            next();
        })
        //**This catch method only fires when we face technical errors, not when it didn't find a user */
        .catch((err) => {
            throw new Error(err);
        });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use("/500", errorController.get500);
app.use(errorController.get404);

//**This is occur when we pass an error object to the next() function like : next(error) */
//**    and then express will skip all the above middlwares and execute this line and if */
//**    we had more than one error middlwares it will be execute from top to bottom. */
app.use((error, req, res, next) => {
    console.log("ERROR:::", error);
    //**We didn't redirect to prevent infinite loop becuase if throw an error in here */
    //**    it will render again and by redirecting it will render app again. */
    res.status(500).render("500", {
        pageTitle: "Error!",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn,
    });
});

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(7777);
    })
    .catch((err) => {
        console.log(err);
    });
