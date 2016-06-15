/**
 * Created by li on 2016/5/4.
 */
var userListModule = angular.module("monitor-frontend.userListModule", ['cgBusy']);
userListModule.controller("UserListCtrl", function ($scope, $http, $cookieStore, $location, $state, HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var accountType = $cookieStore.get("USER_TYPE");

    if (accountId && accountType == 1) {
        $http.get(HTTP_BASE + 'user/e_query?accountId=' + accountId + '&pageSize=8&pageNo=1') //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.userList = data.items;
                console.log(data.items);
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage,
                    bootstrapMajorVersion: 3,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadUserPromise = $http.get(HTTP_BASE + 'user/e_query?accountId=' + accountId + '&pageSize=8&pageNo=' + page)
                            .success(function (data) {
                                $scope.userList = data.items;
                            }).error(function (data) {
                                $.teninedialog({
                                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                                    content: data.message
                                });
                            })
                    }
                })
            }).error(function (data) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: data.message
                });
            });
        //修改拓展员信息
        $scope.modify = function (userName, userPhone, note, accountId,type,passWord) {
            $scope.userName = userName;
            $scope.userPhone = userPhone;
            $scope.note = note;
            $scope.modifyUserType=type;
            $scope.modifyUserPassWord=passWord;
            $scope.modifyUserId = accountId;
            $('#modifyModal').modal('toggle');
        }

        $scope.changeUserInfo = function () {
            if (accountId && accountType == 1) {
                var data = {
                    userName: $scope.userName,
                    userPhone: $scope.userPhone,
                    id: $scope.modifyUserId,
                    type:$scope.modifyUserType,
                    passWord:$scope.modifyUserPassWord,
                    note: $scope.note
                };
                console.log(data);
                $scope.addUserPromise = $http.post(HTTP_BASE + "user/e_update?accountId=" + accountId, data)
                    .success(function (data) {
                        $.teninedialog({
                            title: '<h3 style="font-weight:bold">系统提示</h3>',
                            content: '更新用户信息成功',
                            dialogShown: function () {
                                setTimeout(function () {
                                    $state.go($state.current, {}, {reload: true})
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
        $scope.deleteUser=function(delAccountId){
            $.teninedialog({
                title: '<h3 style="font-weight:bold">系统提示</h3>',
                content: '确认删除该用户 ?',
                showCloseButton: true,
                otherButtons: ["确定"],
                otherButtonStyles: ['btn-primary'],
                bootstrapModalOption: {
                    keyboard: true
                },
                clickButton: function(sender, modal, index) {
                    $(this).closeDialog(modal);

                    $http.get(HTTP_BASE + 'user/e_delete?accountId=' + accountId + '&delAccountId='+delAccountId)
                        .success(function (data) {
                            $.teninedialog({
                                title: '<h3 style="font-weight:bold">系统提示</h3>',
                                content: '删除用户成功',
                                dialogShown: function () {
                                    setTimeout(function () {
                                        $state.go($state.current, {}, {reload: true})
                                    }, 200)
                                }
                            })

                        }).error(function(data){
                            $.teninedialog({
                                title: '<h3 style="font-weight:bold">系统提示</h3>',
                                content: data.message
                            })
                        })

                }
            })

        }
    }
}).filter('userTypeFilter', function () {
    return function (type) {
        if (type == 0) {
            return "普通用户";
        } else {
            return "管理员";
        }
    }
})