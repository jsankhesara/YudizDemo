const User = require('../models/user.model');
var resHandlerService = require('../services/resHandler.service');
var common = require('../utils/common');
var config = require('../utils/config');
const redisClient = require('../utils/redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const jwt = require('jsonwebtoken');
const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

const limitByIP = new RateLimiterRedis({
    redis: redisClient,
    keyPrefix: 'login_fail_ip_per_day',
    points: config.maxWrongAttemptsByIPperDay,
    duration: 60, // Store number for 60 seconds since first fail
    blockDuration: 60, // Block for 60 seconds, if 100 wrong attempts per day
});

const limitByUsernameAndIP = new RateLimiterRedis({
    redis: redisClient,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: config.maxConsecutiveFailsByUsernameAndIP,
    duration: 60, // Store number for 90 days since first fail
    blockDuration: 60, // Block for 60 seconds, if 5 wrong attempts per day
});

exports.register = function (req, res) {
    User.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] }, function (err, usr) {
        if (err) {
            resHandlerService.handleError(res, "Something went wrong")
        } else {
            if (usr) {
                resHandlerService.handleError(res, "Email or Mobile Number already exists");
            } else {
                const saltPassword = common.makeSalt();
                const encryptedPassword = common.encryptPassword(req.body.password, saltPassword);
                const regObj = {
                    "email": req.body.email,
                    "password": encryptedPassword,
                    "phoneNumber": req.body.phoneNumber,
                    "saltPassword": saltPassword
                }
                var data = new User(regObj);
                User.create(data, function (err, user) {
                    if (err) {
                        console.log("errr",err);
                        resHandlerService.handleError(res, "Something went wrong while creating user")
                    } else {
                        resHandlerService.handleResult(res, user, "Registered successfully.");
                    }
                });
            }
        }
    })
}

exports.login = async function (req, res) {

    const ipAddr = req.connection.remoteAddress;
    const usernameIPkey = getUsernameIPkey(req.body.email, ipAddr);

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
        limitByUsernameAndIP.get(usernameIPkey),
        limitByIP.get(ipAddr),
    ]);

    let retrySecs = 0;
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > config.maxWrongAttemptsByIPperDay) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > config.maxConsecutiveFailsByUsernameAndIP) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        resHandlerService.handleManyRequest(res, "Too Many Requests , please try after some time.");
    } else {
        User.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.email }] }, async function (err, user) {
            if (!user) {
                try {
                    const promises = [limitByIP.consume(ipAddr)];
                    if (!user) {
                        promises.push(limitByUsernameAndIP.consume(usernameIPkey));
                    }

                    await Promise.all(promises);
                    resHandlerService.handleError(res, "email or password is wrong");
                } catch (rlRejected) {
                    if (rlRejected instanceof Error) {
                        throw rlRejected;
                    } else {
                        res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
                        resHandlerService.handleManyRequest(res, "Too Many Requests , please try after some time.");
                    }
                }
            } else {
                let hashedPassword = common.encryptPassword(req.body.password, user.saltPassword);
                if (hashedPassword == user.password) {
                    if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
                        await limitByUsernameAndIP.delete(usernameIPkey);
                    }
                    if (user.authToken) {
                        if (global.socketConnection) {
                            global.socketConnection.emit('user-logout', { 'token': user.authToken });
                            let query = { authToken: '' };
                            User.updateOne({ _id: user._id }, query).exec();
                        }
                    }
                    const token = jwt.sign(
                        { _id: user._id, email: user.email },
                        config.JWT_SECRET
                    );
                    let userObj = JSON.parse(JSON.stringify(user));
                    if (!userObj.hasOwnProperty('token')) {
                        userObj.token = token;
                    }
                    let query = { authToken: token };
                    await User.updateOne({ _id: user._id }, query).exec();
                    resHandlerService.handleResult(res, userObj);
                } else {
                    const promisesElse = [limiterSlowBruteByIP.consume(ipAddr)];
                    promisesElse.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
                    resHandlerService.handleError(res, "email or password is wrong");
                }
            }
        })
    }
}