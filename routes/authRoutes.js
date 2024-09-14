const express = require("express");

const router = express.Router();
const passport = require("passport");


router.get("/google", 
   passport.authenticate("google",{scope: ["email","profile"]})
);
 
router.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: "/DashBoard",
    failureRedirect: "/auth/failure",
  })

);

router.get("/failure", (req, res) => {
  res.send("Somthing went wrong")
});

router.get('/logout', (req, res, next) => {
     
     
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect( req.query.dest ||'/'); 
  });
 });

module.exports = router;
