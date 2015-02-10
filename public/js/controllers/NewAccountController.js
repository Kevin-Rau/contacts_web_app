(function( define ) {
  "use strict";

  define(['angular'], function (angular) {

    var NewAccountController = function($location, $q, Repository) {

      var self = this;

      self.user          = {login: '', name: '', password: '', password2: '', admin: false};
      self.error_message = '';

      self.password_updated = function(form) {
        if (self.user.password === self.user.password2) {
          form.pw1.$setValidity("pwmatch", true);
          form.pw2.$setValidity("pwmatch", true);
        } else {
          form.pw1.$setValidity("pwmatch", false);
          form.pw2.$setValidity("pwmatch", false);
        }
      }

      self.check_username = function(form) {
        var accounts = Repository.accounts;
        var logins   = accounts.map(function(entry) { return entry.login; });
        var index    = logins.indexOf(self.user.login);

        if (index === -1) {
          form.login.$setValidity("login", true);
        } else {
          form.login.$setValidity("login", false);
        }
      };

      var reset = function() {
        self.user['login']     = '';
        self.user['name']      = '';
        self.user['password']  = '';
        self.user['password2'] = '';
        self.user['admin']     = false;
        self.error_message     = '';
      }

      var success = function(response) {
        reset();
        if (response.data.status) {
          $location.path('/users');
        } else {
          self.error_message = response.data.message;
        }
        return true;
      };

      var error = function(response) {
        reset();
        $q.reject(response.data);
      }

      self.create_account = function() {
        Repository.create_account(self.user).then(success, error);
      };
    };

    return [ '$location', '$q', 'Repository', NewAccountController ];

  });

} (define));
