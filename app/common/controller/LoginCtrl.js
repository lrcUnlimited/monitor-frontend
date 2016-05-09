/**
 * Created by li on 2016/5/4.
 */
var login = angular.module("monitor-frontend.loginModule", ['cgBusy'])
login.controller('LoginCtrl', function ($scope, $cookieStore, $timeout, $http, $location,$rootScope, $document) {
    $scope.userName = '';
    $scope.passWord = '';


    $scope.checkSubmit = function () {
        var msg = '请填写 :';
        var flag = 1;
        if ($scope.userName == '') {
            msg += '【帐号】';
            flag = 0;
        }

        if ($scope.passWord == '') {
            msg += ' 【密码】';
            flag = 0;
        }
        if (flag) {
            var data = {
                'userName': $scope.userName,
                'passWord': $scope.passWord,
            }


            $scope.loginPromise = $http.post("http://localhost:8080/monitor/user/e_login", data)
                .success(function (data) {
                    $cookieStore.put("USER_ID",data.id);
                    $cookieStore.put("USER_TYPE",data.type);
                    $cookieStore.put("USER_NAME",data.userName);
                    $location.path("/main");
                })
                .error(function (data) {
                    dialogBox(data.message);
                });
        } else {
            dialogBox(msg);
        }
    }

    function dialogBox(msg) {
        $.teninedialog({
            title: '<h3 style="font-weight:bold">系统提示</h3>',
            content: msg
        });
    };

})