/**
 * Created by li on 2017/9/13.
 */
/**
 * Created by li on 2016/5/4.
 */
var problem = angular.module("monitor-frontend.problemModule", ['cgBusy'])
problem.controller('ProblemCtrl', function ($scope, $cookieStore, $timeout, $http, $location,$rootScope, $document,HTTP_BASE) {
    $scope.userName = '';
    $scope.passWord = '';
    console.log(HTTP_BASE);
    var E = window.wangEditor
    var editor = new E('#editor')
    // 或者 var editor = new E( document.getElementById('#editor') )
    editor.create();
    $scope.setProblemContent=function(){
        console.log(editor.txt.html());
        $scope.problemContent=editor.txt.html();
    }



})