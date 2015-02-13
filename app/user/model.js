var db = require('../../config.json')
var util = require('util')
var redis = require("redis").createClient(); 

var exports = module.exports = {};


redis.on("error", function (err) {
        console.log("Error " + err);
    });


exports.getByName = function(username, cb) {
    
    console.log('user.getByName');
    
// database error
//    console.log(util.inspect(db));
//    cb('Database error');    
//    return;

// user already exists
//    var user = {};
//    user['username'] = username;
//    cb(null, user);


    console.log('user ' + username  + ' not found');
    cb(null);
}

exports.add = function (username, password, cb) {
    console.log('add user ' + username)
    
    cb(null, {});    
}

exports.remove = function (username, password, cb) {
    console.log('remove user ' + username)
    cb(null, {});
}


