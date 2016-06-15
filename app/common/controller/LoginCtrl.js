/**
 * Created by li on 2016/5/4.
 */
var login = angular.module("monitor-frontend.loginModule", ['cgBusy'])
login.controller('LoginCtrl', function ($scope, $cookieStore, $timeout, $http, $location,$rootScope, $document,HTTP_BASE) {
    $scope.userName = '';
    $scope.passWord = '';
    console.log(HTTP_BASE);


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


            $scope.loginPromise = $http.post(HTTP_BASE+"user/e_login", data)
                .success(function (data) {
                    console.log(data);
                    $cookieStore.put("USER_ID",data.id);
                    $cookieStore.put("USER_TYPE",data.type);
                    $cookieStore.put("USER_NAME",data.userName);
                    if(data.type==1){
                        $location.path("/main/devicelist");
                    }else{
                        $location.path("/main/devicelocation")
                    }
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