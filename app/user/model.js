'use strict'
/*jshint asi: true*/

//
// [key / value] pairs for the database
// leaderboard/user_count is a user id generator
// leaderboard/usermap is a hmap of username to ids
// leaderboard/users/$id contains the username, id, password
// leaderboard/events/$id contains a list of sim events
//

var db = require('../../config.json')
var util = require('util')
var redis = require("redis").createClient(); 

var exports = module.exports = {};


let DB = 'leaderboard'
let usermap = DB + '/usermap'

function getUserPath(id) {
  let s = DB + '/users/' + id
  return s
}

function getEventsPath(id) {
  let s = DB + '/events/' + id
  return s
}

redis.on("error", function (err) {
        console.log("Error " + err);
    });

exports.getByName = function(username, cb) {
   
  console.log('user.getByName');
  redis.hget(usermap, username, function (err, user) {
    if(err) {
      console.log(usermap + ' error: ' + err)
      return
    }
    if(user) {
      cb(null, user)
    }
    else {
      cb(null)
    } 
  })
}



exports.add = function (username, password, cb) {
  console.log('[add user] ' + username)
  redis.incr(DB + '/user_count', function (err, id) {
    redis.hmset( usermap, username, id, function (err) {
      if(err) {
        console.log(usermap + ' add user error ' + err)
        cb(err)
        return
      }
      let juser = {'username': username, 'password': password, 'id':id }
      redis.set(getUserPath(id), JSON.stringify(juser), function (err) {
        if(err) {
          console.log('error adding user ' + err);
          cb(err)
          return
        }
        cb(null, {username: username, id: id})
      });
    });
  }); 
}

exports.remove = function (username, cb) {
  console.log('[remove user] ' + username)
  // remove username from the user map
  redis.hdel(usermap, username, function(err, userId) {
    if (err) {
      console.log(usermap + ' [hdel error]: ' + err) 
      cb(err)
      return
    }
    // remove user data (password)
    let uPath =getUserPath(userId)
    console.log('remove user data ' + uPath)
    redis.del(uPath, function(err, userData) {
      if (err) {
        console.log(uPath + ' [del] error: ' + err)
        cb(err)
        return
      }
      let ePath = getEventsPath(userId)
      console.log('remove user events ' + ePath)
      redis.del(ePath, function(err, events) {
        if(err) {
          console.log( ePath + ' [del] err: ' + err)
          cb(err)
          return
        }
        // success
        console.log('remove success ' + userData + ' events: ' + events)
        cb(null, {username: username, id: userId} )
      })      
    })
  })
}


