/**
 * Created by li on 2016/5/13.
 */
/**
 * Created by li on 2016/5/9.
 */
var addDeviceModule = angular.module("monitor-frontend.addDeviceModule", ['cgBusy'])
addDeviceModule.controller("AddDeviceCtrl", function ($scope, $location, $cookieStore, $http,$state,HTTP_BASE) {
    var accountId = $cookieStore.get("USER_ID");//获取用户登录id
    $('#datepicker').datepicker({
        autoclose: true,
        startDate:new Date(),
        todayHighlight:true
    }).on("changeDate", function (e) {
        $scope.validTime = e.date;
    });
    $scope.addDevice = function () {
        var dateNow = new Date();
        if(dateNow>$scope.validTime){
            $.teninedialog({
                title: '<h3 style="font-weight:bold">系统提示</h3>',
                content: "有效期不能小于当前时间"
            });
        }else{
            var data = {
                deviceName: $scope.deviceName,
                validTime:$scope.validTime,
                lesseeName:$scope.lesseeName,
                lesseePhone:$scope.lesseePhone
            };
            if(!data.deviceName){
                dialogShow("请输入设备名");
                return
            }
            if(!data.lesseeName){
                dialogShow("请输入租赁商名称")
                return
            }
            if(!data.lesseePhone){
                dialogShow("请输入租赁商电话")
                return
            }
            $scope.addDevicePromise = $http.post(HTTP_BASE+"device/e_add?accountId=" + accountId, data)
                .success(function (data) {
                    $.teninedialog({
                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                        content: '添加设备成功',
                        dialogShown: function () {
                            setTimeout(function () {
                                $state.go('main.devicelist', {}, {reload: true})
                            }, 200)
                        }


                    })
                })
                .error(function (data) {
                    $.teninedialog({
                        title: '<h3 style="font-weight:bold">系统提示</h3>',
                        content: data.message
                    });
                })
        }


    }
    function dialogShow(msg){
        $.teninedialog({
            title: '<h3 style="font-weight:bold">系统提示</h3>',
            content:msg
        });
    }


})

