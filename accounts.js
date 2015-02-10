var passwords = require('./lib/passwords');
var accounts  = require('./lib/users');
var readline  = require('readline');

var usage = function() {
  console.log("Usage: node accounts.js create <user> <password>");
  console.log("Usage: node accounts.js check  <user> <password>")
  console.log("Usage: node accounts.js remove <user> <password>")
  console.log("Usage: node accounts.js account add <user>");
  console.log("Usage: node accounts.js account delete <user>");
  process.exit(1);
}

var delete_account = function(user) {
  if (accounts.remove(user)) {
    console.log("Account for User '%s' removed.", user);
  } else {
    console.log("Account for User '%s' does not exist.", user);
  }
}

var args = process.argv.slice(2);

if (args.length !== 3) {
  usage();
}

var command  = args[0];
var user     = args[1];
var password = args[2];

if (command === 'create') {
  passwords.associate(user, password);
  console.log("User '%s' now has password '%s'.", user, password);
  return;
}

if (command === 'check') {
  if (passwords.check(user, password)) {
    console.log("Password for User '%s' accepted.", user);
  } else {
    console.log("Password for User '%s' does not match.", user);
  };
  return;
}

if (command === 'remove') {
  if (passwords.remove(user, password)) {
    console.log("Password for User '%s' removed.", user);
  } else {
    console.log("Password for User '%s' does not match.", user);
    console.log("Operation cancelled.");
  };
  return;
}

if (command == 'account' && user == 'delete') {
  // password contains user name in this instance
  var account = password;

  delete_account(account);
  return;
}

if (command == 'account' && user == 'add') {
  // password contains user name in this instance
  var account = password

  if (accounts.user(account) !== undefined) {
    console.log("Account for User '%s' already exists.", account);
    return;
  }
  
  rl = readline.createInterface(process.stdin, process.stdout);
  rl.question('Enter Profile Name: ', function(answer) {
    var profile_name = answer.trim();
    rl.question('Admin? (yes/no): ', function(answer) {
      var admin = false;
      switch(answer.trim().toLowerCase()) {
        case 'yes':
          admin = true;
          break;
        default:
          admin = false;
          break;
      }
      var params = {}
      params['login'] = account;
      params['name']  = profile_name;
      params['admin'] = admin;
      accounts.create(params);

      console.log("Account for User '%s' created.", account);
      rl.close();
    });
  });
  return;
}

usage();
