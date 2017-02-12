var bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

module.exports = function (mongoose) {
    "use strict";
    var Schema = mongoose.Schema;
    var usersSchema = new Schema({
        email: {
            unique: true,
            required: true,
            type: String
        },
        name:{
            type: String
        },
        password: String,
        username: {
            type:String,
            unique: true
        },
        mobile: {
            type: String
        },
        profilePic: String,
        role: String,
        status: {
            type: String,
            default:"ACTIVE"
        },
        created_at: {
            type: Date,
            "default": Date.now
        },
        updated_at: {
            type: Date,
            "default": Date.now
        }
    }, {
        versionKey: false,
        strict: false
    });

    usersSchema.pre('save', function(next) {
        var user = this;

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) return next();

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });

    usersSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    var User = mongoose.model('User', usersSchema);

    return User;
};
