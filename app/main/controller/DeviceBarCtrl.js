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
    if (accountId) {
        function showBarChar() {
            $('#container').highcharts({
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

        $scope.showDeviceLocationBarChart = function () {
            requestInfo();
        }

        $scope.showDeviceLocationInfoDetail = function () {
            requestInfo();
        }
    }
});
