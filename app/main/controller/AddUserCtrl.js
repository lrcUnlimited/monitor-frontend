/**
 * Created by li on 2016/5/9.
 */
var addUserModule = angular.module("monitor-frontend.addUserModule", ['cgBusy'])
addUserModule.controller("AddUserCtrl", function ($scope, $location, $cookieStore, $http, $state) {
    var accountId = $cookieStore.get("USER_ID");
    var accountType = $cookieStore.get("USER_TYPE");

    $scope.addUser = function () {


        if (accountId && accountType == 1) {
            var data = {
                userName: $scope.userName,
                userPhone: $scope.userPhone,
                passWord: $scope.passWord,
                note: $scope.note
            };
            console.log(data);
            $scope.addUserPromise = $http.post("http://139.129.202.165:8080/monitor/user/e_add?accountId=" + accountId, data)
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

}).directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]).directive('userCheck', ['$cookieStore', '$http', '$timeout', function ($cookieStore, $http, $timeout) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var accountId = $cookieStore.get("USER_ID");
            elem.on('blur', function (evt) {
                scope.$apply(function () {

                    $http.get("http://139.129.202.165:8080/monitor/user/e_queryUser?accountId=" + accountId + '&userName=' + elem.val())
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

