/**
 * Created by li on 2016/7/10.
 */
var deviceBarModule = angular.module("monitor-frontend.deviceBarModule", ['ui.router']);
deviceBarModule.controller("DeviceBarCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var type = $cookieStore.get("USER_TYPE");
    province = [];
    onDevice = [];
    offDevice = [];
    offAndArrearageDevice = [];
    resultArray = [];
    $scope.searchType=3;
    $scope.statisticClip = new Array(true, false);
    if (accountId) {
        function showBarChar() {
            $('#barChart').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: '各省结点分布'
                },
                xAxis: {
                    categories: province
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '各省结点总数'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -70,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        },
                    }
                },
                series: [{
                    name: '在线',
                    color: 'RGB(144,237,125)',
                    data: onDevice
                }, {
                    name: '离线',
                    color: '#ff2E33',
                    data: offDevice
                }, {
                    name: '欠费',
                    color: '#ffff93',
                    data: offAndArrearageDevice
                }]
            });
        }

        //请求设备离线在线状态按省份分类的数据
        function requestInfo(){
            $http.get(HTTP_BASE + 'device/e_queryDeviceStatus?accountId=' + accountId + '&type=' +　type)
                .success(function (data) {
                    province = [];
                    onDevice = [];
                    offDevice = [];
                    offAndArrearageDevice = [];
                    for(i = 0; i < data.length; i++)
                    {
                        temp = data[i];
                        resultArray[i] = [temp.province, temp.onDeviceNum, temp.offDeviceNum, temp.offAndArrearageDeviceNum,temp.onDeviceNum + temp.offDeviceNum]
                    }

                    resultArray.sort(function(a, b){
                        return a[4] > b[4];
                    });

                    for(i = 0; i < resultArray.length; i++)
                    {
                        temp = resultArray[i];
                        province.push(temp[0]);
                        onDevice.push(temp[1]);
                        offDevice.push(temp[2]);
                        offAndArrearageDevice.push(temp[3]);
                    }

                    showBarChar();
                });
        }
        requestInfo();

        //发送查询设备详细信息的请求
        function requestDeviceDetailInfo(){
            $http.get(HTTP_BASE + 'devicerecord/e_query?accountId=' + accountId + '&pageSize=8&pageNo=1&type=3')
                .success(function (data) {
                    $scope.deviceDetailList = data.items;
                    $scope.nowDeviceDetailTotalCount = data.totalCount;
                    $('#page1').bootstrapPaginator({
                        currentPage: 1,
                        size: "normal",
                        totalPages: data.totalPage,
                        bootstrapMajorVersion: 3,
                        onPageClicked: function (e, originalEvent, type, page) {
                            $scope.loadDevicePromise = $http.get(HTTP_BASE + 'device/e_query?accountId=' + accountId + '&pageSize=8&pageNo=' + page + '&type=3')
                                .success(function (data) {
                                    $scope.deviceDetailList = data.items;
                                    $scope.nowDeviceDetailTotalCount = data.totalCount;
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
                })
        }

        $scope.showDeviceLocationBarChart = function () {
            for(i = 0; i < 2; i++){
                $scope.statisticClip[i] = false;
            }
            $scope.statisticClip[0] = true;
            requestInfo();
        }

        //展示设备在线状况详细信息
        $scope.showDeviceLocationInfoDetail = function () {
            $("#barChart").html('');
            for(i = 0; i < 2; i++){
                $scope.statisticClip[i] = false;
            }
            $scope.statisticClip[1] = true;

            requestDeviceDetailInfo()
        }

        $scope.searchProvice = "";
        $scope.searchLessName = "";


        //查找设备执行信息并返回分页
        $scope.searchDeviceInfoDetail = function () {
            var province =  encodeURI(encodeURI($scope.searchProvice));
            var params = "&provice=" + province + "&searchLessName=" + $scope.searchLessName +
                "&type=" + $scope.searchType;
            console.log(params);
            $http.get(HTTP_BASE + 'device/e_query?accountId=' + accountId + '&pageSize=8&pageNo=1' + params)
                .success(function (data) {
                    console.log(data);
                    $scope.deviceDetailList = data.items;
                    $scope.totolCount = data.totalCount;
                    $scope.nowDeviceTotalCount = data.totalCount;
                    $('#page1').bootstrapPaginator({
                        currentPage: 1,
                        size: "normal",
                        totalPages: data.totalPage || 1,
                        bootstrapMajorVersion: 3,
                        numberOfPages: 5,
                        onPageClicked: function (e, originalEvent, type, page) {
                            $scope.loadDevicePromise = $http.get(HTTP_BASE + 'device/e_query?accountId=' + accountId + '&pageSize=8&pageNo=' + page + params)
                                .success(function (data) {
                                    $scope.deviceDetailList = data.items;
                                    $scope.nowDeviceTotalCount = data.totalCount;
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
                })
        }
    }
});
