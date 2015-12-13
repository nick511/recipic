
angular.module('app', ['ionic','ionic.service.core', 'ionic.service.analytics', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'angularMoment'])

.run(function($ionicPlatform, $ionicAnalytics, config) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $ionicAnalytics.register();

  });

  Parse.initialize(config.PARSE_APP_ID,  config.PARSE_JS_KEY);

});