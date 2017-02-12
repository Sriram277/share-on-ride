

module.exports = {
    MONGO_SERVER_URL: 'mongodb://localhost:27017/share-on-ride',
    isAuthorized : function (req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.status(403).send({message:"Unauthorized to access"});
        }
    }
};