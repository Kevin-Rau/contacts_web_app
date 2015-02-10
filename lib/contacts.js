var fs       = require('fs');
var printf   = require('sprintf-js').sprintf;

var template = "var db = %s;\n\nexports.db = db;\n"

var config = {
  db: './contacts.db',
  db_path: './lib/contacts.db'
};

var db = require(config.db).db;

var flush_db = function(data) {
  var output = printf(template, JSON.stringify(data));
  fs.writeFileSync(config.db_path, output);
}

var available_contacts = function(login) {
  var contacts = db[login];
  var results  = [];

  if (contacts === undefined) {
    return [];
  }

  contacts.forEach(function(contact) {
    results.push({name: contact.name, id: contact.id});
  });

  return results;
}

var create_contact = function(login, params) {
  if (!db.hasOwnProperty(login)) {
    db[login] = [];
  }
  var contacts = db[login];

  new_contact = {};
  new_contact["id"]        = contacts.length;
  new_contact["name"]      = params["name"];
  new_contact["birthdate"] = params["birthdate"];
  new_contact["email"]     = params["email"];
  new_contact["phone"]     = params["phone"];
  new_contact["twitter"]   = params["twitter"];

  contacts.push(new_contact);

  flush_db(db);

  return new_contact;

}

var delete_contact = function(login, index) {

  var contacts = db[login];

  if (contacts === undefined) {
    return false;
  }

  var contact = contacts[index];

  if (contact === undefined) {
    return false;
  } 

  contacts.splice(index, 1);

  flush_db(db);

  return true;

}

var get_contact = function(login, index) {
  var contacts = db[login];

  if (contacts === undefined) {
    return undefined;
  }

  return contacts[index];

}

var contacts_are_equal = function(a, b) {
  if (a.id !== b.id) {
    return false
  }
  if (a.name !== b.name) {
    return false
  }
  if (a.phone !== b.phone) {
    return false
  }
  if (a.email !== b.email) {
    return false
  }
  if (a.twitter !== b.twitter) {
    return false
  }
  if (a.phone !== b.phone) {
    return false
  }
  return true;
}

var update = function(login, index, expected, updated) {
  var actual = get_contact(login, index);

  if (actual === undefined) {
    return false;
  }

  if (contacts_are_equal(actual, expected)) {
    db[login][index] = updated;
    flush_db(db);
    return true;
  }

  return false;
}

var contains = function(contact, query) {
  var q = query.toLowerCase();
  return Object.keys(contact).some(function (key) {
    if (key !== "id") {
      var value = contact[key].toLowerCase();
      return value.indexOf(q) !== -1;
    }
  });
}

var find = function(query) {
  var contacts = db[login];

  if (contacts === undefined) {
    return [];
  }

  return contacts.filter(function(contact) {
    return contains(contact, query);
  });

}

var upcoming_birthday = function(contact, current_date) {
  if (current_date === undefined) {
    current_date = new Date();
  } else {
    current_date = new Date(current_date);
  }
  month = current_date.getMonth() + 1;
  next_months = [month, month+1, month+2]
  next_months = next_months.map(function(element) {
    return element >= 13 ? element - 12 : element;
  });
  is_there_a_match = next_months.filter(
    function(month) {
      var bday      = new Date(contact.birthdate);
      var bdaymonth = bday.getMonth() + 1;
      return (bdaymonth === month);
    }
  );
  return is_there_a_match.length == 1
}

var birthdays = function(date) {
  var contacts = db[login];

  if (contacts === undefined) {
    return [];
  }

  var items = contacts.filter(function(contact) {
    return upcoming_birthday(contact, date);
  });
  return items;
}

exports.available_contacts = available_contacts;
exports.create_contact     = create_contact;
exports.delete_contact     = delete_contact;
exports.get_contact        = get_contact;
exports.find_contacts      = find;
exports.update_contact     = update;
exports.birthdays          = birthdays;
