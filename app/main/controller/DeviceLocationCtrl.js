/**
 * Created by Administrator on 2016/5/23 0023.
 */
var deviceLocationModule = angular.module("monitor-frontend.deviceLocationModule", ['cgBusy', 'ui.router']);
deviceLocationModule.controller("DeviceLocationCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter,$timeout,HTTP_BASE) {

    var accountId = $cookieStore.get("USER_ID");
    if (accountId) {
        $http.get(HTTP_BASE+'devicerecord/e_query?accountId=' + accountId + '&pageSize=8&pageNo=1&type=3') //file:///C:/Users/z/Desktop/testcode/brand/data/agentlist.json
            .success(function (data) {
                $scope.deviceRecordList = data.items;
                $scope.nowDeviceTotalCount=data.totalCount;

                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage,
                    bootstrapMajorVersion: 3,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadRecordPromise = $http.get(HTTP_BASE+'devicerecord/e_query?accountId=' + accountId + '&type=3&pageSize=8&pageNo=' + page)
                            .success(function (data) {
                                $scope.selectAll = false;
                                $scope.deviceRecordList = data.items;
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
        /**
         * 全选函数
         */
        $scope.selectAll = false;
        $scope.selectAllRow = function () {
            $scope.selectAll = !$scope.selectAll;
        }
        $scope.showAllSelect = function () {//上架函数
            var list = [];
            $("input[name='gridRow']:checked").each(function () {
                list.push(this.value)
            });
            if (list.length == 0) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: "请至少选择一个设备进行查看"
                });
                return;
            }
            var url = HTTP_BASE+'devicerecord/e_querylocation?accountId=' + accountId + '&deviceList=' + list;
            getDeviceGPSData(url);
        }

        $scope.loadCount = 1;
        //$scope.map = null;
        $scope.showNowPosition = function (deviceId, deviceName) {
            var list = [];
            list.push(deviceId);
            var url = HTTP_BASE+'devicerecord/e_querylocation?accountId=' + accountId + '&deviceList=' + list;
            getDeviceGPSData(url);
        }


        function getDeviceGPSData(url) {
            $http.get(url)
                .success(function (data) {
                    // 百度地图API功能
                    if (data.length != 0) {
                        console.log(data);
                        $('#modifyModal').modal('toggle');

                        $timeout(function(){
                            if (!$scope.map) {
                                $scope.map = new BMap.Map("map");
                            }

                            $scope.map.clearOverlays();
                            $scope.map.enableScrollWheelZoom(true);

                            $scope.map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 12);


                            var opts = {
                                width: 260,     // 信息窗口宽度
                                height: 90,     // 信息窗口高度
                                title: "设备采集信息", // 信息窗口标题
                                enableMessage: true//设置允许信息窗发送短息
                            };
                            for (var i = 0; i < data.length; i++) {
                                var marker = new BMap.Marker(new BMap.Point(data[i].longitude, data[i].latitude));  // 创建标注
                                var dateFilter = $filter('date');
                                var filteredDate = dateFilter(data[i].realTime, 'yyyy-MM-dd HH:mm:ss')//坐标采集时间
                                var deviceinfo = "<p style=’font-size:12px;lineheight:1.8em;’>名称：" + data[i].deviceName+"</br>设备有效期: "+dateFilter(data[i].validTime,'yyyy-MM-dd HH:mm:ss')
                                    + "</br>设备坐标：" + (data[i].latitude == undefined ? "" : "经度: " + data[i].latitude + " 纬度: " + data[i].longitude)
                                    + "</br> 采集时间：" + (filteredDate == undefined ? "" : filteredDate ) + "</br></p>";
                                $scope.map.addOverlay(marker);               // 将标注添加到地图中
                                addClickHandler(deviceinfo, marker);
                            }
                            function addClickHandler(content, marker) {
                                marker.addEventListener("click", function (e) {
                                        openInfo(content, e, $scope.map)
                                    }
                                );
                            }

                            function openInfo(content, e, map) {
                                var p = e.target;
                                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                                var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                                map.openInfoWindow(infoWindow, point); //开启信息窗口
                            }

                        },500);// 百度地图API功能
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

        //
        $scope.startTime = new Date("2000", '01', '1');
        $scope.endTime = new Date();
        //初始化日历控件
        $('#startdatepicker').datepicker({
            autoclose: true,
            todayHighlight: true
        }).on("changeDate", function (e) {
            $scope.startTime = e.date;
        })
        //初始化日历控件
        $('#enddatepicker').datepicker({
            autoclose: true,
            todayHighlight: true
        }).on("changeDate", function (e) {
            $scope.endTime = e.date;
        })

        $scope.deviceHistory = function (deviceId, deviceName) {

            $scope.myDeviceId = deviceId;
            $scope.myDeviceName = deviceName;
            $scope.historyMap = new BMap.Map("hisMap");
            $('#devicehistorymodal').modal('toggle');
        }
        $scope.getHisData = function () {
            if(typeof $scope.startTime==='string'){
                $scope.startTime=new Date(Date.parse($scope.startTime));

            }
            if(typeof $scope.endTime==='string'){
                $scope.endTime=new Date(Date.parse($scope.endTime));
            }
            console.log($scope.startTime);
            console.log($scope.endTime);

            $http.get(HTTP_BASE+'devicerecord/e_queryhistory?accountId=' + accountId + '&deviceId=' + $scope.myDeviceId + '&startTime=' + $scope.startTime.getTime() + '&endTime=' + $scope.endTime.getTime())
                .success(function (data) {

                    // 百度地图API功能
                    if (data.length > 0) {

                        $scope.historyMap.clearOverlays();
                        $scope.historyMap = new BMap.Map("hisMap");

                        $scope.historyMap.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 12);
                        $scope.historyMap.enableScrollWheelZoom(true);
                        var opts = {
                            width: 260,     // 信息窗口宽度
                            height: 90,     // 信息窗口高度
                            title: "设备采集信息", // 信息窗口标题
                            enableMessage: true//设置允许信息窗发送短息
                        };
                        for (var i = 0; i < data.length; i++) {
                            var marker = new BMap.Marker(new BMap.Point(data[i].longitude, data[i].latitude));  // 创建标注
                            var dateFilter = $filter('date');
                            var filteredDate = dateFilter(data[i].realTime, 'yyyy-MM-dd HH:mm:ss')//坐标采集时间
                            var deviceinfo = "<p style=’font-size:12px;lineheight:1.8em;’>名称：" + data[i].deviceName+"</br>设备有效期: "+dateFilter(data[i].validTime,'yyyy-MM-dd HH:mm:ss')
                                + "</br>设备坐标：" + (data[i].latitude == undefined ? "" : "经度: " + data[i].latitude + " 纬度" + data[i].longitude)
                                + "</br> 采集时间：" + (filteredDate == undefined ? "" : filteredDate ) + "</br></p>";
                            $scope.historyMap.addOverlay(marker);               // 将标注添加到地图中
                            addClickHandler(deviceinfo, marker);
                        }
                        function addClickHandler(content, marker) {
                            marker.addEventListener("click", function (e) {
                                    openInfo(content, e)
                                }
                            );
                        }

                        function openInfo(content, e) {
                            var p = e.target;
                            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                            var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                            $scope.historyMap.openInfoWindow(infoWindow, point); //开启信息窗口
                        }


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
        $scope.getDeviceHisDataById = function (deviceId, deviceName) {
            $scope.deviceHisRecordName = deviceName;
            $('#deviceHisModal').modal('toggle');
            $scope.deviceHisRecordList=null;
            $http.get(HTTP_BASE+'devicerecord/e_queryallhistory?&pageNo=1&pageSize=8&accountId=' + accountId + '&deviceId=' + deviceId)
                .success(function (data) {

                    $scope.deviceHisRecordList = data.items;

                    $('#page2').bootstrapPaginator({
                        currentPage: 1,
                        size: "normal",
                        totalPages: data.totalPage || 1,
                        bootstrapMajorVersion: 3,
                        numberOfPages: 5,
                        onPageClicked: function (e, originalEvent, type, page) {
                            console.log(page);
                            $scope.loadDeviceHisPromise=$http.get(HTTP_BASE+'devicerecord/e_queryallhistory?&pageNo=' + page + '&pageSize=8&accountId=' + accountId + '&deviceId=' + deviceId)
                                .success(function (data) {
                                    $scope.deviceHisRecordList = data.items;
                                }).error(function (data) {
                                    $.teninedialog({
                                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                                        content: data.message
                                    });
                                })
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
