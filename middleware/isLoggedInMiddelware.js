const AppError = require("../errors/AppError");

exports.isLoggedIn = (req, res, next) => { 
    
    req.user ? next() : next( new AppError("You must be logged in to accses this part of the site!",401));
};

exports.restrictedTo = (...roles) => {
    return (req, res, next) => { 
    roles.includes(req.user.role) ? next() : next( new AppError("This route is limited to certin users !",401));

    }
 }