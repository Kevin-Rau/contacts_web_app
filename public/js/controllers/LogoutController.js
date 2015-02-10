(function( define ) {
  "use strict";

  define(["angular"], function (angular) {

    var LogoutController = function(name) {
      this.name = name;
    };

    return [ 'name', LogoutController ];

  });

} (define));
