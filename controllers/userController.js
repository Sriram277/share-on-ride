var _ = require('underscore');
var jwt = require("jsonwebtoken");
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {

    register: function (req, res) {
        console.log(req.body);
        var reqBody = req.body;
        if (!reqBody) {
            return res.status(400).send({error: "Body should not be empty"});
        }
        if (!reqBody.password) {
            return res.status(400).send({error: "Password is required"});
        }
        reqBody.role = reqBody.role.toUpperCase();


        User.findOne({email: req.body.email}, function (err, existingUser) {
            if (err) {
                res.status(500).send({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (existingUser) {
                    res.status(500).send({
                        type: false,
                        data: "Email already registered!"
                    });
                } else {
                    reqBody.username = reqBody.email;
                    var user = new User(reqBody);
                    user.save(function (err, user) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        if (!err) {
                            res.status(200).send({message:"Successfully Registered"});
                        }
                    });
                }
            }
        });

    },

    login: function (req, res) {
        if (!req.body.identifier) {
            return res.status(400).send({error: "Username is required"});
        }
        if (!req.body.password) {
            return res.status(400).send({error: "Password is required"});
        }
        var role = req.body.role.toUpperCase();
        User.findOne({username: req.body.identifier}, function (err, user) {
            if (user) {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (err) res.status(500).send({error: "error.username.password.mismatch"});
                    if (isMatch) {
                        var token = jwt.sign(user, "12scxzc321932", {
                            expiresIn: 1440 // expires in 24 hours
                        });
                        var record = {
                            tokenId: token,
                            user: user
                        };
                        record.user.password = undefined;
                        console.log(role);
                        console.log(record.user.role);
                        record.user.role = role;
                        console.log(record.user.role);
                        res.status(200).send(record);
                    }else{
                        res.status(500).send({error: "error.username.password.mismatch"});
                    }
                });

            } else {
                res.status(500).send({error:"error.login.user.Invalid"});
            }
        });
    },

    listUsers: function (req, res) {
        User.find({}, function (err, users) {
            console.log(err, users);
            if (err) {
                res.status(500).send({type: false, data: "Error occured: " + err});
            } else {
                res.status(200).send(users);
            }
        });
    }

};