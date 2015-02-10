(function ( define ) {
  "use strict";

  define([
    'angular',
    'ngRoute',
    'controllers/AccountsController',
    'controllers/LoginController',
    'controllers/LogoutController',
    'controllers/MainController',
    'controllers/NewAccountController',
    'services/Repository'
  ], function ( angular, ngRoute, AccountsController, LoginController, LogoutController, MainController, NewAccountController, Repository ) {
    var Routes = function ( $routeProvider ) {
      $routeProvider.when('/', {
        templateUrl: 'views/landing.html',
        controller: 'MainController as mc'
      }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController as lc'
      }).when('/logout', {
        templateUrl: 'views/logout.html',
        resolve: {
          name: ['Repository', function(Repository) {
            if (Repository.user.name === '') {
              throw "Not Logged In";
            }
            var name = Repository.user.name;
            Repository.logout();
            return name;
          }]
        },
        controller: 'LogoutController as lc'
      }).when('/users', {
        templateUrl: 'views/users.html',
        controller: 'AccountsController as ac',
        resolve: {
          verify: ['Repository', function(Repository) {
            if (Repository.user.admin === false) {
              throw "Not authorized";
            }
            return true;
          }],
          users: ['Repository', function(Repository) {
            Repository.refresh_accounts();
            return true;
          }]
        }
      }).when('/user', {
        templateUrl: 'views/user.html',
        controller: 'NewAccountController as nac',
        resolve: {
          verify: ['Repository', function(Repository) {
            if (Repository.user.admin === false) {
              throw "Not authorized";
            }
            return true;
          }]
        }
      }).when('/delete_user/:login', {
        redirectTo: '/users',
        resolve: {
          delete: ['Repository', '$route', function(Repository, $route) {
            return Repository.delete_account($route.current.params.login);
          }]
        }
      }).otherwise({
        redirectTo: '/'
      });
    };

    return ["$routeProvider", Routes ];
  });

}( define ));
