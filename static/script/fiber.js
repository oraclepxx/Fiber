/**
 * Created by xinpan on 05/21/2015.
 */

var fiber = angular.module('fiber', []);

fiber.controller('fiberCtrl', function ($scope, $http) {
    $http.get('/user/profile').success(function (data, status, headers, config) {
        $scope.user = data;
        $scope.error = "";
    }).error(function (data, status, headers, config) {
        $scope.user = {};
        $scope.error = "";
    });
});