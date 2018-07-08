module.exports = {
  ensureAuthenticated: function (req, res, next) {
      /* isAuthenticated() is a passport method that we get access to on the request object once passport session is running*/
     if(req.isAuthenticated()){
        //close next parenthesis
         return next();
     } 
     req.flash('error_msg', 'Not authorized');
     res.redirect('/users/login');
  }
}