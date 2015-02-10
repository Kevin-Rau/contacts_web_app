(function ( define ) {
  "use strict";

  define(['angular',
          'ngRoute',
          'services/Repository',
          'routes',
          'controllers',
      ],
      function ( angular, ngRoute, Repository, routes, controllers ) {
        var appName = 'contactsApp';

        var app =
          angular.module( appName, [ "ngRoute", controllers])
            .factory( "Repository", Repository )
            .config( routes );

        angular.bootstrap( document.getElementsByTagName("html")[0], [ appName ]);

        return app;
      }
  );

}( define ));
