/**
 * Created by li on 2016/7/10.
 */
var deviceBarModule = angular.module("monitor-frontend.deviceBarModule", ['ui.router']);
deviceBarModule.controller("DeviceBarCtrl", function ($scope, $http, $rootScope, $cookieStore, $location, $state, $filter, $timeout, $interval, HTTP_BASE) {
    function showBarChar(){
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '各省结点分布'
            },
            xAxis: {
                categories:['北京','天津','重庆','上海市','河北','山西','辽宁','吉林','黑龙江','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','海南省','四川省','贵州省','云南省','陕西省','甘肃省','青海省','广西','西藏','宁夏','新疆','香港','澳门']
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
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +'<br/>'+
                        'Total: '+ this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [ {
                name: '在线',
                data: [2, 2, 3, 2, 1,2, 2, 3, 2, 1,5, 3, 4, 7, 2,5, 3, 4, 7, 2,5, 3, 4, 7, 2,5, 3, 4, 7, 2,5, 3]
            }, {
                name: '离线',
                data: [3, 4, 4, 2, 5,3, 4, 4, 2, 5,5, 3, 4, 7, 2,5, 3, 4, 7, 2,5, 3, 4, 7, 2,5, 3, 4, 7, 2,5, 3]
            }]
        });
    }
    showBarChar();
});
