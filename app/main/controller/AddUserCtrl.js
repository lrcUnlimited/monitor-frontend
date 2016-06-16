/**
 * Created by li on 2016/5/9.
 */
var addUserModule = angular.module("monitor-frontend.addUserModule", ['cgBusy'])
addUserModule.controller("AddUserCtrl", function ($scope, $location, $cookieStore, $http, $state,HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var accountType = $cookieStore.get("USER_TYPE");
    $scope.userName="";

    $scope.userType = 0;
    $scope.addUser = function () {
        if (accountId && accountType == 1) {
            var data = {
                userName: $scope.userName,
                userPhone: $scope.userPhone,
                passWord: $scope.passWord,
                note: $scope.note,
                type: $scope.userType
            };
            console.log(data);
            if(data.userName){
                if($scope.useradd.userName.$error.userUnique){
                    dialogShow("请重新输入用户名");
                    return;
                }
            }else{
                dialogShow("请重新输入用户名");
                return ;
            }
            if(data.userPhone){
                if($scope.useradd.userPhone.$error.pattern){
                    dialogShow("请输入正确的电话号码");
                    return ;
                }
            }else{
                dialogShow("请输入正确的电话号码");
                return ;
            }
            if(data.passWord){
                if($scope.useradd.pw2.$error.pwmatch){
                    dialogShow("两次密码不匹配");
                    return;
                }
            }else{
                dialogShow("请输入密码");
                return;
            }
            if(data.note){
                if(data.note.length>20){
                    dialogShow("备注长度太大");
                    return;
                }
            }else{
                dialogShow("请输入备注");
                return;
            }
            $scope.addUserPromise = $http.post(HTTP_BASE+"user/e_add?accountId=" + accountId, data)
                .success(function (data) {

                    $.teninedialog({
                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                        content: '添加用户成功',
                        dialogShown: function () {
                            setTimeout(function () {
                                $state.go('main.userlist', {}, {reload: true})
                            }, 200)
                        }
                    })
                })
                .error(function (data) {
                    $.teninedialog({
                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                        content: data.message
                    });
                })


        }

    }
    function dialogShow(msg){
        $.teninedialog({
            title: '<h3 style="font-weight:bold">系统提示</h3>',
            content: msg
        })
    }

}).directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $("#passWord").val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]).directive('userCheck', ['$cookieStore', '$http', '$timeout', 'HTTP_BASE',function ($cookieStore, $http, $timeout,HTTP_BASE) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var accountId = $cookieStore.get("USER_ID");
            elem.on('blur', function (evt) {
                scope.$apply(function () {

                    $http.get(HTTP_BASE+"user/e_queryUser?accountId=" + accountId + '&userName=' + elem.val())
                        .success(function (data) {
                            if (data) {
                                ctrl.$setValidity('userUnique', false);
                            } else {
                                ctrl.$setValidity('userUnique', true);
                            }
                        })
                        .error(function (data) {
                            $.teninedialog({
                                title: '<h3 style="font-weight:bold">系统提示</h3>',
                                content: data.message
                            });
                        })


                });
            })
        }
    }
}]);

