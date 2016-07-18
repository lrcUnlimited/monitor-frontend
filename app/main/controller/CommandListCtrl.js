/**
 * Created by li on 2016/5/4.
 */
var recordListModule = angular.module("monitor-frontend.commandListModule", ['cgBusy']);
recordListModule.controller("CommandListCtrl", function ($scope, $http, $cookieStore, $location,HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");

    $scope.pdtOnSale = new Array(true, false);
    if (accountId) {
            $scope.alreadyPdtList = function (t) {
                var i = 2;
                while (i >= 0) {
                    $scope.pdtOnSale[i] = false;
                    i--;
                }
                $scope.pdtOnSale[t] = true;
            }

        $scope.showListOne = function () {
            $("#listOne").css({
                "display": "block"
            })
            $("#listTwo").css({
                "display": "none"
            })
        }

        $scope.showListTwo = function () {
            $("#listTwo").css({
                "display": "block"
            })
            $("#listOne").css({
                "display": "none"
            })
        }
        function queryDataWithSearchParams(params) {
            $http.get(HTTP_BASE + 'commandrecord/e_query?accountId=' + accountId + '&pageSize=12&pageNo=1'+params) //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
                .success(function (data) {
                    $scope.commandRecordList = data.items;
                    $scope.commandTotalCount = data.totalCount;
                    $('#page1').bootstrapPaginator({
                        currentPage: 1,
                        size: "normal",
                        totalPages: data.totalPage,
                        bootstrapMajorVersion: 3,
                        onPageClicked: function (e, originalEvent, type, page) {
                            $scope.loadRecordPromise = $http.get(HTTP_BASE + 'commandrecord/e_query?accountId=' + accountId + '&pageSize=12&pageNo=' + page)
                                .success(function (data) {
                                    $scope.commandRecordList = data.items;
                                    $scope.commandTotalCount = data.totalCount;
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
        }
        $scope.searchUser="";
        $scope.searchType="";
        var initParams="&searchUser=&searchType=-1";
        queryDataWithSearchParams(initParams);
        $scope.searchCommand = function () {
            var params = "&searchUser=" + $scope.searchUser + "&searchType=" + $scope.searchType;
            console.log(params);
            queryDataWithSearchParams(params);


        }


    }

})
recordListModule.filter("operateNameFilter",function(){
    return function(type) {
        var operateName=null;
        if(type==0){
            operateName="用户管理操作";
        }else if(type==1){
            operateName="授权操作";

        }else if(type==2){
            operateName="设备管理操作";
        }
        else if(type==3){
            operateName="远程更新操作";
        }else{
            operateName="充值";

        }
        return operateName;
    };
})