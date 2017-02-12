module.exports = function(mongoose) {
    "use strict";
    var Schema = mongoose.Schema;

    var historySchema = new Schema({
        userid: String,
        action_performed: String,
        client_ip: String,
        browser: String,
        browser_version: String,
        browser_agent: String,
        location: String,
        datetime: {
            type: Date,
            "default": Date.now
        },
        session: String
    }, {
        versionKey: false,
        strict: false
    });

    var loginHistory = mongoose.model('loginHistory', historySchema);
    return loginHistory;
};
