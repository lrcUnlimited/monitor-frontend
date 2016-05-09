/**
 * Created by li on 2016/5/4.
 */
var mainModule = angular.module("monitor-frontend.mainModule", ['ngWebSocket']);
mainModule.controller("MainCtrl", function ($scope, $cookieStore, Messages) {
    var userId = $cookieStore.get("USER_ID");
    var userName=$cookieStore.get("USER_NAME");
    $scope.userName=userName;
    if (userId) {
        console.log("something")
        $scope.Messages = Messages;
        console.log($scope.Messages.status());
        $scope.collection = $scope.Messages.collection;
        $scope.$watchCollection('collection', function (newNames, oldNames) {
            $scope.dataCount = newNames.length;
            console.log($scope.dataCount);
        });
    }

})