/**
 * Created by li on 2016/5/15.
 */
/**
 * Created by li on 2016/5/4.
 */
var deviceListModule = angular.module("monitor-frontend.deviceListModule", ['cgBusy', 'ui.router']);
deviceListModule.controller("DeviceListCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state,HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    $scope.pdtOnSale = new Array(true, false, false);
    $scope.deviceMangeName = "关闭";
    $scope.deviceManageType = 0;

    $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&pageSize=5&pageNo=1')
        .success(function (data) {
            $scope.deviceList = data.items;
            $('#page1').bootstrapPaginator({
                currentPage: 1,
                size: "normal",
                totalPages: data.totalPage,
                bootstrapMajorVersion: 3,
                onPageClicked: function (e, originalEvent, type, page) {
                    $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&pageSize=5&pageNo=' + page)
                        .success(function (data) {
                            $scope.deviceList = data.items;
                        })
                }
            })
        })


    $scope.allPdtList = function (t) {
        var i = 2;
        while (i >= 0) {
            $scope.pdtOnSale[i] = false;
            i--;
        }
        $scope.pdtOnSale[t] = true;
        $scope.deviceMangeName = "关闭";
        $scope.deviceManageType = 0;
        $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&pageSize=5&pageNo=1')
            .success(function (data) {
                $scope.deviceList = data.items;
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage || 1,
                    bootstrapMajorVersion: 3,
                    numberOfPages: 5,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&pageSize=5&pageNo=' + page)
                            .success(function (data) {
                                $scope.deviceList = data.items;
                            })
                    }
                })

            })
    }
    $scope.alreadyOnList = function (t) {   //过期设备
        var i = 2;
        $scope.selectAll = false;

        while (i >= 0) {
            $scope.pdtOnSale[i] = false;
            i--;
        }
        $scope.pdtOnSale[t] = true;
        $scope.deviceMangeName = "关闭";
        $scope.deviceManageType = 0;
        $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&type=1&pageSize=5&pageNo=1')
            .success(function (data) {
                $scope.deviceList = data.items;
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage || 1,
                    bootstrapMajorVersion: 3,
                    numberOfPages: 5,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&type=1&pageSize=5&pageNo=' + page)
                            .success(function (data) {
                                $scope.deviceList = data.items;
                            })
                    }
                })
            })
    }
    $scope.alreadyOffList = function (t) {   //已下架
        $scope.selectAll = false;

        var i = 2;
        while (i >= 0) {
            $scope.pdtOnSale[i] = false;
            i--;
        }
        $scope.showAll = true;
        $scope.pdtOnSale[t] = true;
        $scope.deviceMangeName = "开启";
        $scope.deviceManageType = 1;
        $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&type=2&pageSize=5&pageNo=1')
            .success(function (data) {
                $scope.deviceList = data.items;
                $('#page1').bootstrapPaginator({
                    currentPage: 1,
                    size: "normal",
                    totalPages: data.totalPage || 1,
                    bootstrapMajorVersion: 3,
                    numberOfPages: 5,
                    onPageClicked: function (e, originalEvent, type, page) {
                        $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_query?accountId=' + accountId + '&type=2&pageSize=5&pageNo=' + page)
                            .success(function (data) {
                                $scope.deviceList = data.items;
                            })
                    }
                })
            })
    }
    //初始化日历控件
    $('#datepicker').datepicker({
        autoclose: true,
        startDate: new Date(),
        todayHighlight: true
    }).on("changeDate", function (e) {
        $scope.modifyDeviceValidTime = e.date;
    })
    //增加期限弹出框
    $scope.modify = function (deviceId, deviceName, validTime) {
        $scope.modifyDeviceId = deviceId;
        $scope.modifyDeviceName = deviceName;
        $scope.modifyNowValidTime = validTime
        $scope.modifyDeviceValidTime = validTime;
        $scope.modifyType = 0;//增加期限
        $('#modifyModal').modal('toggle');
    }


    //更改设备的管理状态
    $scope.changeDeviceManageStatus = function (deviceId, deviceName, validTime) {
        if ($scope.deviceManageType == 0) {
            //关闭设备
            changeDeviceStatus($scope.deviceManageType, 0, deviceId, accountId, validTime);

        } else {
            //开启设备
            //设备没有过期,直接进行开启
            if (validTime > new Date()) {
                changeDeviceStatus($scope.deviceManageType, 0, deviceId, accountId, validTime);

            } else {
                $scope.modifyDeviceId = deviceId;
                $scope.modifyDeviceName = deviceName;
                $scope.modifyNowValidTime = validTime;
                $scope.modifyDeviceValidTime = validTime;
                $scope.modifyType = 1;//修改设备状态
                //如果是更改过期设备的状态，则需要进行更新设备有效期，再进行更改
                $('#modifyModal').modal('toggle');
            }

        }

    }
    $scope.changeDevice = function () {
        if ($scope.modifyType == 0) {
            console.log("修改有效期");
            if ($scope.modifyNowValidTime >= $scope.modifyDeviceValidTime) {
                //选择的日期小于当前的设备期限
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: '不能小于当前有效期'
                })


            } else {
                //只增加有效期
                $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_updateValidTime?accountId=' + accountId + '&deviceId=' + $scope.modifyDeviceId + '&modifyDeviceValidTime=' + $scope.modifyDeviceValidTime.getTime())
                    .success(function (data) {
                        $.teninedialog({
                            title: '<h3 style="font-weight:bold">系统提示</h3>',
                            content: '更新设备日期成功',
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
                    });
            }

        } else {
            //增加有效期的同时更新设备的状态
            console.log("增加设备有效期和状态");
            changeDeviceStatus($scope.modifyType, 1, $scope.modifyDeviceId, accountId, $scope.modifyDeviceValidTime.getTime());


        }

    }
    function changeDeviceStatus(status, changeType, deviceId, accountId, validTime) {
        $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_updateManageStatus?accountId=' + accountId + '&deviceId=' + deviceId + '&modifyDeviceValidTime=' + validTime + '&status=' + status + '&changeType=' + changeType)
            .success(function (data) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: '更新设备状态成功',
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
            });
    }


    //下载文件
    $scope.downloadFile = function (deviceId) {
        window.location.href = HTTP_BASE+'device/zip/' + deviceId + '?accountId=' + accountId;

    }
    //更新证书文件
    $scope.updateCRT = function (deviceId) {
        $scope.loadDevicePromise = $http.get(HTTP_BASE+'device/e_updateCRT?accountId=' + accountId + '&deviceId=' + deviceId + '&status=1')
            .success(function (data) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: '更新设备证书成功，设备下次连接时将自动更新',
                    dialogShown: function () {
                        setTimeout(function () {
                            $state.go('main.devicelist', {}, {reload: true})
                        }, 200)
                    }
                })
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
        $http.get(HTTP_BASE+'devicerecord/e_queryallhistory?&pageNo=1&pageSize=5&accountId=' + accountId + '&deviceId=' + deviceId)
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
                        $scope.loadDeviceHisPromise=$http.get(HTTP_BASE+'devicerecord/e_queryallhistory?&pageNo=' + page + '&pageSize=5&accountId=' + accountId + '&deviceId=' + deviceId)
                            .success(function (data) {
                                $scope.deviceHisRecordList = data.items;
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
}).filter("deviceStatusFilter", function () {
    return function (type) {
        var operateName = null;
        if (type == 0) {
            operateName = "关闭";
        } else {
            operateName = "开启";

        }
        return operateName;
    };
}).filter("deviceLocationStatusFilter", function () {
    return function (type) {
        var operateName = null;
        if (type == 0) {
            operateName = "正常信息";
        } else {
            operateName = "危险信息";
        }
        return operateName;
    };
})