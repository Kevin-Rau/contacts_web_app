(function( define ) {
  "use strict";

  define([], function () {

    var LoginController = function($location, $q, Repository) {

      var self = this;

      var reset = function() {
        self.user['login']    = '';
        self.user['password'] = '';
        self.error_message    = '';
      }

      var success = function(response) {
        reset();
        if (response.data.status) {
          $location.path('/');
        } else {
          self.error_message = response.data.message;
        }
        return true;
      }

      var error = function(response) {
        reset();
        if (response.status === 404) {
          self.error_message = 'Internal Error (404). Try again later.';
          return true; // handled error; return
        }
        $q.reject(response.data); // did not handle error; propagate
      }

      self.user  = {login: '', password: ''};
      self.error_message = '';

      self.login = function() {
        Repository.login(self.user).then(success, error);
      }
    };

    return [ '$location', '$q', 'Repository', LoginController ];

  });

} (define));
