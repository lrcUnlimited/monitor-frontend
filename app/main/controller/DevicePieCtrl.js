/**
 * Created by li on 2016/7/10.
 */
var devicePieModule = angular.module("monitor-frontend.devicePieModule", ['ui.router']);
devicePieModule.controller("DevicePieCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {

    function showPieChart() {
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
                    {
                        name: '在线',
                        y: 55.0,
                        sliced: true,
                        selected: true
                    },
                    ['离线', 45.0],
                ]
            }]
        });
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

    showPieChart();
});
