/**
 * Created by li on 2016/7/10.
 */
var devicePieModule = angular.module("monitor-frontend.devicePieModule", ['cgBusy','ui.router']);
devicePieModule.controller("DevicePieCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");
    var type = $cookieStore.get("USER_TYPE");
    onDevice = [];
    offDevice = [];
    arrearagePercentageArray = [];
    $scope.pdtOnSale = new Array(true, false, false);
    $scope.arrearagePercentage = 0;
    $scope.arrearagePercentageType = -1;
    $scope.arrearageTime = 1;
    if (accountId) {
        $scope.alreadyPdtList = function (t) {
            var i = 2;
            while (i >= 0) {
                $scope.pdtOnSale[i] = false;
                i--;
            }
            $scope.pdtOnSale[t] = true;

        }

        $scope.showPieChartOne = function () {
            $("#ContainerTwo").css({
                "display": "none"
            })
            $("#ContainerOne").css({
                "display": "block"
            })
            $("#ContainerThree").css({
                "display": "none"
            })
            showChartOnClipOne();
        }
        showChartOnClipOne();
        function showChartOnClipOne() {

            $http.get(HTTP_BASE + 'device/e_queryTotalNumOfDeviceStatus?accountId=' + accountId + '&type=' +　type)
                .success(function (data) {
                    console.log(data);
                    $('#pieContainerOne').highcharts({
                        chart: {
                            type: 'pie',
                            options3d: {
                                enabled: true,
                                alpha: 60,
                                beta: 0
                            }
                        },
                        title: {
                            text: '开、关、欠费机总数比例'
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
                            name: '占比',
                            data: [
                                ['开机', data[0][0]],
                                ['关机', data[1][0] - data[2][0]],
                                {
                                    name: '欠费',
                                    y: data[2][0],
                                    sliced: true,
                                    selected: true
                                }
                            ]
                        }]
                    });
                });
            $http.get(HTTP_BASE + 'device/e_queryArrearagePercentage?accountId=' + accountId + '&type=' +　type + '&month=' + $scope.arrearageTime)
                .success(function (data) {
                            console.log(data);

                            ArrearPercentageNum = [0, 0, 0, 0, 0, 0, 0, 0];
                            ArrearPercentageStatus = ['无欠费','0%-5%', '5%-10%', '10%-15%', '15%-20%', '20%-25%', '25%-30%', '>30%'];

                            for (i = 0; i < data.length; i++) {
                                //console.log(data[i].percentage);
                                if (data[i].percentage ==  parseFloat("0")) {
                                    ArrearPercentageNum[0] += 1;
                                } else if ((data[i].percentage >= parseFloat("0")) && (data[i].percentage < parseFloat("0.05"))) {
                                    ArrearPercentageNum[1] += 1;
                                } else if ((data[i].percentage >= parseFloat("0.05")) && (data[i].percentage <parseFloat("0.1"))) {
                                    ArrearPercentageNum[2] += 1;
                                } else if ((data[i].percentage >= parseFloat("0.1")) && (data[i].percentage < parseFloat("0.15"))) {
                                    ArrearPercentageNum[3] += 1;
                                } else if ((data[i].percentage >= parseFloat("0.15")) && (data[i].percentage < parseFloat("0.20"))) {
                                    ArrearPercentageNum[4] += 1;
                                } else if ((data[i].percentage >= parseFloat("0.20")) && (data[i].percentage < parseFloat("0.25"))) {
                                    ArrearPercentageNum[5] += 1;
                                } else if ((data[i].percentage >= parseFloat("0.25")) && (data[i].percentage < parseFloat("0.30"))) {
                                    ArrearPercentageNum[6] += 1;
                                } else {
                                    ArrearPercentageNum[7] += 1;
                                }
                            }
                            ArrearTemp = [];
                            resultArrearageArray =[];
                            for (i = 0; i < ArrearPercentageNum.length; i++) {
                                ArrearTemp[i] = [ArrearPercentageStatus[i],ArrearPercentageNum[i]];
                            }
                            for (i = 0; i < ArrearTemp.length; i++) {
                                if(ArrearTemp[i][1] != 0){
                                    resultArrearageArray.push(ArrearTemp[i]);
                                }
                            }
                            console.log(ArrearTemp);

                $('#pieContainerTwo').highcharts({
                        chart: {
                            type: 'pie',
                            options3d: {
                                enabled: true,
                                alpha: 60,
                                beta: 0
                            }
                        },
                        title: {
                            text: '欠费率'
                        },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ '租赁商个数' +'</b>: '+''+
                                Highcharts.numberFormat(this.y, 0, ',') ;
                        }
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
                            data: resultArrearageArray,
                        }]
                    });
                });
        }

        $scope.showPieChartTwo = function () {
            $("#ContainerTwo").css({
                "display": "block"
            })
            $("#ContainerOne").css({
                "display": "none"
            })
            $("#ContainerThree").css({
                "display": "none"
            })
            $http.get(HTTP_BASE + 'device/e_queryArrearagePercentage?accountId=' + accountId + '&type=' +　type + '&month=' + $scope.arrearageTime)
                .success(function (data) {
                    $scope.arrearagePercentageInformationList = data;

                    arrearagePercentageArray = [];
                    lesseeNameArray = [];
                    resultArray = data;
                    resultArray.sort(function(a, b){
                        return a.percentage > b.percentage;
                     });
                    columnDataOne = resultArray.slice(0, 9);
                    for(i = 0; i < columnDataOne.length; i++){
                        lesseeNameArray.push(columnDataOne[i].lessee);
                        arrearagePercentageArray.push(columnDataOne[i].percentage);
                    }

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
                            categories: lesseeNameArray
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
                        },

                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                depth: 40
                            }
                        },

                        series: [{
                            name:'租赁商',
                            data: arrearagePercentageArray
                        }]
                    });

                    arrearagePercentageArray = [];
                    lesseeNameArray = [];
                    resultArray = data;
                    resultArray.sort(function(a, b){
                        return a.percentage < b.percentage;
                    });
                    columnDataOne = resultArray.slice(0, 9);
                    for(i = 0; i < columnDataOne.length; i++){
                        lesseeNameArray.push(columnDataOne[i].lessee);
                        arrearagePercentageArray.push(columnDataOne[i].percentage);
                    }

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
                            categories: lesseeNameArray
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
                            name:'租赁商',
                            data: arrearagePercentageArray,
                        }]
                    });
                });
        }

        $scope.showPieChartThree = function () {
            $("#ContainerThree").css({
                "display": "block"
            })
            $("#ContainerOne").css({
                "display": "none"
            })
            $("#ContainerTwo").css({
                "display": "none"
            })
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=1&type=3&month=' + $scope.arrearageTime)
                .success(function (data) {
                    console.log(data);
                    $scope.deviceDetailList = data.items;
                    $scope.nowDeviceDetailTotalCount = data.totalCount;
                    $('#page1').bootstrapPaginator({
                        currentPage: 1,
                        size: "normal",
                        totalPages: data.totalPage,
                        bootstrapMajorVersion: 3,
                        onPageClicked: function (e, originalEvent, type, page) {
                            $scope.loadDevicePromise = $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=' + page + '&type=3&month=' + $scope.arrearageTime)
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

        $scope.searchArrearageLesseeInfo = function (){
            var lesseeName = "";
            if($scope.searchExceptionLessName == null){
                lesseeName = "";
            } else {
                lesseeName = $scope.searchExceptionLessName;
            }
            var params = "&lesseeName=" + lesseeName + "&arrearagePercentageType=" + $scope.arrearagePercentageType + "&month=" + $scope.arrearageTime;
            console.log(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=1' + params);
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=1' + params)
                .success(function (data) {
                    console.log(data);
                    $scope.deviceDetailList = data.items;
                    $scope.nowDeviceDetailTotalCount = data.totalCount;
                    $('#page1').bootstrapPaginator({
                        currentPage: 1,
                        size: "normal",
                        totalPages: data.totalPage,
                        bootstrapMajorVersion: 3,
                        onPageClicked: function (e, originalEvent, type, page) {
                            $scope.loadDevicePromise = $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=' + page + params)
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
        //function requestTotalNumOfDeviceStatus() {
        //    $http.get(HTTP_BASE + 'device/e_queryTotalNumOfDeviceStatus?accountId=' + accountId + '&type=' + type)
        //        .success(function (data) {
        //            onDevice = ['在线', data[0][0] / (data[0][0] + data[i][1][0])];
        //            offDevice = ['离线', data[i][1][0] / (data[0][0] + data[i][1][0])];
        //            showPieChartOne();
        //        });
        //}

        //function requestArrearagePercentage() {
        //    $http.get(HTTP_BASE + 'device/e_queryArrearagePercentage?accountId=' + accountId + '&type=' + type)
        //        .success(function (data) {
        //            for (i = 0; i < data.length; i++) {
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

        //请求按设备租赁商分类的设备信息
        $scope.searchLesseeDeviceInfo = function () {
            //var province =  encodeURI(encodeURI($scope.searchProvice));
            var params = "";
            console.log(params);
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformation?accountId=' + accountId + '&pageSize=8&pageNo=1' + params)
                .success(function (data) {
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
                            $scope.loadDevicePromise = $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformation?accountId=' + accountId + '&pageSize=8&pageNo=' + page + params)
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
})


