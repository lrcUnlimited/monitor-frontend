/**
 * Created by li on 2016/7/10.
 */
var devicePieModule = angular.module("monitor-frontend.devicePieModule", ['ui.router']);
devicePieModule.controller("DevicePieCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {
    function showPieChart() {
        $('#pieContainer').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '饼图示例'
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
