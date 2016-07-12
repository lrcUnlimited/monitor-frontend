/**
 * Created by li on 2016/7/10.
 */
var devicePieModule = angular.module("monitor-frontend.devicePieModule", ['ui.router']);
devicePieModule.controller("DevicePieCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var type = $cookieStore.get("USER_TYPE");
    onDevice = [];
    offDevice = [];
    arrearagePercentageArray = [];
    if (accountId) {
        function showPieChartOne() {
            $('#pieContainerOne').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '在线（离线）百分比'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [
                        onDevice,
                        offDevice
                    ]
                }]
            });
        }

        function showPieChart() {

            $(function () {
                $('#pieContainerTwo').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '欠费率'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Brands',
                        colorByPoint: true,
                        data: [{
                            name: 'Firefox',
                            y: 56.33
                        }, {
                            name: 'Chrome',
                            y: 24.03,
                            sliced: true,
                            selected: true
                        }, {
                            name: 'IE',
                            y: 10.38
                        }, {
                            name: 'Safari',
                            y: 4.77
                        }, {
                            name: 'Opera',
                            y: 0.91
                        }, {
                            name: 'others',
                            y: 0.2
                        }]
                    }]
                });
            });

        }

        function showPieChartTwo() {
            $('#pieContainerTwo').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '欠费率'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: arrearagePercentageArray,
                }]
            });
        }

        function requestTotalNumOfDeviceStatus() {
            $http.get(HTTP_BASE + 'device/e_queryTotalNumOfDeviceStatus?accountId=' + accountId + '&type=' + type)
                .success(function (data) {
                    onDevice = ['在线', data[0][0] / (data[0][0] + data[1][0])];
                    offDevice = ['离线', data[1][0] / (data[0][0] + data[1][0])];
                    showPieChartOne();
                });
        }

        function requestArrearagePercentage(){
            $http.get(HTTP_BASE + 'device/e_queryArrearagePercentage?accountId=' + accountId + '&type=' + type)
                .success(function (data) {
                    for(i = 0; i < data.length; i++){
                        arrearagePercentageArray.push([data[i].lessee, data[i].percantage]);
                    }
                    showPieChartTwo();
                });

        }


        function requestLesseeDeviceInfo() {
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformation?accountId=' + accountId + '&type=' + type)
                .success(function (data) {
                    $scope.lesseeDeviceInfoList = data;
                });
        }

        requestTotalNumOfDeviceStatus();
        requestArrearagePercentage();
        requestLesseeDeviceInfo();

    }
});


