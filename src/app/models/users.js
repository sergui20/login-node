const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        email: String,
        password: String,
        token: String
    },
    twitter: {
        id: String,
        email: String,
        password: String,
        token: String
    },
    google: {
        id: String,
        email: String,
        password: String,
        token: String
    }
})

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
};

module.exports = mongoose.model('User', userSchema);