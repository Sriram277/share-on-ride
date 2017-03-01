var fs = require('fs');
var ejs = require('ejs');
var config = require('../config/config.js');

var _ = require('underscore');
var async = require('async');

var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');
var transporter_smtp = nodemailer.createTransport(config.EMAIL_CREDENTIALS);
var smtpTransport = require('nodemailer-smtp-transport');

//var transporter_smtp = nodemailer.createTransport(smtpTransport(config.EMAIL_CREDENTIALS));

module.exports = {


    createTrip: function (req, res) {
        var reqBody = req.body;
        if (!reqBody) {
            return res.status(400).send({error: "Body should not be empty"});
        }
        if (!reqBody.fromLocation || !reqBody.toLocation) {
            return res.status(400).send({error: "Both Locations is required"});
        }
        if (!reqBody.date) {
            return res.status(400).send({error: "Date is required"});
        }
        if (!reqBody.available) {
            return res.status(400).send({error: "Availability seats are required"});
        }
        reqBody.date = new Date(req.body.date);
        reqBody.driverId = req.params.driverId;
        Ride.create(reqBody, function (err, ride) {
            if (err || !ride) {
                res.status(500).send(err);
            }
            if (ride) {
                res.status(200).send({status: true});
            }
        });

    },
    listAllTrips: function (req, res) {
        Ride.find({}, function (err, trips) {
            console.log(err, trips);
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(trips);
            }
        });
    },
    listMyTrips: function (req, res) {
        var driverId = req.params.driverId;
        Ride.find({driverId: driverId}, function (err, trips) {
            console.log(err, trips);
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(trips);
            }
        });
    },
    findTrips: function (req, res) {
        var reqBody = req.body;
        if (!reqBody.fromLocation || !reqBody.toLocation) {
            return res.status(400).send({error: "Both Locations is required"});
        }
        if (!reqBody.date) {
            return res.status(400).send({error: "Date is required"});
        }

        var from = req.body.fromLocation;
        var to = req.body.toLocation;
        var start_date = new Date(req.body.date).setHours(0, 0, 0, 0);
        var end_date = new Date(req.body.date).setHours(23, 59, 59, 999);
        console.log(from, to, start_date, end_date);
        Ride.find({
            fromLocation: from, toLocation: to, date: {
                "$gte": start_date,
                "$lte": end_date
            }
        }).lean().exec(function (err, trips) {
            if (err) {
                res.status(500).send(err);
            }
            if (trips.length > 0) {
                var count = 0;
                async.forEach(trips, function (trip, cb) {
                    User.findOne({_id: trip.driverId}, function (err, user) {
                        trips[count].user = {};
                        trips[count].user.email = user.email;
                        trips[count].user.mobile = user.mobile;
                        trips[count].user.name = user.name;
                        count++;
                        if (trips.length === count) {
                            res.send(trips);
                        }
                    });
                });
            } else {
                res.send([]);
            }

        });
    },
    contactDriver: function (req, res) {
        var driver = req.body;
        User.findOne({_id: req.params.userId}, function (err, user) {
            var temp = process.cwd() + '/views/contactDriver.ejs';

            fs.readFile(temp, 'utf8', function (err, file) {
                if (err) return res.status(500).send(err);
                user.fromLocation = driver.fromLocation;
                user.toLocation = driver.toLocation;
                user.driverName = driver.name;
                var html = ejs.render(file, {user: user});
                var mailOptions = {
                    from: "kirru.crr@gmail.com",
                    to: driver.email,
                    subject: "Want to join a ride with you",
                    html: html
                };
                transporter_smtp.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        res.status(200).send({success: true});
                    }
                });
            });
        });
    },
    updateTrip: function (req, res) {
        var reqBody = req.body;
        Ride.update(req.params.tripId, reqBody, function (err, ride) {
            if (err || !ride) {
                res.status(500).send(err);
            }
            if (ride) {
                res.status(200).send({status: true});
            }
        });

    },
    getOneTrip: function (req, res) {

        Ride.findOne({_id:req.params.tripId}, function (err, trip) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(trip);

        });
    },
    deleteTrip: function (req, res) {
        Ride.findOne({ _id : req.params.tripId}, function (err, ride) {
            if (err) {
                return res.status(500).send(err);
            }
            ride.remove(function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send({status: true});
            });
        });

    }


};


