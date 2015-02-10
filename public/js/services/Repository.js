(function( define ) {
  "use strict";

  define([], function () {

    var Repository = function($q, $http) {

      var service = {

        accounts: [],

        user: {login: '', name: '', admin: false},

        reset: function() {
          service.user['login'] = '';
          service.user['name']  = '';
          service.user['admin'] = false;
          service.accounts.length = 0;
        },

        set: function(data) {
          service.user['login'] = data.login;
          service.user['name']  = data.name;
          service.user['admin'] = data.admin;
        },

        logout: function() {
          service.reset();
        },

        login: function(credentials) {
          var deferred = $q.defer();
          $http.post("/api/1.0/login", credentials).then(
            function (response) {
              service.reset();
              var info = response.data;
              if (info.status) {
                service.set(info.data);
              }
              deferred.resolve(response);
            },
            function (error) {
              service.reset();
              deferred.reject(error);
            }
          );
          return deferred.promise;
        },

        create_account: function(account) {
          var data       = {};
          data["login"]  = service.user.login
          data["params"] = account;

          var deferred = $q.defer();
          $http.post("/api/1.0/users", data).then(
            function(response) {
              deferred.resolve(response);
            },
            function(error) {
              deferred.reject(error);
            }
          );
          return deferred.promise;
        },

        delete_account: function(login) {
          var data = {};
          data["login"] = login;

          var deferred = $q.defer();

          $http.post("/api/1.0/delete_user", data).then(
            function(response) {
              deferred.resolve(response);
            },
            function (error) {
              deferred.reject(error);
            }
          );

          return deferred.promise;
        },

        refresh_accounts: function() {
          service.accounts.length = 0;
          var deferred = $q.defer();
          $http.get("/api/1.0/users").then(
            function (response) {
              Array.prototype.push.apply(
                service.accounts,
                response.data.users);
              deferred.resolve(response);
            },
            function(error) {
              deferred.reject(error);
            }
          );
          return deferred.promise;
        }

      };

      return service;
    };

    return [ '$q', '$http', Repository ];

  });

} (define));
