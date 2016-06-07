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
    "monitor-frontend.deviceListModule",
    "monitor-frontend.deviceLocationModule"
]);

myApp.constant('HTTP_BASE', 'http://localhost:8080/monitor/')
    .config(function ($stateProvider, $urlRouterProvider) {
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
            }).state('main.devicelocation', {
                url: "/devicelocation",
                templateUrl: "../partials/main.devicelocation.html",
                controller: "DeviceLocationCtrl",
                cache: false
            });
    }).factory('authHttpResponseInterceptor', ['$rootScope', '$q', '$location', '$cookieStore', function ($rootScope, $q, $location, $cookieStore) {
        //拦截器配置
        return {

            responseError: function (rejection) {
                if (rejection.status == 412) {
                    console.log(rejection.data.message);
                    if (rejection.data !== null && (rejection.data.message == "请重新登录"||rejection.data.message=="请重新登陆")) {
                        console.log("remove");
                        $cookieStore.remove("USER_ID");
                        $cookieStore.remove("USER_NAME");
                        $cookieStore.remove("USER_TYPE");
                        $location.path("/signin");
                    }
                }
                return $q.reject(rejection);
            }
        };
    }]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }]).directive('loading', ['$http', function ($http) {
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
