// auth middleware- after logout, still login user, need to prevent 
module.exports = {
    ensureAuth : function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        else {
            res.redirect('/')
        }
    },
    ensureGuest : function(req, res , next){
        if (req.isAuthenticated()){
            res.redirect('/dashboard');
        }
        else {
            return next();  
        }
    },
}