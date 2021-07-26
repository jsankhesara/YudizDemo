'use strict';
var crypto = require('crypto');

module.exports = {

    makeSalt : function () {
        return crypto.randomBytes(16).toString('base64');
    },
    
    // encrypt password
    encryptPassword : function (password, saltpwd) {
        if (!password || !saltpwd)
            return '';
        var salt = new Buffer(saltpwd, 'base64');
    
        var pwd = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
        return pwd;
    }
};
