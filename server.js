var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('key-cert.pem', 'utf8');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var bodyParser = require('body-parser');
var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var util = require('util');
var serveStatic = require('serve-static');

var config = require('./config.json')

var app = express();

// your express configuration here
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(passport.initialize());
// parse application/json
app.use(bodyParser.json())


function findByUsername(username, fn) {
  var users = config.users;
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

// Use the BasicStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new BasicStrategy({
  },
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure.  Otherwise, return the authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password != password) { return done(null, false); }
        return done(null, user);
      })
    });
  }
));

all_events = [];

// curl -v -I http://127.0.0.1:3000/
// curl -v -I --user bob:secret http://127.0.0.1:3000/
app.get('/login', 
   passport.authenticate('basic', { session: false }),
   function(req, res){
     console.log("-----\nLogin:" + util.inspect(req.user));
     all_events.push(req.user);    
     res.jsonp( req.user );
     console.log('LOGIN DONE');
  });


app.post('/register', function(req, res)
{
  var data = util.inspect(req);
  console.log("Register " + data);
  console.log("find bbbbb " + data.search('bbbbb') );
  
//  User.getByName(data.name, function(err, user){
//    if (err) return next(err);

//    if (user.id) {
//      res.error("Username already taken!");
//      res.redirect('back');
//    } else {

//      user = new User({
//        name: data.name,
//        pass: data.pass
//      });

//      user.save(function(err){
//        if (err) return next(err);
//        req.session.uid = user.id;
//        res.redirect('/');
//      });
//    }
//  });

});

//   console.log("POST /register " + util.inspect(req.body) );

app.get('/api/db', function (req, res) {
   console.log('GET db');
 
   var db = config;
   res.jsonp(db);

});

app.get('/api/register', function (req, res) {
   console.log('register ' + util.inspect(req.query)  );

});

app.post('/events/new', 
  passport.authenticate('basic', { session: false }),
  function(req, res){
   console.log("-----\nNEW EVENT:\n\n" + util.inspect(req.body));
   all_events.push(req.body);    
   res.jsonp({ username: req.user.username, email: req.user.email, Event: req.body });
  });

app.use(serveStatic(__dirname ));

console.log('Listening on port 3000');
//httpServer.listen(80);
//httpsServer.listen(443);
httpsServer.listen(3000);
