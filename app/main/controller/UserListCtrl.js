/**
 * Created by li on 2016/5/4.
 */
var userListModule = angular.module("monitor-frontend.userListModule", ['cgBusy']);
userListModule.controller("UserListCtrl", function ($scope, $http, $cookieStore, $location, $state,$filter, HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var accountType = $cookieStore.get("USER_TYPE");
    $scope.dateFilter=$filter('date');

    if (accountId && accountType == 1) {

        $http.get(HTTP_BASE + 'user/e_query?accountId=' + accountId + '&pageSize=8&pageNo=1') //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.userList = data.items;
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
        $http.get(HTTP_BASE + 'user/e_queryAll?accountId=' + accountId) //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.printUserList = data;
                console.log($scope.printUserList);
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
        //设备打印
        function convertJsonToArray(jsonArray) {
            var users_array = [];
            for (var i in jsonArray) {
                var user = jsonArray[i];
                var user_array = [];
                var index = 0;
                for (var j in user) {
                    if(j=='userName'||j=='note'){
                        user_array[index++]=lineWrap(user[j],7);
                    }
                    if(j=='userPhone'){
                        user_array[index++]=user[j];
                    }
                    if(j=='type'){
                        if(user[j]==0){
                            user_array[index++]='普通用户';
                        }else{
                            user_array[index++]='管理员';
                        }
                    }
                    if(j=='registerDate'){
                        user_array[index++]=$scope.dateFilter(user[j], 'yyyy-MM-dd HH:mm:ss')//坐标采
                    }
                }
                users_array.push(user_array);
            }
            return users_array;
        }
        //打印换行控制函数
        function lineWrap(data,partLen){
            if(data==null||data.length==0){
                return '暂无数据';
            }
            if(data.length<=6){
                return data;
            }
            var index=data.length/partLen;
            var i=0;
            var newStr=[];
            while(i<index){
                newStr.push(data.substr(i*partLen,partLen));
                i++;
            }
            return newStr.join('\n');
        }

        $scope.printData=function(){
            var printData=convertJsonToArray($scope.printUserList);

            printData.unshift(['用户名','注册时间','用户电话','备注','用户类型'])

            pdfMake.fonts={
                msyh: {
                    normal: 'msyh.ttf'
                }
            }
            var docDefinition = {
                styles: {
                    header: {
                        fontSize: 22,
                        alignment: 'center'
                    }
                },
                header: {
                    columns: [
                        { text: "用户列表", alignment: 'center' }
                    ]
                },
                footer: {
                    columns: [
                        { text: '打印时间:'+$scope.dateFilter(new Date(),'yyyy-MM-dd HH:mm:ss'), alignment: 'center' }
                    ]
                },
                content: [
                    {
                        table: {
                            headerRows: 1,
                            widths: [ 100, 'auto','auto',100,50],
                            body:printData
                        }
                    }
                ],
                defaultStyle: {
                    font: 'msyh'
                }
            };        // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();
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