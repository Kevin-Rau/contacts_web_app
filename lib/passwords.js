// Code adapted from hash-password-default by 'framp'
// https://github.com/framp/hash-password-default

var crypto   = require('crypto');
var fs       = require('fs');
var printf   = require('sprintf-js').sprintf;

var template = "var db = %s;\n\nexports.db = db;\n"

var config = {
  algorithm: 'sha256',
  repetitions: 100,
  encoding: 'hex',
  db: './secret.db',
  db_path: './lib/secret.db'
};

var db = require(config.db).db;

var generateHash = function(value, encoding) {
  var v = crypto.createHash(config.algorithm);
  v.update(value);
  return v.digest(encoding || config.encoding);
};

var hashPassword = function(password, salt) {
  var repetitions = config.repetitions;
  salt = salt || generateHash(crypto.randomBytes(16));
  hash = generateHash (salt + password);
  while (repetitions--) {
    hash = generateHash(hash + salt + password);
  }
  return salt + hash;
};

var checkPassword = function(input, password) {
  var salt   = password.substr(0, password.length/2);
  var digest = hashPassword(input, salt);
  return password === digest;
};

var flush_db = function(data) {
  var output = printf(template, JSON.stringify(data));
  fs.writeFileSync(config.db_path, output);
}

var associate = function(user, password) {
  db[user] = hashPassword(password);
  flush_db(db);
}

var check = function(user, input) {
  if (db.hasOwnProperty(user)) {
    return checkPassword(input, db[user]);
  } else {
    return false;
  }
}

var remove = function(user, input) {
  if (db.hasOwnProperty(user)) {
    if (checkPassword(input, db[user])) {
      delete db[user];
      flush_db(db);
      return true;
    }
  }
  return false;
}

exports.associate = associate;
exports.check     = check;
exports.remove    = remove;
