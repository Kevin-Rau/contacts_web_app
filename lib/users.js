var fs       = require('fs');
var printf   = require('sprintf-js').sprintf;

var template = "var db = %s;\n\nexports.db = db;\n"

var config = {
  db: './users.db',
  db_path: './lib/users.db'
};

var db = require(config.db).db;

var flush_db = function(data) {
  var output = printf(template, JSON.stringify(data));
  fs.writeFileSync(config.db_path, output);
}

var create = function(params) {

  var new_user = {}

  new_user["login"]   = params["login"];
  new_user["name"]    = params["name"];
  new_user["admin"]   = params["admin"];

  db[params["login"]] = new_user;

  flush_db(db);

  return true;

}

var remove = function(login) {
  if (db.hasOwnProperty(login)) {
    delete db[login];
    flush_db(db);
    return true;
  }
  return false;
}

var user = function(login) {
  return db[login];
}

var users = function() {
  return Object.keys(db).map(function(key) {
    return db[key];
  });
}

exports.create = create;
exports.remove = remove;
exports.user   = user;
exports.users  = users;
