/**
 * Created by li on 2016/5/3.
 */
var myApp = angular.module('monitor-frontend', [
    'ui.router',
    'ngCookies',
    'ngWebSocket',
    'cgBusy',
    'monitor-frontend.webSocketService',
    "monitor-frontend.mainModule",
    "monitor-frontend.testModule",
    "monitor-frontend.loginModule"
]);
myApp.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1

    //
    // Now set up the states
    $stateProvider
        .state('signin', {
            url: "/signin",
            templateUrl: "../partials/signin.html",
            controller:"LoginCtrl"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "../partials/signup.html",
        })
        .state('main', {
            url: "/main",
            templateUrl: "../partials/main.html",
            controller:"MainCtrl"
        })
        .state('main.test', {
            url: "/test",
            templateUrl: "../partials/main.test.html",
            controller:"TestCtrl"

        });
});