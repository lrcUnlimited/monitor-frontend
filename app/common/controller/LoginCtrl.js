/**
 * Created by li on 2016/5/4.
 */
var login = angular.module("monitor-frontend.loginModule", ['cgBusy'])
login.controller('LoginCtrl', function ($scope, $cookieStore, $timeout, $http, $rootScope, $document) {
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
            $scope.loadingFlag = true;
            var data = {
                'userName': $scope.userName,
                'passWord': $scope.passWord,
            }

            $timeout(function () {
                $http.post("v1/login", data)
                    .success(function (response) {
                        if (response.meta.code == '401') {
                            $scope.loadingFlag = false;
                            switch (response.meta.status) {
                                case 101:
                                    dialogBox('您的账号登录过于频繁');
                                    break;
                                case 102:
                                    dialogBox('您的IP登录过于频繁');
                                    break;
                                case 103:
                                    dialogBox('登录失败,用户名或密码错误');
                                    break;
                                default :
                                    dialogBox('数据错误');

                            }
                        } else if (response.meta.code == '201') {
                            $cookieStore.put("USER_NAME", response.data.user_name);
                            $cookieStore.put("USER_ID", response.data.user_id);
                            $cookieStore.put("INVITE_CODE", response.data.invite_id);
                            $cookieStore.put("ROLE", response.data.role);
                            location.href = "index.html";
                        } else if (response.meta.code == '400') {
                            $scope.loadingFlag = false;
                            dialogBox('数据错误');
                        } else if (response.meta.code == '500') {
                            $scope.loadingFlag = false;
                            dialogBox('网络故障');
                        }
                    })
                    .error(function () {
                        $scope.loadingFlag = false;
                        dialogBox('内部服务器错误');
                    });
            }, 1000);


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