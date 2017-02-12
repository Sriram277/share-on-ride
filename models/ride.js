module.exports = function (mongoose) {
    "use strict";
    var Schema = mongoose.Schema;
    var rideSchema = new Schema({
        fromLocation:{
            type: String
        },
        toLocation: {
            type:String
        },
        date: {
            type: Date
        },
        driverId: {
            type: String
        },
        status: {
            type: String,
            default:"ACTIVE"
        }
    }, {
        versionKey: false,
        strict: false
    });

    var Ride = mongoose.model('Ride', rideSchema);

    return Ride;
};
