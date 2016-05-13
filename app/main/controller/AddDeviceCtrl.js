/**
 * Created by li on 2016/5/13.
 */
/**
 * Created by li on 2016/5/9.
 */
var addDeviceModule = angular.module("monitor-frontend.addDeviceModule", ['cgBusy'])
addDeviceModule.controller("AddDeviceCtrl", function ($scope, $location, $cookieStore, $http) {

    $('#datepicker').datepicker({
        autoclose: true,
    }).on("changeDate", function (e) {
        console.log(e.date);
    });



})
