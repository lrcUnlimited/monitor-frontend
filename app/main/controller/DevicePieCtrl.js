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
        $scope.showPieChartOne = function() {
            $("#ContainerOne").css({
                "display" : "block"
            })
            $("#ContainerTwo").css({
                "display" : "none"
            })
            $("#ContainerThree").css({
                "display" : "none"
            })
                $('#ContainerOne').highcharts({
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
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
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        data: [
                            ['Firefox',   45.0],
                            ['IE',       26.8],
                            {
                                name: 'Chrome',
                                y: 12.8,
                                sliced: true,
                                selected: true
                            },
                            ['Safari',    8.5],
                            ['Opera',     6.2],
                            ['Others',   0.7]
                        ]
                    }]
                });
        }

        $scope.showPieChartTwo = function() {
            $("#ContainerTwo").css({
                "display" : "block"
            })
            $("#ContainerOne").css({
                "display" : "none"
            })
            $("#ContainerThree").css({
                "display" : "none"
            })
            $('#columnContainerOne').highcharts({

                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        viewDistance: 25,
                        depth: 40
                    },
                    marginTop: 80,
                    marginRight: 40
                },

                title: {
                    text: '前10名欠费率（低）'
                },

                xAxis: {
                    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: '欠费率'
                    }
                },

                tooltip: {
                    headerFormat: '<b>{point.key}</b><br>',
                    pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
                },

                plotOptions: {
                    column: {
                        stacking: 'normal',
                        depth: 40
                    }
                },

                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2],
                    stack: 'male'
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, 2, 5],
                    stack: 'male'
                }, {
                    name: 'Jane',
                    data: [2, 5, 6, 2, 1],
                    stack: 'female'
                }, {
                    name: 'Janet',
                    data: [3, 0, 4, 4, 3],
                    stack: 'female'
                }]
            });
            $('#columnContainerTwo').highcharts({

                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        viewDistance: 25,
                        depth: 40
                    },
                    marginTop: 80,
                    marginRight: 40
                },

                title: {
                    text: '前10名欠费率（高）'
                },

                xAxis: {
                    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: '欠费率'
                    }
                },

                tooltip: {
                    headerFormat: '<b>{point.key}</b><br>',
                    pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
                },

                plotOptions: {
                    column: {
                        stacking: 'normal',
                        depth: 40
                    }
                },

                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2],
                    stack: 'male'
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, 2, 5],
                    stack: 'male'
                }, {
                    name: 'Jane',
                    data: [2, 5, 6, 2, 1],
                    stack: 'female'
                }, {
                    name: 'Janet',
                    data: [3, 0, 4, 4, 3],
                    stack: 'female'
                }]
            });
        }

        $scope.showPieChartThree = function() {
            $("#ContainerThree").css({
                "display": "block"
            })
            $("#ContainerOne").css({
                "display" : "none"
            })
            $("#ContainerTwo").css({
                "display" : "none"
            })
        }

        //function requestTotalNumOfDeviceStatus() {
        //    $http.get(HTTP_BASE + 'device/e_queryTotalNumOfDeviceStatus?accountId=' + accountId + '&type=' + type)
        //        .success(function (data) {
        //            onDevice = ['在线', data[0][0] / (data[0][0] + data[1][0])];
        //            offDevice = ['离线', data[1][0] / (data[0][0] + data[1][0])];
        //            showPieChartOne();
        //        });
        //}

        //function requestArrearagePercentage(){
        //    $http.get(HTTP_BASE + 'device/e_queryArrearagePercentage?accountId=' + accountId + '&type=' + type)
        //        .success(function (data) {
        //            for(i = 0; i < data.length; i++){
        //                arrearagePercentageArray.push([data[i].lessee, data[i].percantage]);
        //            }
        //            showPieChartTwo();
        //        });
        //
        //}


        //function requestLesseeDeviceInfo() {
        //    $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformation?accountId=' + accountId + '&type=' + type)
        //        .success(function (data) {
        //            $scope.lesseeDeviceInfoList = data;
        //        });
        //}

        //requestTotalNumOfDeviceStatus();
        //requestArrearagePercentage();
        //requestLesseeDeviceInfo();

    }

});


