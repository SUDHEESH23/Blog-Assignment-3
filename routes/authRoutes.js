const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controller/authController");
const { deliverOtp, verifyOtp } = require("../controller/otpController");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    //scope: ["https://www.googleapis.com/auth/plus.login"],
    scope:["profile","email"]
  })
);
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   authController.googleCallback
// );
router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error(err);
        return res.redirect("/login");
      }

      if (!user) {
        console.log("Authentication failed:", info);
        return res.redirect("/login");
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return res.redirect("/login");
        }

        // Authentication successful, redirect to the desired page
        return res.redirect("/login");
      });
    })(req, res, next);
  },
  authController.googleCallback
);

// Route for delivering order and sending OTP
router.post("/deliver-otp/:userId", deliverOtp);

// Route for verifying OTP
router.post("/verify-otp/:otp", verifyOtp);

module.exports = router;