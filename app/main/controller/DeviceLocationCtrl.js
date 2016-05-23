/**
 * Created by Administrator on 2016/5/23 0023.
 */
var deviceLocationModule = angular.module("monitor-frontend.deviceLocationModule", ['cgBusy', 'ui.router']);
deviceLocationModule.controller("DeviceLocationCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state) {
    var accountId = $cookieStore.get("USER_ID");
    if (accountId) {
        $http.get('http://localhost:8080/monitor/devicerecord/e_query?accountId=' + accountId + '&pageSize=5&pageNo=1') //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.deviceRecordList = data.items;
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage,
                    bootstrapMajorVersion: 3,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadRecordPromise = $http.get('http://localhost:8080/monitor/devicerecord/e_query?accountId=' + accountId + '&pageSize=5&pageNo=' + page)
                            .success(function (data) {
                                $scope.deviceRecordList = data.items;
                            })
                    }
                })
            });

        //获取当前设备位置
        $scope.devicelocation = function (accountId,deviceId) {
            window.location.href = 'http://localhost:8080/monitor/devicerecord/e_querylocation?accountId='+accountId+'&deviceId='+deviceId;
        }
    }
})
