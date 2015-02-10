(function( define ) {
  "use strict";

  define(['angular'], function (angular) {

    var AccountsController = function(Repository) {
      this.accounts = Repository.accounts;
    };

    return [ 'Repository', AccountsController ];

  });

} (define));
