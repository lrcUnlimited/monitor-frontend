/**
 * Created by li on 2016/5/4.
 */
var testModule = angular.module("monitor-frontend.testModule", ['ngWebSocket']);
testModule.controller("TestCtrl", function ($scope, $cookieStore,Messages) {
    $scope.sendMessage=function(){
        Messages.send($scope.message);
    }

})