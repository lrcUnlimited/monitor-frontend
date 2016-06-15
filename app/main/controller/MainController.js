/**
 * Created by li on 2016/5/4.
 */
var mainModule = angular.module("monitor-frontend.mainModule", ['ngWebSocket']);
mainModule.controller("MainCtrl", function ($scope, $rootScope, $cookieStore, $location, $http, Messages, HTTP_BASE, $state) {
    var userId = $cookieStore.get("USER_ID");
    var userName = $cookieStore.get("USER_NAME");
    var accountType = $cookieStore.get("USER_TYPE");
    $scope.isActive = false;
    $scope.changeActive = function () {
        $scope.isActive = !$scope.isActive;
    }

    $scope.inOutClick = function () {
        if ($cookieStore.get("USER_ID") == null) {
            $location.path("/signin");
        } else {
            $.teninedialog({
                title: '<h3 style="font-weight:bold">系统提示</h3>',
                content: '退出 ?',
                showCloseButton: true,
                otherButtons: ["确定"],
                otherButtonStyles: ['btn-primary'],
                bootstrapModalOption: {
                    keyboard: true
                },
                clickButton: function (sender, modal, index) {
                    console.log("click")
                    $cookieStore.remove("USER_ID");
                    $cookieStore.remove("USER_NAME");
                    $cookieStore.remove("USER_TYPE");
                    $(this).closeDialog(modal);
                    $rootScope.$apply(function () {
                        $location.path("/signin");
                    });
                }
            });
        }
    }

    $scope.userName = userName;
    $scope.changeMyInfo = function () {
        $scope.myUserInfo = null;
        $http.get(HTTP_BASE + "user/e_getInfo?accountId=" + userId)
            .success(function (data) {
                $scope.myUserInfo = data;
                $('#modifyMyInfoModal').modal('toggle');

            })
            .error(function (data) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: data.message
                });
            })
    }
    $scope.changeUserInfo = function () {
        if (userId) {
            var data = {
                userName: $scope.myUserInfo.userName,
                userPhone: $scope.myUserInfo.userPhone,
                id: $scope.myUserInfo.id,
                passWord: $scope.myUserInfo.passWord,
                note: $scope.myUserInfo.note
            };
            console.log(data);
            $scope.changeUserInfoPromise = $http.post(HTTP_BASE + "user/e_updatePersonal?accountId=" + userId, data)
                .success(function (data) {
                    $.teninedialog({
                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                        content: '更新个人信息成功'
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
    if (userId) {
        if (accountType == 0) {
            $scope.showManage = false;
        } else {
            $scope.showManage = true;
        }
        console.log("something")
        /*
         $scope.Messages = Messages;
         $scope.collection = $scope.Messages.collection;
         $scope.$watchCollection('collection', function (newNames, oldNames) {
         $scope.dataCount = newNames.length;
         console.log($scope.dataCount);
         });
         */
    } else {
        $location.path("/signin");
    }

})