/**
 * Created by li on 2016/5/4.
 */
var webSocketProvider = angular.module("monitor-frontend.webSocketService", ["ngResource", 'ngWebSocket']);
webSocketProvider.factory('Messages', function ($websocket, $cookieStore) {
    var userId = $cookieStore.get("USER_ID");
    if (userId) {
        var ws = $websocket('ws://localhost:8080/monitor/websocket/' + userId);
        var collection = [];
        ws.onMessage(function (event) {
            var res;
            try {
                res = JSON.parse(event.data);
            } catch (e) {
                res = {'username': 'anonymous', 'message': event.data};
            }
            collection.push({
                username: res.username,
                content: res.message,
                timeStamp: event.timeStamp
            });
        });

        ws.onError(function (event) {
            console.log('connection Error', event);
        });

        ws.onClose(function (event) {
            console.log('connection closed', event);
        });

        ws.onOpen(function () {
            console.log('connection open');
        });


        return {
            collection: collection,
            status: function () {
                return ws.readyState;
            },
            send: function (message) {
                if (angular.isString(message)) {
                    ws.send(message);
                }
                else if (angular.isObject(message)) {
                    ws.send(JSON.stringify(message));
                }
            }

        };
    }
})