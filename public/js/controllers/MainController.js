(function( define ) {
  "use strict";

  define([], function () {

    var MainController = function(Repository) {
      this.user = Repository.user;
    };

    return [ 'Repository', MainController ];

  });

} (define));
