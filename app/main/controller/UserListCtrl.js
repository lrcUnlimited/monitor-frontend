/**
 * Created by li on 2016/5/4.
 */
var userListModule = angular.module("monitor-frontend.userListModule", ['cgBusy']);
userListModule.controller("UserListCtrl", function ($scope, $http, $cookieStore, $location,$state) {
    var accountId = $cookieStore.get("USER_ID");
    var accountType = $cookieStore.get("USER_TYPE");

    if (accountId && accountType == 1) {
        $http.get('http://139.129.202.165:8080/monitor/user/e_query?accountId=' + accountId + '&pageSize=5&pageNo=1') //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.userList = data.items;
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage,
                    bootstrapMajorVersion: 3,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadUserPromise = $http.get('http://139.129.202.165:8080/monitor/user/e_query?accountId=' + accountId + '&pageSize=5&pageNo=' + page)
                            .success(function (data) {
                                $scope.userList = data.items;
                            })
                    }
                })
            });
        //修改拓展员信息
        $scope.modify = function (userName, userPhone, note, accountId) {
            $scope.userName = userName;
            $scope.userPhone = userPhone;
            $scope.note = note;
            $scope.modifyUserId = accountId;
            $('#modifyModal').modal('toggle');
        }

        $scope.changeUserInfo = function () {
            if (accountId && accountType == 1) {
                var data = {
                    userName: $scope.userName,
                    userPhone: $scope.userPhone,
                    id:$scope.modifyUserId,
                    note: $scope.note
                };
                console.log(data);
                $scope.addUserPromise = $http.post("http://139.129.202.165:8080/monitor/user/e_update?accountId=" + accountId, data)
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
    }
})