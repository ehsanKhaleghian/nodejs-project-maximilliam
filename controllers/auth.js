const User = require("../models/user");
const bcrypt = require("bcryptjs");
//**Node js package to generate token */
const crypto = require("crypto");
//**Mailing service */
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
//**For validation , validationResult will store all the validation error */
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        //**The api key can be given from sendgrid site-->setting-->apikey */
        auth: {
            api_key:
                "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",
        },
    })
);
exports.getLogin = (req, res, next) => {
    //**Gaining information from cookie */
    //**One disadvantage of using cookie is that every user can change it in the  */
    //**    dev tool. So we can use session instead */
    // const isLoggedIn = req.get("Cookie").split(";")[10].trim().split("=")[1];
    let message = req.flash("error");
    if (message.lenght) {
        message = message[0];
    } else message = null;
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        //**This key: "error" is given from req.flash("error",.....) */
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: [],
    });
};

exports.postLogin = (req, res, next) => {
    //**It will not work because redirect will create a brand new req and res and isLoggedIn item  */
    //**    will not be there anymore */
    // req.isLoggedIn = true;

    //**For setting a cookie we use this way. */
    //**Set-Cookie is a reserved name and after that there is key=value pair */
    //**Browser by default sends the cookie to the server in every request */
    //**HttpOnly used for more security that hackers couldn't access data between server and client */
    //**    only client access these data. */
    //**We have package that manage cookies and it is not needed to implement it by ourself */
    // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    /* -------------------------------------------------------------------------- */
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email,
                password,
            },
            validationErrors: errors.array(),
        });
    }

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                //**By using validation the flash is not needed anymore */
                // req.flash("error", "Invalid email or password.");
                return res.status(422).render("auth/login", {
                    path: "/login",
                    pageTitle: "Login",
                    errorMessage: errors.array()[0].msg,
                    oldInput: {
                        email,
                        password,
                    },
                    validationErrors: [],
                });
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        //**Using session instead of cookie: */
                        //**Session is different on every browsers */
                        //**Now we can find isLoggedIn and jafar with their values in the database */
                        req.session.isLoggedIn = true;
                        req.session.jafar = "mamad";
                        req.session.user = user;
                        //**To ensure that the session is created in the database and after that continue the rest of work */
                        //**    we use save(()=>{}) */
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect("/");
                        });
                    }
                    //**By using validation the flash is not needed anymore */
                    // req.flash("error", "Invalid email or password.");
                    // res.redirect("/login");
                    return res.status(422).render("auth/login", {
                        path: "/login",
                        pageTitle: "Login",
                        errorMessage: errors.array()[0].msg,
                        oldInput: {
                            email,
                            password,
                        },
                        validationErrors: [],
                    });
                })
                .catch((err) => res.redirect("/login"));
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            //**When error pass to the next the express will skip all other middleware and
            //**    will go to the error middlware which we created.*/
            return next(error);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    //**To access errors in validator */
    const errors = validationResult(req);
    //**Is empty is a built in function in express-validator */
    if (!errors.isEmpty()) {
        //**Common status code for indicating that validation faild */
        return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "Signup",
            //**This key: "error" is given from req.flash("error",.....) */
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email,
                password,
                confirmPassword: req.body.confirmPassword,
            },
            validationErrors: errors.array(),
        });
    }

    //**Using bcrypt package to encrypt password */
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] },
            });
            //**For saving in database */
            return user.save();
        })
        .then((result) => {
            res.redirect("/login");
            //**Sending Email for user and we should send email in a blocking mode*/
            return transporter.sendMail({
                to: email,
                from: "shop@ehsan-shop.com",
                subject: "Signup succeeded",
                html: "<h1>You Successfully signed up!</h>",
            });
        })
        .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.lenght) {
        message = message[0];
    } else message = null;
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        //**This key: "error" is given from req.flash("error",.....) */
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationErrors: [],
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash("error");
    if (message.lenght) {
        message = message[0];
    } else message = null;
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        //**This key: "error" is given from req.flash("error",.....) */
        errorMessage: message,
    });
};

//**Create a token and saving it inside user database */
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.rediredt("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash("error", "No account with  that email found.");
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then((result) => {
                return transporter.sendMail({
                    to: req.body.email,
                    from: "ehsan.khaleghian@gmail.com",
                    subject: "Password reset",
                    html: `
                <p>You requested password reset </P>
                <p>Click This link <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                `,
                });
            })
            .catch((err) => {
                console.log(err);
                console.log("Error in Reseting Password::", err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        //**$gt=greater than----it is used for finding items that is greater than a specific item */
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then((user) => {
            let message = req.flash("error");
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render("auth/new-password", {
                path: "/new-password",
                pageTitle: "New Password",
                errorMessage: message,
                userId: user._id.toString(),
                //**This parameter is passed to the req and then we will take it in the post method */
                //**    by an input field and it's name is passwordToken */
                passwordToken: token,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId,
    })
        .then((user) => {
            resertUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            //**It will replace the old user with new password and .... */
            return resetUser.save();
        })
        .then((result) => res.redirect("/login"))
        .catch((e) => console.log(e));
};
