var db = require('../../config.json')
var util = require('util')

var exports = module.exports = {};

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


// user not found
    cb(null);
}

exports.add = function (username, password, cb) {
   console.log('addUser')
   cb(null, {});    
}
