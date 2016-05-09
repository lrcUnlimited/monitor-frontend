/**
 * Created by li on 2016/5/9.
 */
var addUserModule = angular.module("monitor-frontend.addUserModule", ["cgBusy"])
addUserModule.controller("AddUserCtrl", function ($scope, $location, $http) {
    var accountId=$cookieStore.get("USER_ID");
    var accountType=$cookieStore.get("USER_TYPE");
    
    $scope.addUser = function () {

    }
})