const express = require("express");
//**The validator package-we took check function out of it */
//**body means you should check for a specific field in the request body */
const { check, body } = require("express-validator/check");
const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address")
            //**This is for sanitizing email(Cleaning it and make all words to lowercase,remove white spaces) */
            //**The email will be stored in the database in the sanatize style */
            .normalizeEmail(),
        body("email", "Password has to be vaild.")
            .isLength({ min: 5 })
            .isAlphanumeric()
            //**To removing white space from password */
            //**The password will be stored in the database in the sanatize style */
            .trim(),
    ],
    authController.postLogin
);

router.post(
    "/logout",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body("email", "Password has to be vaild.")
            .isLength({ min: 5 })
            .isAlphanumeric(),
    ],
    authController.postLogout
);

//**Check is for validation */
//**IsEmail() is a built in method */
router.post(
    "/signup",
    //**Email is the name of the field which we want to check it's validation */
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            //**To check value and throw our message, the Error message will be the message we show */
            //**    after that we should return true or it will show withMessage text */
            .custom((value, { req }) => {
                //**This lines of codes is an example of codes for custom error that isn't needed anymore */
                // if (value === "jafar@jafari.com") {
                //     throw new Error("This email is forbidden");
                // }
                // return true;

                //**In here value is the email field because we are checking check("email"). */
                //**By returning the line below, validato will wait for promise to resolve and */
                //**    if it goes throw the if block it will reject and show the error message, */
                //**    it is an asyncronous validator. */
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject(
                            "E-mail exist already, please pick a different one"
                        );
                    }
                });
            })
            .normalizeEmail(),
        //**After password field the message is added and it will be shown for every validator */
        //**Password is the name of the field that we want check for it's validation */
        //**    and we don't have to add it for every validator */
        body(
            "password",
            "Please enter a password with only numbers and text and at least 5 characters"
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body("confirmPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords have to be match");
                }
                return true;
            }),
    ],
    authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

//**It's a dynamic route and it has to be token because we use it with token name */
router.get("/reset/:token", authController.getNewPassword);

router.get("/new-password", authController.postNewPassword);

module.exports = router;
