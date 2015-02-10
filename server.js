var express = require('express');
var parser  = require('body-parser');
var logger  = require('morgan');

var users     = require('./lib/users');
var passwords = require('./lib/passwords');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(parser.json());
app.use(logger('dev'));

app.post('/api/1.0/login', function (req, res) {
  var user = users.user(req.body.login);
  if (user === undefined) {
    res.json({status: false, message: "Incorrect user / password combination."});
    return;
  }
  var status = passwords.check(req.body.login, req.body.password);
  if (status) {
    res.json({status: true, data: user});
  } else {
    res.json({status: false, message: "Incorrect user / password combination."});
  }
});

app.get('/api/1.0/users', function (req, res) {
  res.json({status: true, users: users.users()});
});

app.post('/api/1.0/users', function (req, res) {
  var user = users.user(req.body.login);
  if (user === undefined) {
    res.json({status: false, message: "Operation not allowed."});
    return;
  }
  if (!user.admin) {
    res.json({status: false, message: "Operation not allowed."});
    return;
  }
  users.create(req.body.params);
  passwords.associate(req.body.params['login'], req.body.params['password']);
  res.json({status: true});
});

app.post('/api/1.0/delete_user', function (req, res) {
  var user = users.user(req.body.login);
  if (user === undefined) {
    res.json({status: false, message: "User does not exist."});
    return;
  }
  passwords.remove(user.login);
  users.remove(user.login);
  res.json({status: true});
});

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  var message = 'Contacts Web App is available at http://localhost:%d/';
  console.log(message, app.get('port'));
});
