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
    "monitor-frontend.userListModule",
    "monitor-frontend.loginModule",
    "monitor-frontend.addUserModule",
    "monitor-frontend.commandListModule",
    "monitor-frontend.addDeviceModule",
    "monitor-frontend.deviceListModule"
]);

myApp.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1

    //
    // Now set up the states
    $stateProvider
        .state('signin', {
            url: "/signin",
            templateUrl: "../partials/signin.html",
            controller: "LoginCtrl"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "../partials/signup.html",
        })
        .state('main', {
            url: "/main",
            templateUrl: "../partials/main.html",
            controller: "MainCtrl"
        })
        .state('main.userlist', {
            url: "/userlist",
            templateUrl: "../partials/main.userlist.html",
            controller: "UserListCtrl"

        })
        .state('main.adduser', {
            url: "/adduser",
            templateUrl: "../partials/main.adduser.html",
            controller: "AddUserCtrl"
        }).state('main.commandList', {
            url: "/commandList",
            templateUrl: "../partials/main.commandList.html",
            controller: "CommandListCtrl"
        }).state('main.adddevice', {
            url: "/adddevice",
            templateUrl: "../partials/main.adddevice.html",
            controller: "AddDeviceCtrl"
        }).state('main.devicelist', {
            url: "/devicelist",
            templateUrl: "../partials/main.devicelist.html",
            controller: "DeviceListCtrl"
        });
}).directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var oldNgClick = attrs.ngClick;
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (value) {
                if (value) {
                    element.attr("disabled", "disabled");

                } else {

                    element.removeAttr("disabled");

                }
            });
        }
    };

}]);
;