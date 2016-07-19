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
    $scope.arrearageTitle = {'1':'月欠费率', '4' : '季度欠费率', '6' : '半年欠费率', '12' : '年欠费率'};
    // 初始化日期控件

    $scope.dateFilter = $filter('date');
    $scope.YearDate = $scope.dateFilter(new Date(),  'yyyy');
    $scope.MonthDate = $scope.dateFilter(new Date(),  'MM');
    if($scope.MonthDate<10){
        var temp = $scope.MonthDate.toString();
        $scope.MonthDate = temp[1];
    }
    

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
                   // console.log(data);
                    var all =data[0][0]+data[1][0];
                    var onDevicePercentage = (data[0][0]/all)*100;
                    var offDevicePercentage = ((data[1][0] - data[2][0])/all)*100;
                    var arrearDevicePercentage = (data[2][0]/all)*100;

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
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled:false
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
                                ['开机'+'('+onDevicePercentage+'%)', data[0][0]],
                                ['关机'+'('+offDevicePercentage+'%)', data[1][0] - data[2][0]],
                                ['欠费'+'('+arrearDevicePercentage+'%)', data[2][0]]
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
                            //console.log(ArrearTemp);

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
                            text: '租赁欠费率'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled:false
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
                        arrearagePercentageArray.push(columnDataOne[i].percentage * 100);
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
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: '最差租赁商TOP10'
                        },
                        exporting: {
                            enabled:false
                        },
                        xAxis: {
                            categories: lesseeNameArray
                        },

                        yAxis: {
                            allowDecimals: false,
                            min: 0,
                            max:100,
                            title: {
                                text: '欠费率(%)'
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled:false
                        },
                        tooltip: {
                            headerFormat: '<b>{point.key}</b><br>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
                        },

                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                depth: 40
                            }
                        },

                        series: [{
                            name:'欠费率',
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
                        arrearagePercentageArray.push(columnDataOne[i].percentage * 100);
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
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled:false
                        },
                        title: {
                            text: '优质租赁商TOP10'
                        },

                        xAxis: {
                            categories: lesseeNameArray
                        },

                        yAxis: {
                            allowDecimals: false,
                            min: 0,
                            max:100,
                            title: {
                                text: '欠费率(%)'
                            }
                        },

                        tooltip: {
                            headerFormat: '<b>{point.key}</b><br>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>'
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

            // $scope.YearDate = $scope.dateFilter(new Date(),  'yyyy');
            //$scope.MonthDate = $scope.dateFilter(new Date(),  'MM');
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=1&month=' + $scope.arrearageTime + "&endYear=" + $scope.dateFilter(new Date(),  'yyyy') + "&endMonth=" + $scope.dateFilter(new Date(),  'MM').toString())
                .success(function (data) {
                    console.log(data);

                    $scope.deviceDetailList = data.items;
                    $scope.nowDeviceDetailTotalCount = data.totalCount;
                    $scope.printList = data.items;
                    //console.log($scope.printList);

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

            if($scope.StartYear == null) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: "时间范围有误"
                });
                return;
            } else if($scope.StartYear < $scope.YearDate ) {
                month = ($scope.StartYear - $scope.YearDate) * 12 + $scope.MonthDate - $scope.StartMonth;
            } else if($scope.StartYear == $scope.YearDate &&　$scope.StartMonth < $scope.MonthDate){
                month = $scope.MonthDate - $scope.StartMonth;
            } else if($scope.StartYear > $scope.YearDate) {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: "时间范围有误"
                });
                return;
            } else {
                $.teninedialog({
                    title: '<h3 style="font-weight:bold">系统提示</h3>',
                    content: "时间范围有误"
                });
                return;
            }

            var params = "&lesseeName=" + lesseeName + "&arrearagePercentageType=" + $scope.arrearagePercentageType + "&month=" + month + '&startYear=' + $scope.StartYear +　"&startMonth="
                + $scope.StartMonth + "&endYear=" + $scope.YearDate + "&endMonth=" + $scope.MonthDate + "&type=1";

            console.log(params);
            $http.get(HTTP_BASE + 'device/e_queryLesseeDeviceInformationPager?accountId=' + accountId + '&pageSize=8&pageNo=1' + params)
                .success(function (data) {
                   // console.log(data);
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
           // console.log(params);
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

        //设备打印
        function convertJsonToArray(jsonArray) {
            var infos_array = [];
            for (var i in jsonArray) {
                var info = jsonArray[i];

                var info_array = [];
                var index = 0;

                info_array[index++] = info['percentage'].toString();
                info_array[index++] = info['lessee'];
                info_array[index++] = info['lesseePhone'];
                info_array[index++] = info['arrearageDeviceNum'].toString();
                info_array[index++] = info['arrearageDeviceNum'].toString();
                info_array[index++] = info['arrearageDeviceNum'].toString();

                infos_array.push(info_array);
            }

            return infos_array;
        }

        //打印换行控制函数
        function lineWrap(data, partLen) {
            if (data == null || data.length == 0) {
                return '暂无数据';
            }
            if (data.length <= 6) {
                return data;
            }
            var index = data.length / partLen;
            var i = 0;
            var newStr = [];
            while (i < index) {
                newStr.push(data.substr(i * partLen, partLen));
                i++;
            }
            return newStr.join('\n');
        }

        $scope.printData = function () {
            var headerName = "";

            var printData = convertJsonToArray($scope.printList);
            //console.log(printData);
            if ($scope.pdtOnSale[2]) {
                headerName = '租赁商欠费率统计表';
                if($scope.arrearageTime == 1){
                    arrearageType = "月欠费率"
                } else if ($scope.arrearageTime == 4) {
                    arrearageType = "季度欠费率"
                } else if ($scope.arrearageTime == 6) {
                    arrearageType = "半年欠费率"
                } else if ($scope.arrearageTime == 12) {
                    arrearageType = "年欠费率"
                }

                printData.unshift([arrearageType, '租赁商', '租赁商电话', '欠费设备数', '欠费累计台次', '设备总数'])
            }

            pdfMake.fonts = {
                msyh: {
                    normal: 'msyh.ttf'
                }
            }
            var docDefinition = {
                styles: {
                    header: {
                        fontSize: 22
                    }
                },
                header: {
                    columns: [
                        {text: '打印时间:' + $scope.dateFilter(new Date(), 'yyyy-MM-dd'), alignment: 'right',margin: [ 0, 15, 20, 0 ]}
                    ]
                },
                footer: function(currentPage, pageCount) { return {text:"第"+currentPage.toString()+"页",alignment: 'center'}; },
                content: [
                    {text: headerName, alignment: 'center',margin: [ 0, 0, 0, 0 ]},
                    {text: "\n", alignment: 'center',margin: [ 0, 0, 0, 0 ]},

                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            body: printData
                        }
                    }
                ],
                defaultStyle: {
                    font: 'msyh'
                }
            };        // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();
        }

    }
}).filter("arrearagePercentageFilter", function () {
    return function (arrearagePercentage) {

        return (arrearagePercentage * 100).toFixed(2);
    };
})


