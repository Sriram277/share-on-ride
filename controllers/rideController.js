var _ = require('underscore');
var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');

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
        reqBody.date = new Date(req.body.date).setHours(0,0,0,0);
        reqBody.driverId = req.params.driverId;
        Ride.create(reqBody, function (err, ride) {
            if (err || !ride) {
                res.status(500).send(err);
            }
            if (ride) {
                res.status(200).send({status:true});
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
    findTrips: function (req, res){
        var from = req.body.fromLocation;
        var to = req.body.toLocation;
        var date = new Date(req.body.date).setHours(0,0,0,0);
        console.log(from,to,date);
        Ride.find({fromLocation: from, toLocation:to, date: date}, function(err, trips){
            if (err) {
                res.status(500).send(err);
            }
            res.send(trips);
        });
    }


};