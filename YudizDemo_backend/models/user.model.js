const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');

var schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    saltPassword:{
        type: String,
        required: true,
    },
    authToken:{
        type: String,
        required: true,
    }
}, schemaOptions);

UserSchema.plugin(autopopulate);
UserSchema.pre('save', function (next) { this.last_updated = new Date(); if (!this.isNew) { return next(); } next(); });

module.exports = mongoose.model('User', UserSchema);