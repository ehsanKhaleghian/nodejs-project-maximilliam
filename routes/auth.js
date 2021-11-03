const express = require("express");
//**The validator package-we took check function out of it */
//**body means you should check for a specific field in the request body */
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

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
                if (value === "jafar@jafari.com") {
                    throw new Error("This email is forbidden");
                }
                return true;
            }),
        //**After password field the message is added and it will be shown for every validator */
        //**Password is the name of the field that we want check for it's validation */
        //**    and we don't have to add it for every validator */
        body(
            "password",
            "Please enter a password with only numbers and text and at least 5 characters"
        )
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body("confirmPassword").custom((value, { req }) => {
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
