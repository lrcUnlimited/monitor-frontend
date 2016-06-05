/**
 * Created by li on 2016/5/9.
 */
var addUserModule = angular.module("monitor-frontend.addUserModule", ['cgBusy'])
addUserModule.controller("AddUserCtrl", function ($scope, $location, $cookieStore, $http, $state,HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var accountType = $cookieStore.get("USER_TYPE");

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
})
