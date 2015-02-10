(function ( require ) {
  "use strict";

  requirejs.config({
    paths: {
      bootstrap: "vendors/bootstrap/dist/js/bootstrap",
      angular  : "vendors/angular/angular",
      ngRoute  : "vendors/angular-route/angular-route",
      jquery   : "vendors/jquery/dist/jquery"
    },
    shim: {
      'angular'  : { deps: ['jquery'], exports: 'angular' },
      'bootstrap': { deps: ['jquery'] },
      'ngRoute'  : { deps: ['angular'] }
    }
  });

  require( ["angular", "app"], function( app ) {
    console.log("Contacts App has loaded.");
  });

}( require ));
