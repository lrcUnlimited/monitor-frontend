/**
 * Created by li on 2016/7/10.
 */
var devicePieModule = angular.module("monitor-frontend.devicePieModule", ['ui.router']);
devicePieModule.controller("DevicePieCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var type = $cookieStore.get("USER_TYPE");
    onDevice = [];
    offDevice = [];
    if (accountId) {
        function showPieChartOne() {
            $('#pieContainerOne').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
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
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: [
                        onDevice,
                        offDevice
                    ]
                }]
            });
        }

        function showPieChartTwo(){
            $('#pieContainerTwo').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
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
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: [
                        ['Firefox', 45.0],
                        ['IE', 26.8],
                        {
                            name: 'Chrome',
                            y: 12.8,
                            sliced: true,
                            selected: true
                        },
                        ['Safari', 8.5],
                        ['Opera', 6.2],
                        ['Others', 0.7]
                    ]
                }]
            });
        }

        function requestTotalNumOfDeviceStatus(){
            $http.get(HTTP_BASE + 'device/e_queryTotalNumOfDeviceStatus?accountId=' + accountId + '&type=' +　type)
                .success(function (data) {
                    onDevice = ['在线', data[0]];
                    offDevice = ['离线', data[1]];

                    showPieChartOne();
                });
        }

        function requestLesseeDeviceInfo(){
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformation?accountId=' + accountId + '&type=' +　type)
                .success(function (data) {
                    for(i = 0; i < data.length; i++)
                    {

                    }
                });
        }
    }
    requestTotalNumOfDeviceStatus();
    requestLesseeDeviceInfo();
});
