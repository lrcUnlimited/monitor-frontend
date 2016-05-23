/**
 * Created by Administrator on 2016/5/23 0023.
 */
var deviceLocationModule = angular.module("monitor-frontend.deviceLocationModule", ['cgBusy', 'ui.router']);
deviceLocationModule.controller("DeviceLocationCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter) {
    var accountId = $cookieStore.get("USER_ID");
    if (accountId) {

        $http.get('http://localhost:8080/monitor/devicerecord/e_query?accountId=' + accountId + '&pageSize=5&pageNo=1&type=3') //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.deviceRecordList = data.items;
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage,
                    bootstrapMajorVersion: 3,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadRecordPromise = $http.get('http://localhost:8080/monitor/devicerecord/e_query?accountId=' + accountId + '&type=3&pageSize=5&pageNo=' + page)
                            .success(function (data) {
                                $scope.deviceRecordList = data.items;
                            })
                    }
                })
            });
        $scope.map = null;
        $scope.showNowPosition = function (deviceId, deviceName) {
            $http.get('http://localhost:8080/monitor/devicerecord/e_querylocation?accountId=' + accountId + '&deviceId=' + deviceId)
                .success(function (data) {
                    $scope.showLocationDevice = data;
                    // 百度地图API功能
                    if (data) {
                        if ($scope.map == null) {
                            $scope.map = new BMap.Map("map");
                        }
                        $scope.map.clearOverlays();
                        $scope.showLocationDeviceName = data.deviceName;
                        $scope.map.enableScrollWheelZoom(true);
                        var dateFilter = $filter('date');
                        var filteredDate = dateFilter(data.realTime, 'yyyy-MM-dd HH:mm:ss')//坐标采集时间
                        var point = new BMap.Point(data.longitude, data.latitude);
                        $scope.map.centerAndZoom(point, 50);
                        $scope.map.panBy(305, 165);//居中
                        var marker = new BMap.Marker(point);  // 创建标注
                        $scope.deviceinfo = new window.BMap.InfoWindow("<p style=’font-size:12px;lineheight:1.8em;’>名称：" + data.deviceName
                            + "</br>设备坐标：" + (data.latitude == undefined ? "" : "经度: "+data.latitude+" 纬度"+data.longitude)
                            + "</br> 采集时间：" + (filteredDate == undefined ? "" : filteredDate ) + "</br></p>");
                        $scope.map.addOverlay(marker);        // 将标注添加到地图中

                        // 鼠标移到坐标点显示信息框
                        marker.addEventListener("mouseover", function () {
                            this.openInfoWindow($scope.deviceinfo);
                        });
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                        $('#modifyModal').modal('toggle');

                    } else {
                        $.teninedialog({
                            title: '<h3 style="font-weight:bold">系统提示</h3>',
                            content: "暂时没有数据"
                        });
                    }
                })
                .error(function (data) {
                    $.teninedialog({
                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                        content: data.message
                    });
                });
        }
    }
})
